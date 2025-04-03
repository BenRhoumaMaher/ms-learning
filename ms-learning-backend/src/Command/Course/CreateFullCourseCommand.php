<?php

namespace App\Command\Course;

class CreateFullCourseCommand
{
    public function __construct(
        public int $userId,
        public int $courseId,
        public array $modules,
        public array $files
    ) {
    }
}
