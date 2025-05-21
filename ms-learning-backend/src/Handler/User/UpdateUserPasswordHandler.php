<?php

namespace App\Handler\User;

use App\Command\User\UpdateUserPasswordCommand;
use App\Repository\UserRepository;
use App\Service\UserService\UserService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]

class UpdateUserPasswordHandler
{
    /**
     * @param UserRepository         $userRepository   Repository for user entities
     * @param UserService            $userService      Service for handling user logic like password updates
     * @param EntityManagerInterface $entityManager    Doctrine entity manager
     */
    public function __construct(
        private UserRepository $userRepository,
        private UserService $userService,
        private EntityManagerInterface $entityManager
    ) {
    }

    /**
     * Handle the UpdateUserPasswordCommand
     *
     * Validates the new password data and updates the user password if valid.
     *
     * @param UpdateUserPasswordCommand $command Contains:
     *                                           - userId: int
     *                                           - data: array{newPassword: string, confirmPassword: string}
     *
     * @throws \Exception When user is not found or validation fails
     */
    public function __invoke(UpdateUserPasswordCommand $command)
    {
        $user = $this->userRepository->find($command->userId);
        if (! $user) {
            throw new \Exception('User not found');
        }

        $errors = $this->validatePasswordUpdateData($command->data);
        if (! empty($errors)) {
            throw new \Exception(json_encode($errors));
        }

        $this->userService->updatePassword($user, $command->data['newPassword']);
        $this->entityManager->flush();
    }

    /**
     * Validate the password update payload
     *
     * @param array<string, string> $data Input data containing password fields
     *
     * @return array<string, string> Array of validation errors (field => error message)
     */
    private function validatePasswordUpdateData(array $data): array
    {
        $errors = [];

        if (! isset($data['newPassword'])) {
            $errors['newPassword'] = 'New password is required';
        }

        if (! isset($data['confirmPassword'])) {
            $errors['confirmPassword'] = 'Confirm password is required';
        }

        if (isset($data['newPassword'], $data['confirmPassword'])
            && $data['newPassword'] !== $data['confirmPassword']
        ) {
            $errors['confirmPassword'] = 'New passwords do not match';
        }

        return $errors;
    }
}
