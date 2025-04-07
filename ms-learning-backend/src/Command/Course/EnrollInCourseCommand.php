<?php

namespace App\Command\Course;

class EnrollInCourseCommand
{
    public function __construct(
        public int $userId,
        public int $courseId
    ) {
    }
}
