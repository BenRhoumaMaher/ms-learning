<?php

namespace App\Service\UserService;

use App\Entity\User;

interface UserServiceInterface
{
    public function validateUserData(
        array $data
    ): array;
    public function userExists(
        string $email
    ): bool;
    public function createUser(
        string $email,
        string $firstname,
        string $lastname,
        ?string $googleId,
        ?string $plainPassword
    ): User;
}
