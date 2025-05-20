<?php

namespace App\Handler\Lesson;

use App\Command\Lesson\DeleteLessonCommand;
use App\Repository\LessonRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]

class DeleteLessonHandler
{
    public function __construct(
        private LessonRepository $lessonRepository,
        private EntityManagerInterface $entityManager
    ) {
    }

    public function __invoke(DeleteLessonCommand $command): array
    {
        $lesson = $this->lessonRepository->find($command->id);

        if (! $lesson) {
            throw new \Exception('Lesson not found');
        }

        $this->entityManager->remove($lesson);
        $this->entityManager->flush();

        return [
            'message' => 'Lesson deleted successfully',
        ];
    }
}
