<?php

namespace App\Command\User;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class EditUserCommand
{
    public function __construct(
        public int $userId,
        public array $data,
        public ?UploadedFile $profileImage = null
    ) {
    }
}
