<?php

namespace App\Handler\Lesson;

use App\Repository\LessonRepository;
use App\Command\Lesson\EditLessonCommand;
use App\Service\LessonService\LessonService;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;
use Symfony\Component\Messenger\Handler\MessageHandlerInterface;

#[AsMessageHandler]

class EditLessonHandler
{
    public function __construct(
        private LessonRepository $lessonRepository,
        private LessonService $lessonService
    ) {
    }

    public function __invoke(EditLessonCommand $command): array
    {
        $lesson = $this->lessonService->getLessonById($command->lessonId);

        if (!$lesson) {
            throw new \Exception('Lesson not found');
        }

        $this->lessonService->updateLessonData($lesson, $command->data);
        $errors = $this->lessonService->validateLesson($lesson);

        if (!empty($errors)) {
            return ['errors' => $errors];
        }

        $this->lessonService->saveLesson($lesson);

        return $lesson;
    }
}
