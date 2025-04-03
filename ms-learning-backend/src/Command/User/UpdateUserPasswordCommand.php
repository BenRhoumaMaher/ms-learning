<?php

namespace App\Command\User;


class UpdateUserPasswordCommand
{
    public function __construct(
        public int $userId,
        public array $data
    ) {
    }
}
