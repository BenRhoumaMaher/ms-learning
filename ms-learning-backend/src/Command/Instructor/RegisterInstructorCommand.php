<?php

/**
 * This file defines the RegisterInstructorCommand DTO (Data Transfer Object),
 * which encapsulates all necessary data for registering a new instructor.
 * It contains personal details, credentials, and professional information.
 *
 * @category Commands
 * @package  App\Command\Instructor
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 * @project  MS-Learning (PFE Project)
 */

namespace App\Command\Instructor;

/**
 * Represents the command to register a new instructor in the MS-Learning platform.
 * Contains all required instructor information including personal details,
 * professional expertise, and associated courses.
 *
 * @category Commands
 * @package  App\Command\Instructor
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 * @project  MS-Learning (PFE Project)
 */
class RegisterInstructorCommand
{
    /**
     * Initializes a new instance of RegisterInstructorCommand with instructor registration data.
     *
     * @param string      $email         The instructor's email address
     * @param string      $firstname     The instructor's first name
     * @param string      $lastname      The instructor's last name
     * @param object|null $resume        The instructor's resume document (optional)
     * @param string      $expertise     The instructor's area of expertise
     * @param string|null $plainPassword The instructor's password
     *                                   in plain text (optional)
     * @param array       $courses       Array of courses the instructor will teach
     */
    public function __construct(
        public string $email,
        public string $firstname,
        public string $lastname,
        public ?string $resumeContent,
        public ?string $resumeFilename,
        public string $expertise,
        public ?string $plainPassword,
        public array $courses
    ) {
    }
}
