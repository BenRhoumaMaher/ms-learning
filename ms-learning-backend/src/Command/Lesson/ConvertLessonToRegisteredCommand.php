<?php

namespace App\Command\Lesson;

class ConvertLessonToRegisteredCommand
{
    public function __construct(
        public int $lessonId,
        public string $videoUrl
    ) {
    }
}
