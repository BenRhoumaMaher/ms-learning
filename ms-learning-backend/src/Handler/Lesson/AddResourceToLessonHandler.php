<?php

/**
 * This file defines the AddResourceToLessonHandler which handles the addition
 * of resources to lessons in the MS-LEARNING platform.
 *
 * @category Handlers
 * @package  App\Handler\Lesson
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 * @project  MS-Learning (PFE Project)
 */

namespace App\Handler\Lesson;

use App\Command\Lesson\AddResourceToLessonCommand;
use App\Repository\LessonRepository;
use App\Service\Course\CourseService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

/**
 * Handles the AddResourceToLessonCommand to upload and associate resources
 * with lessons. Manages file uploads and lesson entity updates.
 *
 * @category Handlers
 * @package  App\Handler\Lesson
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 */
#[AsMessageHandler]
class AddResourceToLessonHandler
{
    /**
     * @param LessonRepository       $lessonRepository Lessons repository
     * @param CourseService          $courseService    Course service for file operations
     * @param EntityManagerInterface $entityManager    Doctrine entity manager
     */
    public function __construct(
        private LessonRepository $lessonRepository,
        private CourseService $courseService,
        private EntityManagerInterface $entityManager
    ) {
    }

    /**
     * Handle resource addition command
     *
     * Processes the resource file upload and associates it with the specified lesson.
     *
     * @param AddResourceToLessonCommand $command Contains:
     *                                            - lessonId: int (ID of the lesson to add resource to)
     *                                            - resourceFile: UploadedFile (The resource file to upload)
     *
     * @return array Result containing:
     *     - message: string (Success message)
     *     - resource_path: string (Path to the uploaded resource)
     * @throws \Exception If lesson is not found
     */
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
