<?php

namespace App\Tests\DataProvider;

class UserDataProvider
{
    public static function getAllUsersDataProvider(): array
    {
        return [
            'successful_request' => [
                200,
                3
            ]
        ];
    }

    public static function deleteUserDataProvider(): array
    {
        return [
            'successful_deletion' => [
                200,
                'Account deleted successfully'
            ]
        ];
    }

    public static function deleteNonExistentUserDataProvider(): array
    {
        return [
            'user_not_found' => [
                404,
                'User not found'
            ]
        ];
    }
}
