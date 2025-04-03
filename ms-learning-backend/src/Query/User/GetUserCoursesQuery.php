<?php

namespace App\Query\User;

class GetUserCoursesQuery
{
    public int $id;

    public function __construct(int $id)
    {
        $this->id = $id;
    }
}
