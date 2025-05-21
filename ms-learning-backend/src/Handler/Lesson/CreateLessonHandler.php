<?php

/**
 * This file defines the handler for lesson creation
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

use App\Command\Lesson\CreateLessonCommand;
use App\Service\LessonService\LessonService;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

/**
 * Handles lesson creation with comprehensive validation and resource management.
 * Processes lesson creation through multiple steps including validation,
 * entity resolution, lesson creation, resource handling, and persistence.
 *
 * @category Handlers
 * @package  App\Handler\Lesson
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 */
#[AsMessageHandler]
class CreateLessonHandler
{
    /**
     * @param LessonService $lessonService Service handling lesson operations
     */
    public function __construct(
        private LessonService $lessonService
    ) {
    }

    /**
     * Handle lesson creation command
     *
     * Processes lesson creation through the following workflow:
     * 1. Validates lesson data
     * 2. Resolves required entities (module, course, etc.)
     * 3. Creates lesson entity
     * 4. Handles lesson resources if provided
     * 5. Persists the lesson
     *
     * @param CreateLessonCommand $command Contains:
     *                                     - lessonData: array (required) Lesson properties including:
     *                                     - title: string
     *                                     - content: string
     *                                     - duration: string
     *                                     - position: int
     *                                     - type: string
     *                                     - module_id: string
     *                                     - video_url: string|null (for 'registered' type)
     *                                     - liveStartTime: DateTime|null (for 'live' type)
     *                                     - liveEndTime: DateTime|null (for 'live' type)
     *                                     - liveMeetingLink: string|null (for 'live' type)
     *                                     - resourcesFile: UploadedFile|null Lesson resource file
     *
     * @return array Result containing:
     *              - On success:
     *                - message: string Success message
     *                - lesson_id: string Created lesson ID
     *                - resources_path: string|null Path to resources if uploaded
     *              - On error:
     *                - error: string Error message
     */
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
