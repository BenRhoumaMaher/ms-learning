<?php

/**
 * This file defines the ConvertLessonToRegisteredCommand DTO (Data Transfer Object),
 * which encapsulates the data required for converting a lesson to
 * a registered state.
 * It contains the lesson identifier and the associated video URL.
 *
 * @category Commands
 * @package  App\Command\Lesson
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 * @project  MS-Learning (PFE Project)
 */

namespace App\Command\Lesson;

/**
 * Represents the command to transition a lesson to a registered state
 * in the MS-Learning platform. Contains both the lesson reference and
 * the video URL that will be associated with the registered lesson.
 *
 * @category Commands
 * @package  App\Command\Lesson
 * @project  MS-Learning (PFE Project)
 */
class ConvertLessonToRegisteredCommand
{
    /**
     * Initializes a new instance of ConvertLessonToRegisteredCommand
     * with lesson and video data.
     *
     * @param int    $lessonId The ID of the lesson to be
     *                         converted to registered state
     * @param string $videoUrl The URL of the video to associate
     *                         with the registered lesson
     */
    public function __construct(
        public int $lessonId,
        public string $videoUrl
    ) {
    }
}
