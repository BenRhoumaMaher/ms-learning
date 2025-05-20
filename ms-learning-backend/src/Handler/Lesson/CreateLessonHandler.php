<?php

namespace App\Handler\Lesson;

use App\Command\Lesson\CreateLessonCommand;
use App\Service\LessonService\LessonService;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]

class CreateLessonHandler
{
    public function __construct(
        private LessonService $lessonService
    ) {
    }

    public function __invoke(CreateLessonCommand $command): array
    {
        $validationError = $this->lessonService->validateLessonData(
            $command->lessonData
        );

        if ($validationError) {
            return [
                'error' => $validationError,
            ];
        }

        $entities = $this->lessonService->getEntitiesForLesson($command->lessonData);

        if (isset($entities['error'])) {
            return [
                'error' => $entities['error'],
            ];
        }

        $lesson = $this->lessonService->createLessonEntity($command->lessonData, $entities);

        if ($command->resourcesFile) {
            $this->lessonService->handleLessonResources(
                $lesson,
                $command->resourcesFile
            );
        }

        $this->lessonService->saveTheLesson($lesson);

        return [
            'message' => 'Lesson created successfully',
            'lesson_id' => $lesson->getId(),
            'resources_path' => $lesson->getRessources(),
        ];
    }
}
