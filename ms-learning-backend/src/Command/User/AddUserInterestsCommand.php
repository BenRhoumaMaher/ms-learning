<?php

namespace App\Command\User;

class AddUserInterestsCommand
{
    public function __construct(
        public int $userId,
        public array $categoryIds
    ) {
    }
}
