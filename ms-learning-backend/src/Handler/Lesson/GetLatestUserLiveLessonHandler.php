<?php

namespace App\Handler\Lesson;

use App\Repository\UserRepository;
use App\Repository\LessonRepository;
use App\Query\Lesson\GetLatestUserLiveLessonQuery;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;
use Symfony\Component\Messenger\Handler\MessageHandlerInterface;

#[AsMessageHandler]
class GetLatestUserLiveLessonHandler
{
    public function __construct(
        private UserRepository $userRepository,
        private LessonRepository $lessonRepository
    ) {
    }

    public function __invoke(GetLatestUserLiveLessonQuery $query)
    {
        $user = $this->userRepository->find($query->id);
        if (!$user) {
            throw new \Exception('User not found');
        }

        $lesson = $this->lessonRepository->findLatestLiveLessonForUser(
            $query->id
        );
        if (!$lesson) {
            throw new \Exception('No upcoming live lessons for this user');
        }

        return $lesson;
    }
}
