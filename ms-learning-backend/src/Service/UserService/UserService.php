<?php

namespace App\Service\UserService;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use App\Service\UserService\UserServiceInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserService implements UserServiceInterface
{
    public function __construct(
        private UserPasswordHasherInterface $passwordHasher,
        private EntityManagerInterface $em,
        private ValidatorInterface $validator
    ) {
    }

    public function validateUserData(
        array $data
    ): array {
        $errors = [];

        if ($data['password'] !== ($data['confirmPassword'] ?? null)) {
            $errors['confirmPassword'] = 'Passwords do not match';
        }

        $user = new User();
        $user->setFirstname($data['firstname'] ?? null);
        $user->setLastname($data['lastname'] ?? null);
        $user->setEmail($data['email'] ?? null);
        $user->setPassword($data['password'] ?? null);

        $violations = $this->validator->validate($user);
        if (count($violations) > 0) {
            foreach ($violations as $violation) {
                $errors[$violation->getPropertyPath()] = $violation->getMessage();
            }
        }

        return $errors;
    }

    public function userExists(
        string $email
    ): bool {
        return (bool) $this->em->getRepository(
            User::class
        )->findOneBy(
            ['email' => $email]
        );
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
            $plainPassword = bin2hex(
                random_bytes(8)
            );
        }

        if ($plainPassword) {
            $user->setPassword(
                $this->passwordHasher->hashPassword(
                    $user,
                    $plainPassword
                )
            );
        }

        $this->em->persist($user);
        $this->em->flush();

        return $user;
    }
}
