<?php

namespace App\Command\Lesson;

class DeleteLessonCommand
{
    public int $id;

    public function __construct(int $id)
    {
        $this->id = $id;
    }
}
