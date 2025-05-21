<?php

/**
 * This file defines the AddResourceToLessonCommand DTO (Data Transfer Object),
 * which encapsulates the data required for adding a resource file to a lesson.
 * It contains the lesson identifier and the resource file to be uploaded.
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
 * Represents the command to add a new resource file to an existing lesson
 * in the MS-Learning platform. Contains both the lesson reference and
 * the uploaded file resource.
 *
 * @category Commands
 * @package  App\Command\Lesson
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 * @project  MS-Learning (PFE Project)
 */
class AddResourceToLessonCommand
{
    /**
     * Initializes a new instance of AddResourceToLessonCommand
     * with lesson and file data.
     *
     * @param int          $lessonId     The ID of the lesson to receive the resource
     * @param UploadedFile $resourceFile The uploaded resource file
     *                                   to associate with the lesson
     */
    public function __construct(
        public int $lessonId,
        public UploadedFile $resourceFile
    ) {
    }
}
