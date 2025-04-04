<?php

namespace App\Query\Course;

class GetLatestCoursesQuery
{
    public function __construct(
        public readonly int $limit = 6
    ) {
    }
}
