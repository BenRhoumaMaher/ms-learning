<?php

namespace App\Tests\AuthTests;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class RegisterTest extends WebTestCase
{
    private $client;

    private $entityManager;

    protected function setUp(): void
    {
        $this->client = static::createClient();
        $this->entityManager = $this->client->getContainer()
            ->get('doctrine')->getManager();

        // Remove any existing test users
        $users = $this->entityManager->getRepository(User::class)
            ->findBy([
                'email' => 'maherbenrhouma@example.com',
            ]);

        foreach ($users as $user) {
            $this->entityManager->remove($user);
        }

        $this->entityManager->flush();
    }

    protected function tearDown(): void
    {
        // Clean up any created users
        $users = $this->entityManager->getRepository(User::class)
            ->findBy([
                'email' => 'maherbenrhouma@example.com',
            ]);

        foreach ($users as $user) {
            $this->entityManager->remove($user);
        }

        $this->entityManager->flush();

        parent::tearDown();
    }

    /**
     * @dataProvider \App\Tests\DataProvider\RegisterDataProvider::emptyFieldsDataProvider
     */
    public function testEmptyRegisterFields(
        array $userData,
        int $expectedStatusCode
    ): void {
        $this->client->request(
            'POST',
            'http://localhost:8080/api/register',
            [],
            [],
            [
                'CONTENT_TYPE' => 'application/json',
            ],
            json_encode($userData)
        );

        $this->assertResponseStatusCodeSame($expectedStatusCode);
    }

    /**
     * @dataProvider \App\Tests\DataProvider\RegisterDataProvider::validSignupDataProvider
     */
    public function testValidSignup(array $userData, int $expectedStatusCode): void
    {
        $this->client->request(
            'POST',
            'http://localhost:8080/api/register',
            [],
            [],
            [
                'CONTENT_TYPE' => 'application/json',
            ],
            json_encode($userData)
        );

        $this->assertResponseStatusCodeSame($expectedStatusCode);

        if ($expectedStatusCode === 201) {
            $responseContent = json_decode(
                $this->client->getResponse()
                    ->getContent(),
                true
            );
            $this->assertEquals(
                'User registered successfully',
                $responseContent['message']
            );
        }
    }

    /**
     * @dataProvider \App\Tests\DataProvider\RegisterDataProvider::passwordValidationDataProvider
     */
    public function testPasswordValidation(
        array $userData,
        int $expectedStatusCode,
        string $expectedMessage
    ): void {
        $this->client->request(
            'POST',
            'http://localhost:8080/api/register',
            [],
            [],
            [
                'CONTENT_TYPE' => 'application/json',
            ],
            json_encode($userData)
        );

        $response = $this->client->getResponse();
        $this->assertEquals(
            $expectedStatusCode,
            $response->getStatusCode(),
            "Expected status code {$expectedStatusCode} but got {$response->getStatusCode()}. Response: ".$response->getContent()
        );

        if ($expectedStatusCode === 400) {
            $responseContent = json_decode($response->getContent(), true);
            $this->assertArrayHasKey('errors', $responseContent);
            $errorMessages = implode(', ', array_values($responseContent['errors']));
            $this->assertStringContainsString($expectedMessage, $errorMessages);
        }
    }

    /**
     * Test that duplicate registration is not allowed.
     */
    public function testUserAlreadyExists(): void
    {
        $userData = [
            'firstname' => 'Maher',
            'lastname' => 'Ben Rhouma',
            'email' => 'maherbenrhouma@example.com',
            'password' => 'SecurePass123!',
            'confirmPassword' => 'SecurePass123!',
        ];

        $this->client->request(
            'POST',
            'http://localhost:8080/api/register',
            [],
            [],
            [
                'CONTENT_TYPE' => 'application/json',
            ],
            json_encode($userData)
        );
        $this->assertResponseStatusCodeSame(201);

        $this->client->request(
            'POST',
            'http://localhost:8080/api/register',
            [],
            [],
            [
                'CONTENT_TYPE' => 'application/json',
            ],
            json_encode($userData)
        );

        $this->assertResponseStatusCodeSame(400);

        $responseContent = json_decode(
            $this->client->getResponse()
                ->getContent(),
            true
        );
        $this->assertArrayHasKey('errors', $responseContent);
        $this->assertArrayHasKey('email', $responseContent['errors']);
        $this->assertEquals(
            'User already exists',
            $responseContent['errors']['email']
        );
    }

    /**
     * @dataProvider \App\Tests\DataProvider\RegisterDataProvider::redirectAfterSignupDataProvider
     */
    public function testRedirectAfterSignup(
        array $userData,
        int $expectedStatusCode
    ): void {
        $this->client->request(
            'POST',
            'http://localhost:8080/api/register',
            [],
            [],
            [
                'CONTENT_TYPE' => 'application/json',
            ],
            json_encode($userData)
        );

        $this->assertResponseStatusCodeSame($expectedStatusCode);

        if ($expectedStatusCode === 201) {
            $this->client->request(
                'POST',
                'http://localhost:8080/api/login',
                [],
                [],
                [
                    'CONTENT_TYPE' => 'application/json',
                ],
                json_encode(
                    [
                        'email' => $userData['email'],
                        'password' => $userData['password'],
                    ]
                )
            );
            $this->assertResponseIsSuccessful();
        }
    }
}
