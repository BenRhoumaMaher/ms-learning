<?php

namespace App\Service\AuthService;

use App\Entity\User;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;

class AuthService implements AuthServiceInterface
{
    /**
     * @param JWTTokenManagerInterface $jwtManager JWT token manager from LexikJWTAuthenticationBundle
     */
    public function __construct(
        private JWTTokenManagerInterface $jwtManager
    ) {
    }

    /**
     * Generate JWT Token for a given user
     *
     * Returns a token payload containing user details and roles.
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
    ): array {
        $token = $this->jwtManager->createFromPayload(
            $user,
            [
                'user_id' => $user->getId(),
                'roles' => $user->getRoles(),
                // 'courses' => array_map(
                //     fn ($course) => [
                //         'id' => $course->getId(), 'title' => $course->getTitle()],
                //     $user->getCourses()->toArray()
                // )
            ]
        );

        return [
            'token' => $token,
            'username' => $user->getUsername(),
            'picture' => $user->getPicture(),
            'user_id' => $user->getId(),
            'user_role' => $user->getRoles(),
            // 'courses' => array_map(
            //     fn ($course) => [
            //             'id' => $course->getId(), 'title' => $course->getTitle()],
            //     $user->getCourses()->toArray()
            // )
        ];
    }
}
