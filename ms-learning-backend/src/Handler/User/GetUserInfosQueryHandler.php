<?php

namespace App\Handler\User;

use App\Query\User\GetUserInfosQuery;
use App\Service\UserService\UserService;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;
use Symfony\Component\Messenger\Handler\MessageHandlerInterface;

#[AsMessageHandler]
class GetUserInfosQueryHandler
{
    public function __construct(
        private UserService $userService
    ) {
    }

    public function __invoke(GetUserInfosQuery  $query)
    {
        $user = $this->userService->getUserById($query->id);

        if (!$user) {
            throw new \Exception('User not found');
        }

        return $this->userService->getUserData($user);
    }
}
