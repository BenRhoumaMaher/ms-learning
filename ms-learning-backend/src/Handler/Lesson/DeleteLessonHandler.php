<?php

/**
 * This file defines the handler for lesson deletion
 * in the MS-LEARNING platform.
 *
 * @category Handlers
 * @package  App\Handler\Lesson
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 * @project  MS-Learning (PFE Project)
 */

namespace App\Handler\Lesson;

use App\Command\Lesson\DeleteLessonCommand;
use App\Repository\LessonRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

/**
 * Handles the deletion of lesson entities from the system.
 * Verifies lesson existence before deletion and returns
 * a success message upon completion.
 *
 * @category Handlers
 * @package  App\Handler\Lesson
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 */
#[AsMessageHandler]
class DeleteLessonHandler
{
    /**
     * @param LessonRepository       $lessonRepository Repository for lesson entities
     * @param EntityManagerInterface $entityManager    Doctrine entity manager
     */
    public function __construct(
        private LessonRepository $lessonRepository,
        private EntityManagerInterface $entityManager
    ) {
    }

    /**
     * Handle lesson deletion command
     *
     * Deletes a lesson entity after verifying its existence.
     * Returns a success message upon successful deletion.
     *
     * @param DeleteLessonCommand $command Contains:
     *                                     - id: string (required) ID of lesson to delete
     *
     * @return array Result containing:
     *              - message: string Success message
     *
     * @throws \Exception When lesson with specified ID is not found
     */
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
