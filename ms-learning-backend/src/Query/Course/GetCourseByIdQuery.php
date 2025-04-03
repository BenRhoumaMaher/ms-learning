<?php

namespace App\Query\Course;

class GetCourseByIdQuery
{
    public int $id;

    public function __construct(int $id)
    {
        $this->id = $id;
    }
}
