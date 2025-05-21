<?php

namespace App\Handler\User;

use App\Query\User\GetAllUsersQuery;
use App\Service\UserService\UserService;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]

class GetAllUsersQueryHandler
{
    /**
     * @param UserService $userService Service for user operations
     */
    public function __construct(
        private UserService $userService
    ) {
    }

    /**
     * Handle get all users query
     * 
     * @param GetAllUsersQuery $query The query object
     * @return array List of all users
     */
    public function __invoke(GetAllUsersQuery $query): array
    {
        return $this->userService->getAllUsers();
    }
}
