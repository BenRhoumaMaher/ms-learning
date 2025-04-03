<?php

namespace App\Query\Lesson;

class GetLatestUserLiveLessonQuery
{
    public int $id;

    public function __construct(int $id)
    {
        $this->id = $id;
    }
}
