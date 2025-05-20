<?php

namespace App\Handler\Lesson;

use App\Query\Lesson\GetLiveLessonInfoQuery;
use App\Repository\LessonRepository;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

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

        if (! $lesson) {
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
            'course' => [
                'id' => $lesson->getCourse()->getId(),
                'title' => $lesson->getCourse()->getTitle(),
                'quiz' => [
                    'id' => $lesson->getCourse()->getQuiz()->getId(),
                    'title' => $lesson->getCourse()->getQuiz()->getTitle(),
                    'time_limit' => $lesson->getCourse()->getQuiz()->getTimeLimit(),
                    'questions' => count($lesson->getCourse()->getQuiz()->getQuestions()),
                    'passing_score' => $lesson->getCourse()->getQuiz()->getPassingScore(),
                ],
            ],
            'category' => $lesson->getCourse()->getCategory()->getId(),
        ];
    }
}
