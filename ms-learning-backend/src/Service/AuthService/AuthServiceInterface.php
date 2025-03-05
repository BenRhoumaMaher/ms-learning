<?php

namespace App\Service\AuthService;

use App\Entity\User;

interface AuthServiceInterface
{
    public function generateToken(
        User $user
    ): array;
}
