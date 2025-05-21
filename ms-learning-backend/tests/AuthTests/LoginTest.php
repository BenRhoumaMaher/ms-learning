<?php

/**
 * This file contains test cases for user authentication in the MS-LEARNING platform.
 *
 * @category Tests
 * @package  App\Tests\AuthTests
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 * @project  MS-Learning (PFE Project)
 */

namespace App\Tests\AuthTests;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

/**
 * Test class for user login functionality.
 * Covers various authentication scenarios including:
 * - Empty field validation
 * - Invalid credentials
 * - Successful login
 *
 * @category Tests
 * @package  App\Tests\AuthTests
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 */
class LoginTest extends WebTestCase
{
    private $client;

    private $entityManager;

    /**
     * Set Up
     *
     * Initializes test environment before each test case:
     * - Creates HTTP client
     * - Sets up database connection
     * - Creates a test user for authentication
     */
    protected function setUp(): void
    {
        $this->client = static::createClient();
        $this->entityManager = $this->client->getContainer()
            ->get('doctrine')->getManager();

        $uniqueId = uniqid();

        $user = new User();
        $user->setEmail('mahertesting@gmail.com');
        $user->setFirstname('Test');
        $user->setLastname('User');
        $user->setUsername('Test User');
        $user->setPicture('/profile/avatar.png');
        $user->setPassword(
            $this->client->getContainer()
                ->get(UserPasswordHasherInterface::class)
                ->hashPassword($user, 'Test@1234')
        );

        $this->entityManager->persist($user);
        $this->entityManager->flush();
    }

    /**
     * Tear Down
     *
     * Cleans up test environment after each test case:
     * - Removes test user from database
     */
    protected function tearDown(): void
    {
        $user = $this->entityManager->getRepository(User::class)
            ->findOneBy([
                'email' => 'mahertesting@gmail.com',
            ]);
        if ($user) {
            $this->entityManager->remove($user);
            $this->entityManager->flush();
        }

        parent::tearDown();
    }

    /**
     * @dataProvider \App\Tests\DataProvider\LoginDataProvider::emptyFieldsDataProvider
     *
     * @param array<string, mixed> $loginData
     * @param int $expectedStatusCode
     */
    public function testLoginEmptyFields(
        array $loginData,
        int $expectedStatusCode
    ): void {
        $this->client->request(
            'POST',
            'http://localhost:8080/api/login',
            [],
            [],
            [
                'CONTENT_TYPE' => 'application/json',
            ],
            json_encode($loginData)
        );

        $this->assertResponseStatusCodeSame($expectedStatusCode);
    }

    /**
     * @dataProvider \App\Tests\DataProvider\LoginDataProvider::invalidCredentialsDataProvider
     *
     * @param array<string, mixed> $loginData
     * @param int $expectedStatusCode
     * @param string $expectedMessage
     */
    public function testInvalidCredentials(
        array $loginData,
        int $expectedStatusCode,
        string $expectedMessage
    ): void {
        $this->client->request(
            'POST',
            'http://localhost:8080/api/login',
            [],
            [],
            [
                'CONTENT_TYPE' => 'application/json',
            ],
            json_encode($loginData)
        );

        $this->assertResponseStatusCodeSame($expectedStatusCode);

        $responseContent = json_decode(
            $this->client
                ->getResponse()->getContent(),
            true
        );
        $this->assertArrayHasKey('message', $responseContent);
        $this->assertEquals($expectedMessage, $responseContent['message']);
    }

    /**
     * @dataProvider \App\Tests\DataProvider\LoginDataProvider::validLoginDataProvider
     *
     * @param array<string, mixed> $loginData
     * @param int $expectedStatusCode
     */
    public function testValidLogin(array $loginData, int $expectedStatusCode): void
    {
        $this->client->request(
            'POST',
            'http://localhost:8080/api/login',
            [],
            [],
            [
                'CONTENT_TYPE' => 'application/json',
            ],
            json_encode($loginData)
        );

        $this->assertResponseStatusCodeSame($expectedStatusCode);

        if ($expectedStatusCode === 200) {
            $responseContent = json_decode(
                $this->client->getResponse()
                    ->getContent(),
                true
            );
        }
    }
}
