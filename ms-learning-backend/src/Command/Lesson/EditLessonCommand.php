<?php

namespace App\Command\Lesson;

class EditLessonCommand
{
    public function __construct(
        public int $lessonId,
        public array $data
    ) {
    }
}
