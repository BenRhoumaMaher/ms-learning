<?php

namespace App\Query\Lesson;

class GetUserLiveSessionsQuery
{
    public int $id;

    public function __construct(int $id)
    {
        $this->id = $id;
    }
}
