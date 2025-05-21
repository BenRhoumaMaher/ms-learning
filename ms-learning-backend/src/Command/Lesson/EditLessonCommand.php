<?php

/**
 * This file defines the EditLessonCommand DTO (Data Transfer Object),
 * which encapsulates the data required for modifying an existing lesson.
 * It contains both the lesson identifier and the updated lesson data.
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
 * Represents the command to edit an existing lesson in the MS-Learning platform.
 * Contains the lesson ID and an associative array of updated lesson properties.
 *
 * @category Commands
 * @package  App\Command\Lesson
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 * @project  MS-Learning (PFE Project)
 */
class EditLessonCommand
{
    /**
     * Initializes a new instance of EditLessonCommand with lesson modification data.
     *
     * @param int   $lessonId The ID of the lesson to be modified
     * @param array $data     Associative array of updated lesson properties
     *                        (e.g., ['title' => 'New Title',
     *                        'content' => 'Updated content'])
     */
    public function __construct(
        public int $lessonId,
        public array $data
    ) {
    }
}
