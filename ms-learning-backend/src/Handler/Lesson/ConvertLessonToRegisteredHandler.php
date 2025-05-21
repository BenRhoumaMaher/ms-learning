<?php

/**
 * This file defines the handler for converting live lessons to registered lessons
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

use App\Command\Lesson\ConvertLessonToRegisteredCommand;
use App\Repository\LessonRepository;
use App\Service\LessonService\LessonService;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

/**
 * Handles the conversion of live lessons to registered lessons by:
 * - Validating the lesson exists
 * - Processing the conversion via LessonService
 * - Validating the converted lesson
 * - Persisting changes if validation passes
 *
 * @category Handlers
 * @package  App\Handler\Lesson
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 */
#[AsMessageHandler]
class ConvertLessonToRegisteredHandler
{
    /**
     * @param LessonRepository $lessonRepository Lessons repository
     * @param LessonService    $lessonService    Lesson operations service
     */
    public function __construct(
        private LessonRepository $lessonRepository,
        private LessonService $lessonService
    ) {
    }

    /**
     * Handle lesson conversion command
     *
     * @param ConvertLessonToRegisteredCommand $command Contains:
     *                                                  - lessonId: int (ID of lesson to convert)
     *                                                  - videoUrl: string (URL of recorded video for registered lesson)
     *
     * @return array Result containing:
     *     - message: string (Success message) OR
     *     - errors: array (Validation errors if conversion failed)
     *
     * @throws \Exception If lesson is not found
     */
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
