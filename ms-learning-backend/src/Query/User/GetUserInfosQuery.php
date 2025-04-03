<?php

namespace App\Query\User;

class GetUserInfosQuery
{
    public int $id;

    public function __construct(int $id)
    {
        $this->id = $id;
    }
}
