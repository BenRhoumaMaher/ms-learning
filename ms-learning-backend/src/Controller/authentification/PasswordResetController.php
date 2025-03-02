<?php

namespace App\Controller\authentification;

use App\Service\MailService;
use App\Entity\PasswordReset;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\PasswordResetRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use OpenApi\Attributes as OA;

class PasswordResetController extends AbstractController
{
    public function __construct(
        private MailService $mailService
    ) {
    }
    public function forgotPassword(
        Request $request,
        UserRepository $userRepository,
        PasswordResetRepository $passwordResetRepository,
        EntityManagerInterface $entityManager,
        MailerInterface $mailer,
        HttpClientInterface $httpClient
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);
        $email = $data['email'] ?? null;

        if (!$email) {
            return new JsonResponse(['message' => 'Email is required'], 400);
        }

        $user = $userRepository->findOneBy(['email' => $email]);

        if (!$user) {
            return new JsonResponse(['message' => 'User not found'], 404);
        }

        $token = bin2hex(random_bytes(32));
        $passwordReset = new PasswordReset();
        $passwordReset->setEmail($email);
        $passwordReset->setToken($token);
        $passwordReset->setExpiredAt(new \DateTime('+1 hour'));

        $entityManager->persist($passwordReset);
        $entityManager->flush();

        $resetUrl = "http://localhost:3000/reset-password?token=" . $token;
        $this->mailService->sendEmail(
            $user->getEmail(),
            $user->getUsername(),
            'Reset Password',
            "Reset.html",
            ['username' => $user->getUsername(), 'resetUrl' => $resetUrl]
        );

        return new JsonResponse(['message' => 'Reset link sent']);
    }
    public function resetPassword(
        Request $request,
        PasswordResetRepository $passwordResetRepository,
        UserRepository $userRepository,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);
        $token = $data['token'] ?? null;
        $newPassword = $data['password'] ?? null;

        if (!$token || !$newPassword) {
            return new JsonResponse(['message' => 'Invalid request'], 400);
        }

        $passwordReset = $passwordResetRepository->findOneBy(['token' => $token]);

        if (!$passwordReset || new \DateTime() > $passwordReset->getExpiredAt()) {
            return new JsonResponse(['message' => 'Token expired or invalid'], 400);
        }

        $user = $userRepository->findOneBy(['email' => $passwordReset->getEmail()]);
        if (!$user) {
            return new JsonResponse(['message' => 'User not found'], 404);
        }

        $user->setPassword(password_hash($newPassword, PASSWORD_DEFAULT));
        $entityManager->persist($user);
        $entityManager->remove($passwordReset);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Password reset successful']);
    }
}
