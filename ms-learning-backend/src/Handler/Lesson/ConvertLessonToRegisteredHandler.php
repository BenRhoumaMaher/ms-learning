<?php

namespace App\Handler\Lesson;

use App\Command\Lesson\ConvertLessonToRegisteredCommand;
use App\Repository\LessonRepository;
use App\Service\LessonService\LessonService;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
class ConvertLessonToRegisteredHandler
{
    public function __construct(
        private LessonRepository $lessonRepository,
        private LessonService $lessonService
    ) {
    }

    public function __invoke(ConvertLessonToRegisteredCommand $command): array
    {
        $lesson = $this->lessonService->getLessonById($command->lessonId);

        if (! $lesson) {
            throw new \Exception('Lesson not found');
        }

        $this->lessonService->convertLessonToRegistered($lesson, $command->videoUrl);
        $errors = $this->lessonService->validateLesson($lesson);

        if (! empty($errors)) {
            return [
                'errors' => $errors,
            ];
        }

        $this->lessonService->saveLesson($lesson);

        return [
            'message' => 'Lesson converted to registered successfully',
        ];
    }
}
