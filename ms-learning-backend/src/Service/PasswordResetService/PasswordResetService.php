<?php

namespace App\Service\PasswordResetService;

use App\Entity\PasswordReset;
use App\Repository\PasswordResetRepository;
use App\Repository\UserRepository;
use App\Service\MailService\MailServiceInterface;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;

class PasswordResetService implements PasswordResetServiceInterface
{
    public function __construct(
        private MailServiceInterface $mailService,
        private UserRepository $userRepository,
        private PasswordResetRepository $passwordResetRepository,
        private EntityManagerInterface $entityManager
    ) {
    }

    public function handleForgotPassword(
        ?string $email
    ): JsonResponse {
        if (! $email) {
            return new JsonResponse(
                [
                    'message' => 'Email is required',
                ],
                400
            );
        }

        $user = $this->userRepository->findOneBy(
            [
                'email' => $email,
            ]
        );

        if (! $user) {
            return new JsonResponse(
                [
                    'message' => 'User not found',
                ],
                404
            );
        }

        $token = bin2hex(random_bytes(32));
        $passwordReset = new PasswordReset();
        $passwordReset->setEmail($email);
        $passwordReset->setToken($token);
        $passwordReset->setExpiredAt(
            new \DateTime('+1 hour')
        );

        $this->entityManager->persist($passwordReset);
        $this->entityManager->flush();

        $resetUrl = 'http://localhost:3000/reset-password?token=' . $token;
        $this->mailService->sendEmail(
            $user->getEmail(),
            $user->getUsername(),
            'Reset Password',
            'Reset.html',
            [
                'username' => $user->getUsername(),
                'resetUrl' => $resetUrl,
            ]
        );

        return new JsonResponse(
            [
                'message' => 'Reset link sent',
            ]
        );
    }

    public function handleResetPassword(
        ?string $token,
        ?string $newPassword
    ): JsonResponse {
        if (! $token || ! $newPassword) {
            return new JsonResponse(
                [
                    'message' => 'Invalid request',
                ],
                400
            );
        }

        $passwordReset = $this->passwordResetRepository->findOneBy(
            [
                'token' => $token,
            ]
        );

        if (! $passwordReset || new \DateTime() > $passwordReset->getExpiredAt()) {
            return new JsonResponse(
                [
                    'message' => 'Token expired or invalid',
                ],
                400
            );
        }

        $user = $this->userRepository->findOneBy(
            [
                'email' => $passwordReset->getEmail(),
            ]
        );
        if (! $user) {
            return new JsonResponse(
                [
                    'message' => 'User not found',
                ],
                404
            );
        }

        $user->setPassword(
            password_hash($newPassword, PASSWORD_DEFAULT)
        );

        $this->entityManager->persist($user);
        $this->entityManager->remove($passwordReset);
        $this->entityManager->flush();

        return new JsonResponse(
            [
                'message' => 'Password reset successful',
            ]
        );
    }
}
