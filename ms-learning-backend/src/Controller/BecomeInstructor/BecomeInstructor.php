<?php

/**
 * BecomeInstructor Controller
 *
 * This file handles instructor registration operations for
 * the MS-LEARNING application.
 * It manages the process of users registering to become
 * instructors by submitting their information.
 *
 * @category Controllers
 * @package  App\Controller\BecomeInstructor
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 * @project  MS-Learning (PFE Project)
 */

namespace App\Controller\BecomeInstructor;

use App\Service\UserService\BecomeInstructorService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

/**
 * BecomeInstructor Controller
 *
 * Handles the instructor registration process including:
 * - Validating required registration fields
 * - Processing instructor registration submissions
 * - Managing resume file uploads
 *
 * @category Controllers
 * @package  App\Controller\BecomeInstructor
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 */
class BecomeInstructor extends AbstractController
{
    public function __construct(
        private readonly BecomeInstructorService $instructorService
    ) {
    }

    /**
     * Handles instructor registration requests
     *
     * Processes the submission of instructor registration forms including:
     * - Personal information (email, firstname, lastname)
     * - Expertise information
     * - Resume file upload
     * - Optional password and courses data
     *
     * @param Request $request The HTTP request containing registration data
     *
     * @return JsonResponse Response indicating successful
     * submission or validation errors
     *
     * @throws \InvalidArgumentException If required fields are missing
     */
    public function register(Request $request): JsonResponse
    {
        $data = $request->request->all();
        $resumeFile = $request->files->get('resume');

        foreach (['email', 'firstname', 'lastname', 'expertise'] as $field) {
            if (empty($data[$field])) {
                return $this->json(
                    [
                        'error' => "Missing required field: {$field}",
                    ],
                    400
                );
            }
        }

        if ($this->instructorService->userExists(
            $data['email']
        )
        ) {
            return $this->json(
                [
                    'error' => 'User already exists',
                ],
                400
            );
        }

        try {
            $user = $this->instructorService->createUser(
                email: $data['email'],
                firstname: $data['firstname'],
                lastname: $data['lastname'],
                googleId: null,
                plainPassword: $data['password'] ?? null,
                expertise: $data['expertise'],
                resume: $resumeFile,
                courses: $data['courses'] ?? []
            );

            return $this->json(
                [
                    'message' => 'Instructor registered successfully',
                    'user_id' => $user->getId(),
                ],
                201
            );

        } catch (\Throwable $e) {
            return $this->json(
                [
                    'error' => 'Registration failed',
                    'details' => $e->getMessage(),
                ],
                500
            );
        }
    }
}
