<?php

namespace App\Controller\authentification;

use App\Service\MailService;
use App\Service\UserService;
use App\Repository\UserRepository;
use App\Service\GoogleTokenVerifier;
use App\Security\OAuthRegistrationService;
use Symfony\Component\HttpFoundation\Request;
use KnpU\OAuth2ClientBundle\Client\ClientRegistry;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use OpenApi\Attributes as OA;

final class AuthController extends AbstractController
{
    public function __construct(
        private JWTTokenManagerInterface $jwtManager,
        private OAuthRegistrationService $oauthRegistrationService,
        private UserRepository $userRepository,
        private UserPasswordHasherInterface $passwordHasher,
        private GoogleTokenVerifier $googleTokenVerifier,
        private MailService $mailService,
        private UserService $userService
    ) {
    }
    public function check(Request $request, ClientRegistry $clientRegistry): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $googleToken = $data['token'] ?? null;

        if (!$googleToken) {
            return $this->json(
                ['error' => 'Missing Google token'],
                400,
                [
                    'Access-Control-Allow-Origin' => '*',
                    'Access-Control-Allow-Methods' => 'POST, GET, OPTIONS',
                    'Access-Control-Allow-Headers' => 'Content-Type, Authorization',
                    ]
            );
        }

        $googleUser = $this->googleTokenVerifier->verifyToken($googleToken);

        if (!$googleUser || !isset($googleUser['email'], $googleUser['sub'])) {
            return $this->json(['error' => 'Invalid Google token'], 401);
        }

        $email = $googleUser['email'];
        $googleId = $googleUser['sub'];
        $firstname = $googleUser['given_name'] ?? 'User';
        $lastname = $googleUser['family_name'] ?? '';
        $username = $firstname . ' ' . $lastname;
        $profilePicture = $googleUser['picture'] ?? '/profile/avatar.png';

        $existingUser = $this->userRepository->findOneBy(['email' => $email]);

        if (!$existingUser) {
            $newUser = $this->userService->createUser(
                $email,
                $firstname,
                $lastname,
                $googleId
            );
            $this->mailService->sendEmail(
                $newUser->getEmail(),
                $newUser->getUsername(),
                'Welcome',
                "Welcome.html",
                ['username' => $newUser->getUsername()]
            );
        }

        $token = $this->jwtManager->createFromPayload(
            $existingUser,
            ['user_id' => $existingUser->getId()]
        );

        return $this->json(
            [
            'token' => $token,
            'username' => $existingUser->getUsername(),
            'user_id' => $existingUser->getId(),
            ]
        );
    }


}
