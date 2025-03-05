<?php

namespace App\Service\AuthService;

use App\Entity\User;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;

class AuthService implements AuthServiceInterface
{
    public function __construct(
        private JWTTokenManagerInterface $jwtManager
    ) {
    }

    public function generateToken(
        User $user
    ): array {
        $token = $this->jwtManager->createFromPayload(
            $user,
            ['user_id' => $user->getId()]
        );

        return [
            'token' => $token,
            'username' => $user->getUsername(),
            'user_id' => $user->getId()
        ];
    }
}
