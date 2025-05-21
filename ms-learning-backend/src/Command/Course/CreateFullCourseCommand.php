<?php

/**
 * This file defines the CreateFullCourseCommand DTO (Data Transfer Object),
 * which encapsulates all necessary data for creating a complete course structure.
 * It includes course identification, user context, and associated modules and files.
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
 * Represents the complete data required to create a full course structure
 * in the MS-Learning platform, including modules and associated files.
 *
 * @category Commands
 * @package  App\Command\Course
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 * @project  MS-Learning (PFE Project)
 */
class CreateFullCourseCommand
{
    /**
     * Initializes a new instance of the CreateFullCourseCommand
     * with complete course data.
     *
     * @param int   $userId   The ID of the user creating/owning the course.
     * @param int   $courseId The ID of the course being created.
     * @param array $modules  Array of module data associated with the course.
     * @param array $files    Array of file data associated with the course.
     */
    public function __construct(
        public int $userId,
        public int $courseId,
        public array $modules,
        public array $files
    ) {
    }
}
