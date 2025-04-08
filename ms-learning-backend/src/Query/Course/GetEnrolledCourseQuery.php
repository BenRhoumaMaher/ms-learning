<?php

namespace App\Query\Course;

class GetEnrolledCourseQuery
{
    public int $id;

    public function __construct(int $id)
    {
        $this->id = $id;
    }
}
