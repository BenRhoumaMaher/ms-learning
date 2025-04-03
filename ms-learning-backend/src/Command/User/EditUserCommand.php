<?php

namespace App\Command\User;

use Symfony\Component\HttpFoundation\Request;

class EditUserCommand
{
    public function __construct(
        public int $userId,
        public array $data,
        public ?Request $request = null
    ) {
    }
}
