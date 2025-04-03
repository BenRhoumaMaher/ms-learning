<?php

namespace App\Command\Lesson;

use Symfony\Component\HttpFoundation\File\UploadedFile;

class AddResourceToLessonCommand
{
    public function __construct(
        public int $lessonId,
        public UploadedFile $resourceFile
    ) {
    }
}
