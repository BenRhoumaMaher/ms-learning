<?php

namespace App\Handler\Lesson;

use App\Command\Lesson\AddResourceToLessonCommand;
use App\Repository\LessonRepository;
use App\Service\Course\CourseService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]

class AddResourceToLessonHandler
{
    public function __construct(
        private LessonRepository $lessonRepository,
        private CourseService $courseService,
        private EntityManagerInterface $entityManager
    ) {
    }

    public function __invoke(AddResourceToLessonCommand $command): array
    {
        $lesson = $this->lessonRepository->find($command->lessonId);

        if (! $lesson) {
            throw new \Exception('Lesson not found');
        }

        $resourcePath = $this->courseService->uploadFile($command->resourceFile);
        $lesson->setRessources($resourcePath);

        $this->entityManager->persist($lesson);
        $this->entityManager->flush();

        return [
            'message' => 'Resource added successfully',
            'resource_path' => $resourcePath,
        ];
    }
}
