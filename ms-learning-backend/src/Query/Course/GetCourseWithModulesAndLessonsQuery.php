<?php

namespace App\Query\Course;

class GetCourseWithModulesAndLessonsQuery
{
    public function __construct(
        public int $courseId
    ) {
    }
}
