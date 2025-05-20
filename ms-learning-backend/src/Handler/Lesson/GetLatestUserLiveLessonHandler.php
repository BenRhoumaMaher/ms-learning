<?php

namespace App\Handler\Lesson;

use App\Query\Lesson\GetLatestUserLiveLessonQuery;
use App\Repository\LessonRepository;
use App\Repository\UserRepository;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

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
        if (! $user) {
            throw new \Exception('User not found');
        }

        $lesson = $this->lessonRepository->findLatestLiveLessonForUser(
            $query->id
        );
        if (! $lesson) {
            throw new \Exception('No upcoming live lessons for this user');
        }

        return $lesson;
    }
}
