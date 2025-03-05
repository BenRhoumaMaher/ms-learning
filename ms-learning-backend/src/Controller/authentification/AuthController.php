<?php

namespace App\Controller\authentification;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use App\Service\OAuthService\OAuthServiceInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

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
