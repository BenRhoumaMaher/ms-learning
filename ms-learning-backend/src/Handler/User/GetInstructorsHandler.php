<?php

namespace App\Handler\User;

use App\Repository\UserRepository;
use App\Query\User\GetInstructorsQuery;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
class GetInstructorsHandler
{
    public function __construct(
        private UserRepository $userRepository
    ) {
    }

    public function __invoke(GetInstructorsQuery $query): array
    {
        return $this->userRepository->findByRole('ROLE_INSTRUCTOR');
    }
}
