<?php

namespace App\Handler\Instructor;

use App\Command\Instructor\RegisterInstructorCommand;
use App\Service\UserService\BecomeInstructorService;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
class RegisterInstructorHandler
{
    public function __construct(
        private BecomeInstructorService $userService
    ) {
    }

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
            throw new \InvalidArgumentException(json_encode([
                'errors' => $errors,
            ]));
        }

        if ($this->userService->userExists($command->email)) {
            throw new \InvalidArgumentException(json_encode([
                'errors' => [
                    'email' => 'User already exists',
                ],
            ]));
        }

        // Create the instructor user
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
