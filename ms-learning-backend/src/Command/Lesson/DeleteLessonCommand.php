<?php

/**
 * This file defines the DeleteLessonCommand DTO (Data Transfer Object),
 * which encapsulates the data required for deleting a lesson.
 * It contains the lesson identifier needed for deletion operations.
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
 * Represents the command to delete a specific lesson in the MS-Learning platform.
 * Contains the unique identifier of the lesson to be removed from the system.
 *
 * @category Commands
 * @package  App\Command\Lesson
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 * @project  MS-Learning (PFE Project)
 */
class DeleteLessonCommand
{
    public int $id;

    /**
     * Initializes a new instance of DeleteLessonCommand with the lesson ID.
     *
     * @param int $id The unique identifier of the lesson to delete
     */
    public function __construct(int $id)
    {
        $this->id = $id;
    }
}
