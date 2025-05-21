<?php

/**
 * This file defines the CreateLessonCommand DTO (Data Transfer Object),
 * which encapsulates the data required for creating a new lesson.
 * It contains the lesson data array and an optional resource file.
 *
 * @category Commands
 * @package  App\Command\Lesson
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 * @project  MS-Learning (PFE Project)
 */

namespace App\Command\Lesson;

use Symfony\Component\HttpFoundation\File\UploadedFile;

/**
 * Represents the command to create a new lesson in the MS-Learning platform.
 * Contains the lesson data in array format and an optional uploaded resource file.
 *
 * @category Commands
 * @package  App\Command\Lesson
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 * @project  MS-Learning (PFE Project)
 */
class CreateLessonCommand
{
    /**
     * Initializes a new instance of CreateLessonCommand with lesson creation data.
     *
     * @param array             $lessonData    The lesson data in
     *                                         associative array format
     * @param UploadedFile|null $resourcesFile The optional uploaded resource
     *                                         file for the lesson
     */
    public function __construct(
        public array $lessonData,
        public ?UploadedFile $resourcesFile
    ) {
    }
}
