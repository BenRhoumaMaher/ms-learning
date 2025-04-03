<?php

namespace App\Handler\Lesson;

use App\Repository\LessonRepository;
use App\Query\Lesson\GetLiveLessonInfoQuery;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;
use Symfony\Component\Messenger\Handler\MessageHandlerInterface;

#[AsMessageHandler]
class GetLiveLessonInfoHandler
{
    public function __construct(
        private LessonRepository $lessonRepository
    ) {
    }

    public function __invoke(GetLiveLessonInfoQuery $query): array
    {
        $lesson = $this->lessonRepository->find($query->id);

        if (!$lesson) {
            throw new \Exception('Lesson not found');
        }

        return [
            'id' => $lesson->getId(),
            'title' => $lesson->getTitle(),
            'content' => $lesson->getContent(),
            'liveStartTime' => $lesson->getLiveStartTime(),
            'liveEndTime' => $lesson->getLiveEndTime(),
            'position' => $lesson->getPosition(),
            'liveMeetingLink' => $lesson->getLiveMeetingLink(),
        ];
    }
}
