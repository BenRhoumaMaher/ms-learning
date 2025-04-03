<?php

namespace App\Command\Lesson;

use Symfony\Component\HttpFoundation\File\UploadedFile;

class CreateLessonCommand
{
    public function __construct(
        public array $lessonData,
        public ?UploadedFile $resourcesFile
    ) {
    }
}
