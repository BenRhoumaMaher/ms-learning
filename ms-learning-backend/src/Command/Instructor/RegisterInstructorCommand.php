<?php

namespace App\Command\Instructor;

class RegisterInstructorCommand
{
    public function __construct(
        public string $email,
        public string $firstname,
        public string $lastname,
        public ?object $resume,
        public string $expertise,
        public ?string $plainPassword,
        public array $courses
    ) {
    }
}
