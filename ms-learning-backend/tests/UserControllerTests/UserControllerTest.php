<?php

namespace App\tests\UserControllerTests;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserControllerTest extends WebTestCase
{
    private $client;

    private $entityManager;

    protected function setUp(): void
    {
        $this->client = static::createClient();
        $this->entityManager = $this->client->getContainer()
            ->get('doctrine')->getManager();

        for ($i = 0; $i < 3; $i++) {
            $user = new User();
            $user->setEmail("testuser{$i}@example.com");
            $user->setFirstname("Test{$i}");
            $user->setLastname("User{$i}");
            $user->setUsername("Test User{$i}");
            $user->setPicture('/profile/avatar.png');
            $user->setPassword(
                $this->client->getContainer()
                    ->get(UserPasswordHasherInterface::class)
                    ->hashPassword($user, 'Test@1234')
            );

            $this->entityManager->persist($user);
        }
        $this->entityManager->flush();
    }

    protected function tearDown(): void
    {
        $users = $this->entityManager->getRepository(User::class)
            ->findBy(
                [
                    'email' => ['testuser0@example.com', 'testuser1@example.com',
                        'testuser2@example.com'],
                ]
            );

        foreach ($users as $user) {
            $this->entityManager->remove($user);
        }
        $this->entityManager->flush();

        parent::tearDown();
    }

    /**
     * @dataProvider \App\Tests\DataProvider\UserDataProvider::getAllUsersDataProvider
     */
    public function testGetAllUsers(
        int $expectedStatusCode,
        int $expectedCount
    ): void {
        $this->client->request(
            'GET',
            'http://localhost:8080/users',
            [],
            [],
            [
                'CONTENT_TYPE' => 'application/json',
            ]
        );

        $this->assertResponseStatusCodeSame($expectedStatusCode);

        if ($expectedStatusCode === 200) {
            $responseContent = json_decode(
                $this->client->getResponse()->getContent(),
                true
            );
            $this->assertCount(
                $expectedCount,
                $responseContent
            );
        }
    }

    /**
     * @dataProvider \App\Tests\DataProvider\UserDataProvider::deleteUserDataProvider
     */
    public function testDeleteAccount(
        int $expectedStatusCode,
        string $expectedMessage
    ): void {
        $user = $this->entityManager->getRepository(User::class)
            ->findOneBy([
                'email' => 'testuser0@example.com',
            ]);

        $this->assertNotNull($user, 'Test user not found');

        $userId = $user->getId();
        $this->assertNotNull($userId, 'User ID should not be null');

        $this->client->request(
            'DELETE',
            'http://localhost:8080/user/' . $userId,
            [],
            [],
            [
                'CONTENT_TYPE' => 'application/json',
            ]
        );

        $this->assertResponseStatusCodeSame($expectedStatusCode);

        $response = $this->client->getResponse();
        $this->assertNotNull(
            $response->getContent(),
            'Response content should not be null'
        );

        $responseContent = json_decode(
            $response->getContent(),
            true
        );
        $this->assertEquals(
            $expectedMessage,
            $responseContent['message']
        );

        $this->entityManager->clear();
        $deletedUser = $this->entityManager->getRepository(
            User::class
        )->find($userId);
        $this->assertNull(
            $deletedUser,
            'User was not deleted from database'
        );
    }

    /**
     * @dataProvider \App\Tests\DataProvider\UserDataProvider::deleteNonExistentUserDataProvider
     */
    public function testDeleteNonExistentAccount(
        int $expectedStatusCode,
        string $expectedMessage
    ): void {
        $nonExistentId = 999999;

        $this->client->request(
            'DELETE',
            'http://localhost:8080/user/' . $nonExistentId,
            [],
            [],
            [
                'CONTENT_TYPE' => 'application/json',
                'HTTP_ACCEPT' => 'application/json',
            ]
        );

        $this->assertResponseStatusCodeSame($expectedStatusCode);

        $response = $this->client->getResponse();
        $responseContent = $response->getContent();

        $this->assertNotEmpty(
            $responseContent,
            'Response content should not be empty'
        );

        $this->assertTrue(
            $response->headers->contains(
                'Content-Type',
                'application/json'
            ),
            'Response should be JSON'
        );

        $responseData = json_decode(
            $responseContent,
            true
        );
        $this->assertIsArray(
            $responseData,
            'Response should be a JSON object'
        );
        $this->assertArrayHasKey(
            'message',
            $responseData,
            'Response should contain a message key'
        );

        $this->assertEquals(
            $expectedMessage,
            $responseData['message']
        );
    }
}
