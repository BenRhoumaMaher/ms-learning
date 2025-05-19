<?php

namespace App\Query\Course;

class GetUserCoursesModulesQuery
{
    public int $id;

    public function __construct(int $id)
    {
        $this->id = $id;
    }
}
