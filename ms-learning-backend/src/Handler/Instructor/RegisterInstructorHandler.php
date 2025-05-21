<?php

/**
 * This file defines the handler for instructor registration
 * in the MS-LEARNING platform.
 *
 * @category Handlers
 * @package  App\Handler\Instructor
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 * @project  MS-Learning (PFE Project)
 */

namespace App\Handler\Instructor;

use App\Command\Instructor\RegisterInstructorCommand;
use App\Service\UserService\BecomeInstructorService;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

/**
 * Handles instructor registration by:
 * - Validating required instructor data
 * - Checking for existing users
 * - Creating new instructor accounts
 *
 * @category Handlers
 * @package  App\Handler\Instructor
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 */
#[AsMessageHandler]
class RegisterInstructorHandler
{
    /**
     * @param BecomeInstructorService $userService Service handling instructor registration
     */
    public function __construct(
        private BecomeInstructorService $userService
    ) {
    }

    /**
     * Handle instructor registration command
     *
     * Processes instructor registration with the following steps:
     * 1. Validates required fields (email, firstname, lastname, expertise)
     * 2. Checks for existing users with the same email
     * 3. Creates new instructor account if validation passes
     *
     * @param RegisterInstructorCommand $command Contains:
     *                                           - email: string (required)
     *                                           - firstname: string (required)
     *                                           - lastname: string (required)
     *                                           - expertise: string (required)
     *                                           - resume: string|null
     *                                           - plainPassword: string (required)
     *                                           - courses: array|null
     *
     * @throws \InvalidArgumentException When validation fails or user exists
     */
    public function __invoke(RegisterInstructorCommand $command): void
    {
        $errors = $this->userService->validateUserData(
            [
                'email' => $command->email,
                'firstname' => $command->firstname,
                'lastname' => $command->lastname,
                'expertise' => $command->expertise,
            ]
        );

        if (! empty($errors)) {
            throw new \InvalidArgumentException(
                json_encode(
                    [
                        'errors' => $errors,
                    ]
                )
            );
        }

        if ($this->userService->userExists($command->email)) {
            throw new \InvalidArgumentException(
                json_encode(
                    [
                        'errors' => [
                            'email' => 'User already exists',
                        ],
                    ]
                )
            );
        }

        $this->userService->createUser(
            email: $command->email,
            firstname: $command->firstname,
            lastname: $command->lastname,
            resume: $command->resume,
            expertise: $command->expertise,
            googleId: null,
            plainPassword: $command->plainPassword,
            courses: $command->courses
        );
    }
}
