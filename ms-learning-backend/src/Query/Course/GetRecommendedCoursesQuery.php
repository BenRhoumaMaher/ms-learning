<?php

namespace App\Query\Course;

class GetRecommendedCoursesQuery
{
    public function __construct(public readonly int $userId)
    {
    }
}
