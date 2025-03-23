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
            [
                'user_id' => $user->getId(),
                'roles' => $user->getRoles(),
                'courses' => array_map(
                    fn ($course) => [
                        'id' => $course->getId(), 'title' => $course->getTitle()],
                    $user->getCourses()->toArray()
                )
            ]
        );

        return [
            'token' => $token,
            'username' => $user->getUsername(),
            'picture' => $user->getPicture(),
            'user_id' => $user->getId(),
            'user_role' => $user->getRoles(),
            'courses' => array_map(
                fn ($course) => [
                        'id' => $course->getId(), 'title' => $course->getTitle()],
                $user->getCourses()->toArray()
            )
        ];
    }
}
