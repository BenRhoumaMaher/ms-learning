<?php

/**
 * This file defines the password reset controller for
 * handling password reset operations
 * in the MS-LEARNING application. It manages both password
 * reset requests and actual password updates.
 *
 * @category Controllers
 * @package  App\Controller\authentification
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 * @project  MS-Learning (PFE Project)
 */

namespace App\Controller\authentification;

use App\Service\PasswordResetService\PasswordResetServiceInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

/**
 * Handles password reset operations including:
 * - Processing forgot password requests
 * - Handling password reset submissions
 *
 * @category Controllers
 * @package  App\Controller\authentification
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 */
class PasswordResetController extends AbstractController
{
    /**
     * @param PasswordResetServiceInterface $passwordResetService The password
     *                                                            reset service implementation
     */
    public function __construct(
        private readonly PasswordResetServiceInterface $passwordResetService
    ) {
    }

    /**
     * Handles forgot password requests
     *
     * Processes email submissions for password reset and initiates the reset process
     *
     * @param Request $request The HTTP request containing the user's email
     *
     * @return JsonResponse Result of the reset request with success or error message
     *
     * @throws \InvalidArgumentException If the email is missing or invalid
     */
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

    /**
     * Handles password reset submissions
     *
     * Validates reset tokens and processes password updates
     *
     * @param Request $request The HTTP request containing
     *                         reset token and new password
     *
     * @return JsonResponse Result of the password reset operation
     *
     * @throws \InvalidArgumentException If the token or password is
     * missing or invalid
     */
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
