<?php

namespace App\Tests\DataProvider;

class RegisterDataProvider
{
    public static function emptyFieldsDataProvider(): array
    {
        return [
            [
                [
                    'email' => '',
                    'firstname' => '',
                    'lastname' => '',
                    'password' => '',
                    'confirmPassword' => '',
                ],
                400],
            [
                [
                    'email' => 'test@gmail.com',
                    'firstname' => '',
                    'lastname' => 'Ben Rhouma',
                    'password' => 'Test@0258',
                    'confirmPassword' => 'Test@0258',
                ],
                400],
        ];
    }

    public function validSignupDataProvider(): array
    {
        return [
            'valid_user' => [
                [
                    'firstname' => 'Maher',
                    'lastname' => 'Ben Rhoumaa',
                    'email' => 'maherbenrhouma@example.com',
                    'username' => 'Maher Ben Rhoumaa',
                    'password' => 'SecurePass1!',
                    'confirmPassword' => 'SecurePass1!',
                ],
                201,
            ],
        ];
    }

    public static function passwordValidationDataProvider(): array
    {
        return [
            [
                [
                    'email' => 'test@gmail.com',
                    'firstname' => 'Test',
                    'lastname' => 'User',
                    'password' => 'short0000',
                    'confirmPassword' => 'short0000',
                ],
                400,
                'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character (@$!%*?&)',
            ],
        ];
    }

    public static function redirectAfterSignupDataProvider(): array
    {
        return [
            [
                [
                    'email' => 'redirect@gmail.com',
                    'firstname' => 'Redirect',
                    'lastname' => 'User',
                    'password' => 'Redirect@123',
                    'confirmPassword' => 'Redirect@123',
                ], 201],
        ];
    }
}
