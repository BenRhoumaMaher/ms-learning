<?php

namespace App\Handler\User;

use App\Query\User\GetAllUsersQuery;
use App\Service\UserService\UserService;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;
use Symfony\Component\Messenger\Handler\MessageHandlerInterface;

#[AsMessageHandler]

class GetAllUsersQueryHandler
{
    public function __construct(
        private UserService $userService
    ) {
    }

    public function __invoke(GetAllUsersQuery $query)
    {
        return $this->userService->getAllUsers();
    }
}
