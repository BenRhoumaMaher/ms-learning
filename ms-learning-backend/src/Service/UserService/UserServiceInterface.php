<?php

namespace App\Service\UserService;

use App\Entity\User;
use Symfony\Component\HttpFoundation\File\UploadedFile;

interface UserServiceInterface
{
    public function validateUserData(
        array $data
    ): array;

    public function userExists(
        string $email
    ): bool;

    public function createUser(
        string $email,
        string $firstname,
        string $lastname,
        ?string $googleId,
        ?string $plainPassword,
        ?string $expertise,
        ?UploadedFile $resume,
        ?string $profilePicture,
        array $courses = []
    ): User;

    public function getAllUsers(): array;
}
