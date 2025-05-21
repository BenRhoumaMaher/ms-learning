<?php

/**
 * This file defines the authentication controller for handling OAuth operations
 * in the MS-LEARNING application. It manages Google authentication token validation.
 *
 * @category Controllers
 * @package  App\Controller\authentification
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 * @project  MS-Learning (PFE Project)
 */

namespace App\Controller\authentification;

use App\Service\OAuthService\OAuthServiceInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

/**
 * Handles OAuth authentication operations, specifically for Google authentication.
 * Validates Google tokens and returns authentication results.
 *
 * @category Controllers
 * @package  App\Controller\authentification
 */
final class AuthController extends AbstractController
{
    /**
     * @param OAuthServiceInterface $oauthService The OAuth service implementation
     */
    public function __construct(
        private readonly OAuthServiceInterface $oauthService
    ) {
    }

    /**
     * Validates a Google authentication token
     *
     * @param Request $request The HTTP request containing the Google token
     *
     * @return JsonResponse Authentication result with user data or error message
     *
     * @throws \InvalidArgumentException If the token is missing or invalid
     */
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
