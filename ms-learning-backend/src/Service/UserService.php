<?php

namespace App\Service;

use App\Entity\User;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Doctrine\ORM\EntityManagerInterface;

class UserService
{
    public function __construct(
        private UserPasswordHasherInterface $passwordHasher,
        private EntityManagerInterface $em
    ) {
    }

    public function createUser(
        string $email,
        string $firstname,
        string $lastname,
        ?string $googleId = null,
        ?string $plainPassword = null,
        ?string $profilePicture = '/profile/avatar.png'
    ): User {
        $user = new User();
        $user->setEmail($email);
        $user->setFirstname($firstname);
        $user->setLastname($lastname);
        $user->setUsername($firstname . ' ' . $lastname);
        $user->setRoles(['ROLE_USER']);
        $user->setPicture($profilePicture);

        if ($googleId) {
            $user->setGoogleId($googleId);
            $plainPassword = bin2hex(random_bytes(8)); // Generate random password for Google users
        }

        if ($plainPassword) {
            $user->setPassword(
                $this->passwordHasher->hashPassword($user, $plainPassword)
            );
        }

        $this->em->persist($user);
        $this->em->flush();

        return $user;
    }
}
