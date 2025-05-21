<?php

namespace App\Handler\User;

use App\Query\User\GetUserInfosQuery;
use App\Service\UserService\UserService;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
class GetUserInfosQueryHandler
{
    /**
     * @param UserService $userService Service handling user-related operations
     */
    public function __construct(
        private UserService $userService
    ) {
    }

    /**
     * Handle the GetUserInfosQuery
     *
     * Retrieves detailed user information for a given user ID.
     *
     * @param GetUserInfosQuery $query Contains:
     *                                 - id: int (required) User ID
     *
     * @return array{
     *     id: int,
     *     firstname: string,
     *     lastname: string,
     *     email: string,
     *     roles: array<int, string>,
     *     createdAt: string,
     * }
     *
     * @throws \Exception When user is not found
     */
    public function __invoke(GetUserInfosQuery $query): array
    {
        $user = $this->userService->getUserById($query->id);

        if (! $user) {
            throw new \Exception('User not found');
        }

        return $this->userService->getUserData($user);
    }
}
