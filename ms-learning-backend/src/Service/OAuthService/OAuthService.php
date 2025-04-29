<?php

namespace App\Service\OAuthService;

use App\Repository\UserRepository;
use App\Service\UserService\UserService;
use App\Service\MailService\MailServiceInterface;
use App\Service\GoogleService\GoogleTokenVerifier;
use Symfony\Component\HttpFoundation\JsonResponse;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;

class OAuthService implements OAuthServiceInterface
{
    public function __construct(
        private JWTTokenManagerInterface $jwtManager,
        private GoogleTokenVerifier $googleTokenVerifier,
        private UserService $userService,
        private MailServiceInterface $mailService,
        private UserRepository $userRepository
    ) {
    }

    public function authenticateGoogleUser(
        ?string $googleToken
    ): JsonResponse {
        if (!$googleToken) {
            return new JsonResponse(
                ['error' => 'Missing Google token'],
                400
            );
        }

        $googleUser = $this->googleTokenVerifier->verifyToken(
            $googleToken
        );

        if (!$googleUser || !isset($googleUser['email'], $googleUser['sub'])) {
            return new JsonResponse(
                ['error' => 'Invalid Google token'],
                401
            );
        }

        $email = $googleUser['email'];
        $googleId = $googleUser['sub'];
        $firstname = $googleUser['given_name'] ?? 'User';
        $lastname = $googleUser['family_name'] ?? '';
        $profilePicture = $googleUser['picture'] ?? '/profile/avatar.png';

        $user = $this->userRepository->findOneBy(
            ['email' => $email]
        );

        if (!$user) {
            $user = $this->userService->createUser(
                $email,
                $firstname,
                $lastname,
                $googleId
            );
            $this->mailService->sendEmail(
                $user->getEmail(),
                $user->getUsername(),
                'Welcome',
                "Welcome.html",
                ['username' => $user->getUsername()]
            );
        }

        $token = $this->jwtManager->createFromPayload(
            $user,
            [
                'user_id' => $user->getId(),
                'username' => $user->getUsername(),
                'roles' => $user->getRoles(),
            ]
        );

        return new JsonResponse(
            [
            'token' => $token,
            'username' => $user->getUsername(),
            'picture' => $user->getPicture(),
            'user_id' => $user->getId(),
            'user_role' => $user->getRoles(),
            ]
        );
    }
}
