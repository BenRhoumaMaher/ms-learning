<?php

namespace App\tests\UserControllerTests;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserControllerTest extends WebTestCase
{
    private KernelBrowser $client;

    private EntityManagerInterface $entityManager;

    /**
     * Set Up
     *
     * Initializes test environment before each test case:
     * - Creates HTTP client
     * - Sets up database connection
     * - Creates 3 test users for testing scenarios
     */
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

    /**
     * Tear Down
     *
     * Cleans up test environment after each test case:
     * - Removes all test users created during setup
     */
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
     * Test Get All Users
     *
     * Verifies successful retrieval of all users with:
     * - Correct status code
     * - Expected number of users in response
     *
     * @dataProvider \App\Tests\DataProvider\UserDataProvider::getAllUsersDataProvider
     *
     * @param int $expectedStatusCode Expected HTTP response code
     * @param int $expectedCount Expected number of users in response
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
     * Test Delete Account
     *
     * Verifies successful user deletion with:
     * - Correct status code
     * - Expected success message
     * - Actual removal from database
     *
     * @dataProvider \App\Tests\DataProvider\UserDataProvider::deleteUserDataProvider
     *
     * @param int $expectedStatusCode Expected HTTP response code
     * @param string $expectedMessage Expected success message
     */
    public function testDeleteAccount(
        int $expectedStatusCode,
        string $expectedMessage
    ): void {
        $user = $this->entityManager->getRepository(User::class)
            ->findOneBy(
                [
                'email' => 'testuser0@example.com',
                ]
            );

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
        $this->assertNotFalse(
            $response->getContent(),
            'Response content should not be false'
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
     * Test Delete Non-Existent Account
     *
     * Verifies proper error handling when attempting to delete:
     * - Non-existent user ID
     * - Correct error status code
     * - Appropriate error message
     *
     * @dataProvider \App\Tests\DataProvider\UserDataProvider::deleteNonExistentUserDataProvider
     *
     * @param int $expectedStatusCode Expected HTTP error code
     * @param string $expectedMessage Expected error message
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
