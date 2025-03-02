<?php

namespace App\Tests\AuthTests;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class RegisterTest extends WebTestCase
{
    private $client;

    protected function setUp(): void
    {
        $this->client = static::createClient();

        $container = self::$kernel->getContainer();
        $entityManager = $container->get('doctrine')->getManager();
        $connection = $entityManager->getConnection();

        $connection->executeStatement('SET FOREIGN_KEY_CHECKS=0;');
        $connection->executeStatement('TRUNCATE user;');
        $connection->executeStatement('SET FOREIGN_KEY_CHECKS=1;');
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
            ['CONTENT_TYPE' => 'application/json'],
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
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($userData)
        );

        $this->assertResponseStatusCodeSame($expectedStatusCode);

        if ($expectedStatusCode === 200) {
            $responseContent = json_decode(
                $this->client->getResponse()
                    ->getContent(), true
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
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($userData)
        );

        $this->assertResponseStatusCodeSame($expectedStatusCode);

        $responseContent = json_decode(
            $this->client->getResponse()->getContent(),
            true
        );
        $this->assertArrayHasKey('errors', $responseContent);
        $errorMessages = implode(', ', array_values($responseContent['errors']));
        $this->assertStringContainsString($expectedMessage, $errorMessages);
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
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($userData)
        );
        $this->assertResponseStatusCodeSame(200);

        $this->client->request(
            'POST',
            'http://localhost:8080/api/register',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($userData)
        );

        $this->assertResponseStatusCodeSame(400);

        $responseContent = json_decode(
            $this->client->getResponse()
                ->getContent(), true
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
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($userData)
        );

        $this->assertResponseStatusCodeSame($expectedStatusCode);

        if ($expectedStatusCode === 200) {
            $this->client->request(
                'POST',
                'http://localhost:8080/api/login',
                [],
                [],
                ['CONTENT_TYPE' => 'application/json'],
                json_encode(
                    [
                    'email' => $userData['email'],
                    'password' => $userData['password']
                    ]
                )
            );
            $this->assertResponseIsSuccessful();
        }
    }
}
