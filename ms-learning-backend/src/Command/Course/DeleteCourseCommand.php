<?php

/**
 * This file defines the DeleteCourseCommand DTO (Data Transfer Object),
 * which encapsulates the necessary data for deleting a course.
 * It contains the course identifier required for deletion operations.
 *
 * @category Commands
 * @package  App\Command\Course
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 * @project  MS-Learning (PFE Project)
 */

namespace App\Command\Course;

/**
 * Represents the command to delete a course in the MS-Learning platform.
 * Contains the course ID required to identify which course to delete.
 *
 * @category Commands
 * @package  App\Command\Course
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 * @project  MS-Learning (PFE Project)
 */
class DeleteCourseCommand
{
    public int $id;

    /**
     * Initializes a new instance of the DeleteCourseCommand with the course ID.
     *
     * @param int $id The unique identifier of the course to delete.
     */
    public function __construct(int $id)
    {
        $this->id = $id;
    }
}
