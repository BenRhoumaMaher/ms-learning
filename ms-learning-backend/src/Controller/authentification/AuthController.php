<?php

namespace App\Controller\authentification;

use App\Service\OAuthService\OAuthServiceInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

final class AuthController extends AbstractController
{
    public function __construct(
        private OAuthServiceInterface $oauthService
    ) {
    }

    public function check(
        Request $request
    ): JsonResponse {
        $data = json_decode(
            $request->getContent(),
            true
        );
        $googleToken = $data['token'] ?? null;

        $data = json_decode(
            $request->getContent(),
            true
        );
        $googleToken = $data['token'] ?? null;

        return $this->oauthService->authenticateGoogleUser($googleToken);
    }
}
