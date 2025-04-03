<?php

namespace App\Query\Lesson;

class GetLiveLessonInfoQuery
{
    public int $id;

    public function __construct(int $id)
    {
        $this->id = $id;
    }
}
