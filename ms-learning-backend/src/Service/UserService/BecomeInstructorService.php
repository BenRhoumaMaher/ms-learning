<?php

namespace App\Service\UserService;

use App\Entity\Courses;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class BecomeInstructorService implements UserServiceInterface
{
    public function __construct(
        private UserPasswordHasherInterface $passwordHasher,
        private EntityManagerInterface $em,
        private ValidatorInterface $validator,
        private string $resumeDirectory,
        private string $baseUrl
    ) {
    }

    public function validateUserData(
        array $data
    ): array {
        return [];
    }

    public function userExists(
        string $email
    ): bool {
        return (bool) $this->em->getRepository(
            User::class
        )->findOneBy(
            [
                'email' => $email,
            ]
        );
    }

    public function createUser(
        string $email,
        string $firstname,
        string $lastname,
        ?string $googleId = null,
        ?string $plainPassword = null,
        ?string $expertise = null,
        ?UploadedFile $resume = null,
        ?string $profilePicture = '/profile/avatar.png',
        array $courses = []
    ): User {
        $user = new User();
        $user->setEmail($email);
        $user->setFirstname($firstname);
        $user->setLastname($lastname);
        $user->setUsername($firstname . ' ' . $lastname);
        $user->setRoles(['ROLE_USER', 'ROLE_INSTRUCTOR']);
        $user->setExpertise($expertise);
        $user->setPicture($profilePicture);

        if (empty($plainPassword)) {
            $plainPassword = bin2hex(random_bytes(8));
        }

        $user->setPassword(
            $this->passwordHasher->hashPassword(
                $user,
                $plainPassword
            )
        );

        if ($resume) {
            $resumeFilename = uniqid() . '.' . $resume->guessExtension();
            $resume->move($this->resumeDirectory, $resumeFilename);

            $resumeUrl = $this->baseUrl . '/images/resumes/' . $resumeFilename;

            $user->setResume($resumeUrl);
        }

        if (! empty($courses)) {
            $courseRepository = $this->em->getRepository(Courses::class);
            foreach ($courses as $courseId) {
                $course = $courseRepository->find($courseId);
                if ($course) {
                    $user->addCourse($course);
                }
            }
        }

        $this->em->persist($user);
        $this->em->flush();

        return $user;
    }

    public function getAllUsers(): array
    {
        return $this->em->getRepository(
            User::class
        )->findAll();
    }
}
