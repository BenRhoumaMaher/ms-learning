<?php

/**
 * This file defines the EnrollInCourseCommand DTO (Data Transfer Object),
 * which encapsulates the data required for enrolling a user in a course.
 * It contains both user and course identifiers needed for enrollment operations.
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
 * Represents the command to enroll a user in a specific course
 * in the MS-Learning platform. Contains the necessary identifiers
 * to link a user to a course enrollment.
 *
 * @category Commands
 * @package  App\Command\Course
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 * @project  MS-Learning (PFE Project)
 */
class EnrollInCourseCommand
{
    /**
     * Initializes a new instance of EnrollInCourseCommand with user and course IDs.
     *
     * @param int $userId   The ID of the user to enroll in the course
     * @param int $courseId The ID of the course to enroll the user in
     */
    public function __construct(
        public int $userId,
        public int $courseId
    ) {
    }
}
