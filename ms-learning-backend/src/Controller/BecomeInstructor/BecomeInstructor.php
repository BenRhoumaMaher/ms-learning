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

use App\Command\Instructor\RegisterInstructorCommand;
use App\Service\CommandBusService\CommandBusService;
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
    /**
     * @param CommandBusService       $commandBusService The command bus service
     *                                                   for handling commands
     */
    public function __construct(
        private readonly CommandBusService $commandBusService
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
    public function register(
        Request $request
    ): JsonResponse {
        $data = $request->request->all();
        $resumeFile = $request->files->get('resume');

        if (! isset($data['email'], $data['firstname'], $data['lastname'], $data['expertise'])) {
            return $this->json(
                [
                    'error' => 'Missing required fields',
                ],
                400
            );
        }

        $command = new RegisterInstructorCommand(
            $data['email'],
            $data['firstname'],
            $data['lastname'],
            $resumeFile,
            $data['expertise'],
            $data['password'] ?? null,
            $data['courses'] ?? []
        );

        $this->commandBusService->handle($command);

        return $this->json(
            [
                'message' => 'Instructor registration started',
            ],
            202
        );
    }
}
