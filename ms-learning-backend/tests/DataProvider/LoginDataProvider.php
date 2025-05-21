<?php

namespace App\Tests\DataProvider;

class LoginDataProvider
{
    /**
     * @return array<int, array{array<string,string>, int}>
     */
    public static function emptyFieldsDataProvider(): array
    {
        return [
            [
                [
                    'email' => '',
                    'password' => '',
                ],
                400,
            ],
            [
                [
                    'email' => 'testuser@example.com',
                    'password' => '',
                ],
                400,
            ],
            [
                [
                    'email' => '',
                    'password' => 'Test@1234',
                ],
                400,
            ],
        ];
    }

    /**
     * @return array<int, array{array<string, string>, int, string}>
     */
    public static function invalidCredentialsDataProvider(): array
    {
        return [
            [
                [
                    'email' => 'nonexistent@example.com',
                    'password' => 'WrongPassword123!',
                ],
                401,
                'Invalid credentials.',
            ],
            [
                [
                    'email' => 'testuser@example.com',
                    'password' => 'WrongPassword123!',
                ],
                401,
                'Invalid credentials.',
            ],
        ];
    }

    /**
     * @return array<int, array{array<string, string>, int}>
     */
    public static function validLoginDataProvider(): array
    {
        return [
            [
                [
                    'email' => 'mahertesting@gmail.com',
                    'password' => 'Test@1234',
                ],
                200,
            ],
        ];
    }
}
