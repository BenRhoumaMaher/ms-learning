<?php

namespace App\Service\OAuthService;

use Symfony\Component\HttpFoundation\JsonResponse;

interface OAuthServiceInterface
{
    public function authenticateGoogleUser(
        ?string $googleToken
    ): JsonResponse;
}
