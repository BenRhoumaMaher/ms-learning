<?php

namespace App\Tests\DataProvider;

class UserDataProvider
{
    /**
     * @return array<string, array{int, int}>
     */
    public static function getAllUsersDataProvider(): array
    {
        return [
            'successful_request' => [
                200,
                3,
            ],
        ];
    }

    /**
     * @return array<string, array{int, string}>
     */
    public static function deleteUserDataProvider(): array
    {
        return [
            'successful_deletion' => [
                200,
                'Account deleted successfully',
            ],
        ];
    }

    /**
     * @return array<string, array{int, string}>
     */
    public static function deleteNonExistentUserDataProvider(): array
    {
        return [
            'user_not_found' => [
                404,
                'User not found',
            ],
        ];
    }
}
