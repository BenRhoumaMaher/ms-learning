<?php

/**
 * This file defines the handler for lesson editing
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

use App\Command\Lesson\EditLessonCommand;
use App\Entity\Lesson;
use App\Repository\LessonRepository;
use App\Service\LessonService\LessonService;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

/**
 * Handles lesson editing with comprehensive validation and update process.
 * Verifies lesson existence, updates data, validates changes, and persists updates.
 *
 * @category Handlers
 * @package  App\Handler\Lesson
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 */
#[AsMessageHandler]
class EditLessonHandler
{
    /**
     * @param LessonRepository $lessonRepository Repository for lesson entities
     * @param LessonService    $lessonService    Service handling lesson operations
     */
    public function __construct(
        private LessonRepository $lessonRepository,
        private LessonService $lessonService
    ) {
    }

    /**
     * Handle lesson edit command
     *
     * Processes lesson editing through the following workflow:
     * 1. Retrieves the lesson by ID
     * 2. Updates lesson data with provided changes
     * 3. Validates the updated lesson
     * 4. Persists changes if validation passes
     *
     * @param EditLessonCommand $command Contains:
     *                                   - lessonId: string (required) ID of lesson to edit
     *                                   - data: array (required) Lesson properties to update including:
     *                                   - title: string|null
     *                                   - content: string|null
     *                                   - duration: string|null
     *                                   - position: int|null
     *                                   - type: string|null
     *                                   - video_url: string|null (for 'registered' type)
     *                                   - liveStartTime: DateTime|null (for 'live' type)
     *                                   - liveEndTime: DateTime|null (for 'live' type)
     *                                   - liveMeetingLink: string|null (for 'live' type)
     *                                   - resources: array|null
     *
     * @return array Returns:
     *                     - The updated lesson entity on success
     *                     - Error array with validation issues if validation fails
     * @throws \Exception When lesson with specified ID is not found
     */
    public function __invoke(EditLessonCommand $command): array
    {
        $lesson = $this->lessonService->getLessonById($command->lessonId);

        if (! $lesson) {
            throw new \Exception('Lesson not found');
        }

        $this->lessonService->updateLessonData($lesson, $command->data);
        $errors = $this->lessonService->validateLesson($lesson);

        if (! empty($errors)) {
            return [
                'errors' => $errors,
            ];
        }

        $this->lessonService->saveLesson($lesson);

        return $lesson;
    }
}
