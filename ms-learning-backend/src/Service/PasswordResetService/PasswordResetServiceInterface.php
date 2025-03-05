<?php

namespace App\Service\PasswordResetService;

use Symfony\Component\HttpFoundation\JsonResponse;

interface PasswordResetServiceInterface
{
    public function handleForgotPassword(
        ?string $email
    ): JsonResponse;
    public function handleResetPassword(
        ?string $token,
        ?string $newPassword
    ): JsonResponse;
}
