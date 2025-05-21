<?php

namespace App\Service\AuthService;

use App\Entity\User;

interface AuthServiceInterface
{
    /**
     * Generate JWT Token for a given user
     *
     * @param User $user The user for whom to generate the token
     *
     * @return array{
     *     token: string,
     *     username: string,
     *     picture: ?string,
     *     user_id: int,
     *     user_role: array<int, string>
     * }
     */
    public function generateToken(
        User $user
    ): array;
}
