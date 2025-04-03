<?php

namespace App\Handler\User;

use App\Repository\UserRepository;
use App\Command\User\EditUserCommand;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\Messenger\Handler\MessageHandlerInterface;

#[AsMessageHandler]
class EditUserCommandHandler
{
    public function __construct(
        private UserRepository $userRepository,
        private EntityManagerInterface $entityManager,
        private ValidatorInterface $validator
    ) {
    }

    public function __invoke(EditUserCommand $command)
    {
        $user = $this->userRepository->find($command->userId);

        if (!$user) {
            throw new \Exception('User not found');
        }

        // Handle profile image upload
        if ($command->request) {
            $this->handleProfileImageUpload($command->request, $user);
        }

        // Update user data
        $this->updateUserData($user, $command->data);

        // Validate user
        $errors = $this->validateUser($user);
        if ($errors) {
            return ['error' => $errors, 'status' => 400];
        }

        // Save changes
        $this->entityManager->flush();

        return ['user' => $user, 'status' => 200];
    }

    private function handleProfileImageUpload(Request $request, $user): void
    {
        $file = $request->files->get('profileImage');
        if ($file) {
            if ($user->getPicture()) {
                $this->deleteOldImage($user->getPicture());
            }
            $imagePath = $this->uploadFile($file);
            $user->setPicture($imagePath);
        }
    }

    private function updateUserData($user, array $data): void
    {
        $mapping = [
            'firstName' => 'setFirstname',
            'lastName' => 'setLastName',
            'username' => 'setUsername',
            'email' => 'setEmail',
            'phone' => 'setPhone',
            'address' => 'setAddress',
            'expertise' => 'setExpertise',
            'x' => 'setX',
            'facebook' => 'setFacebook',
            'linkedin' => 'setLinkedin',
            'instagram' => 'setInstagram',
        ];

        foreach ($mapping as $key => $method) {
            if (isset($data[$key])) {
                $user->$method($data[$key]);
            }
        }
    }

    private function validateUser($user): ?array
    {
        $errors = $this->validator->validate($user);
        if (count($errors) > 0) {
            $errorsArray = [];
            foreach ($errors as $error) {
                $errorsArray[$error->getPropertyPath()] = $error->getMessage();
            }
            return $errorsArray;
        }
        return null;
    }

    private function uploadFile($file): string
    {
        $filename = uniqid() . '.' . $file->guessExtension();
        $file->move('uploads/', $filename);
        return $filename;
    }

    private function deleteOldImage(string $imagePath): void
    {
        $filePath = 'uploads/' . $imagePath;
        if (file_exists($filePath)) {
            unlink($filePath);
        }
    }
}
