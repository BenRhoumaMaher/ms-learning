<?php

namespace App\Query\User;

class GetInstructorCoursesWithoutQuizQuery
{
    public function __construct(
        public readonly int $instructorId
    ) {
    }
}
