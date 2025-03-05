<?php

namespace App\Controller\authentification;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use App\Service\PasswordResetService\PasswordResetServiceInterface;

class PasswordResetController extends AbstractController
{
    public function __construct(
        private PasswordResetServiceInterface $passwordResetService
    ) {
    }
    public function forgotPassword(
        Request $request
    ): JsonResponse {
        $data = json_decode(
            $request->getContent(),
            true
        );
        $email = $data['email'] ?? null;

        return $this->passwordResetService->handleForgotPassword($email);
    }

    public function resetPassword(
        Request $request
    ): JsonResponse {
        $data = json_decode(
            $request->getContent(),
            true
        );
        $token = $data['token'] ?? null;
        $newPassword = $data['password'] ?? null;

        return $this->passwordResetService->handleResetPassword(
            $token,
            $newPassword
        );
    }
}
