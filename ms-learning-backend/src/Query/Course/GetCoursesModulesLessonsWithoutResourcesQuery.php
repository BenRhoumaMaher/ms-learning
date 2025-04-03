<?php

namespace App\Query\Course;

class GetCoursesModulesLessonsWithoutResourcesQuery
{
    public int $id;

    public function __construct(int $id)
    {
        $this->id = $id;
    }
}
