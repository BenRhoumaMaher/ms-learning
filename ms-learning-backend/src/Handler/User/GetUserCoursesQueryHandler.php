<?php

namespace App\Handler\User;

use App\Repository\UserRepository;
use App\Query\User\GetUserCoursesQuery;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;
use Symfony\Component\Messenger\Handler\MessageHandlerInterface;

#[AsMessageHandler]
class GetUserCoursesQueryHandler
{
    public function __construct(
        private UserRepository $userRepository
    ) {
    }

    public function __invoke(GetUserCoursesQuery $query)
    {
        $user = $this->userRepository->find($query->id);

        if (!$user) {
            throw new \Exception('User not found');
        }

        return [
            'username' => $user->getFirstname() . ' ' . $user->getLastName(),
            'courses' => $user->getCourses(),
        ];
    }
}
