<?php

namespace App\Command\Course;

class DeleteCourseCommand
{
    public int $id;

    public function __construct(int $id)
    {
        $this->id = $id;
    }
}
