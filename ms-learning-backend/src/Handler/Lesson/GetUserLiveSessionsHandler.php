<?php

namespace App\Handler\Lesson;

use App\Repository\LessonRepository;
use App\Query\Lesson\GetUserLiveSessionsQuery;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;
use Symfony\Component\Messenger\Handler\MessageHandlerInterface;

#[AsMessageHandler]

class GetUserLiveSessionsHandler
{
    public function __construct(
        private LessonRepository $lessonRepository
    ) {
    }

    public function __invoke(GetUserLiveSessionsQuery $query): array
    {
        $liveSessions = $this->lessonRepository->findUserLiveSessions(
            $query->id
        );

        return array_map(
            fn ($session) => [
                'id' => $session->getId(),
                'title' => $session->getTitle(),
                'date' => $session->getLiveStartTime()->format('Y-m-d'),
                'startTime' => $session->getLiveStartTime()->format('H:i'),
                'endTime' => $session->getLiveEndTime()->format('H:i'),
            ],
            $liveSessions
        );
    }
}
