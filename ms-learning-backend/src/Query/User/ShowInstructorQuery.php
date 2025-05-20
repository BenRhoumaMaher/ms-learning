<?php

namespace App\Query\User;

class ShowInstructorQuery
{
    public function __construct(
        public readonly int $instructorId
    ) {
    }
}
