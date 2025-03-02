<?php

namespace App\Tests\DataProvider;

class RegisterDataProvider
{
    public static function emptyFieldsDataProvider(): array
    {
        return [
            [
                [
                    'email' => '', 'firstname' => '', 'lastname' => '',
                    'password' => '', 'confirmPassword' => ''
                ],
                    400],
            [
                [
                    'email' => 'test@gmail.com', 'firstname' => '',
                    'lastname' => 'Ben Rhouma', 'password' => 'Test@0258',
                    'confirmPassword' => 'Test@0258'
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
                200
            ]
        ];
    }


    public static function passwordValidationDataProvider(): array
    {
        return [
            [['email' => 'test@gmail.com', 
            'firstname' => 'Test', 'lastname' => 'User', 'password' => 'short0000', 
            'confirmPassword' => 'short0000'], 
            400, 'Password must contain at least one special character (@$!%*?&)'],
            [['email' => 'test@gmail.com', 'firstname' => 'Test', 
            'lastname' => 'User', 'password' => 'alllowercase@1', 
            'confirmPassword' => 'alllowercase@1'], 400, 
            'Password must contain at least one uppercase letter'],
            [['email' => 'test@gmail.com', 'firstname' => 'Test', 
            'lastname' => 'User', 'password' => 'MISSINGLOWER@1', 
            'confirmPassword' => 'MISSINGLOWER@1'], 400, 
            'Password must contain at least one lowercase letter'],
            [['email' => 'test@gmail.com', 'firstname' => 'Test', 
            'lastname' => 'User', 'password' => 'Mismatch@123', 
            'confirmPassword' => 'Mismatch@124'], 400, 
            'Passwords do not match'],
        ];
    }



    public static function redirectAfterSignupDataProvider(): array
    {
        return [
            [
                [
                    'email' => 'redirect@gmail.com', 
                    'firstname' => 'Redirect', 'lastname' => 'User',
                    'password' => 'Redirect@123', 
                    'confirmPassword' => 'Redirect@123']
                    , 200],
        ];
    }
}
