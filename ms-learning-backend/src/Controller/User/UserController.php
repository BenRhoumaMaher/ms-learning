<?php

namespace App\Controller\User;

use App\Entity\User;
use App\Repository\UserRepository;
use App\Service\UserService\UserService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

final class UserController extends AbstractController
{
    public function __construct(
        private UserService $userService
    ) {
    }
    public function index(
    ): JsonResponse {
        $courses = $this->userService->getAllUsers();
        return $this->json(
            $courses,
            200,
            [],
            ['groups' => 'user:read']
        );
    }
    public function getUserCourses(
        int $id,
        UserRepository $userRepository
    ): JsonResponse {
        $user = $userRepository->find($id);

        if (!$user) {
            return $this->json(
                ['error' => 'User not found'],
                404
            );
        }

        $courses = $user->getCourses();
        $userName = $user->getFirstname() . ' ' . $user->getLastName();

        $userData = [
            'username' => $userName,
            'courses' => $courses,
        ];

        return $this->json(
            $userData,
            200,
            [],
            ['groups' => 'course:read']
        );
    }

    public function getUserInfos(int $id): JsonResponse
    {
        $user = $this->userService->getUserById($id);

        if (!$user) {
            return $this->json(
                ['error' => 'User not found'],
                404
            );
        }

        $userData = $this->userService->getUserData($user);

        return $this->json(
            $userData,
            200,
            [],
            ['groups' => 'user:read']
        );
    }

    public function edit(
        Request $request,
        User $user,
        EntityManagerInterface $entityManager,
        ValidatorInterface $validator
    ): JsonResponse {
        $data = $this->extractRequestData(
            $request
        );

        $this->handleProfileImageUpload(
            $request,
            $user
        );

        $this->updateUserData(
            $user,
            $data
        );

        $errors = $this->validateUser(
            $user,
            $validator
        );
        if ($errors) {
            return $this->json(
                $errors,
                400
            );
        }

        $entityManager->flush();

        return $this->json(
            $user,
            200,
            [],
            ['groups' => 'user:read']
        );
    }

    private function extractRequestData(
        Request $request
    ): array {
        return json_decode(
            $request->getContent(),
            true
        ) ?? [];
    }

    private function handleProfileImageUpload(
        Request $request,
        User $user
    ): void {
        $file = $request->files->get('profileImage');
        if ($file instanceof UploadedFile) {
            if ($user->getPicture()) {
                $this->deleteOldImage($user->getPicture());
            }

            $imagePath = $this->uploadFile($file);
            $user->setPicture($imagePath);
        }
    }

    private function updateUserData(
        User $user,
        array $data
    ): void {
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

    private function validateUser(
        User $user,
        ValidatorInterface $validator
    ): ?array {
        $errors = $validator->validate($user);
        if (count($errors) > 0) {
            $errorsArray = [];
            foreach ($errors as $error) {
                $errorsArray[$error->getPropertyPath()] = $error->getMessage();
            }
            return $errorsArray;
        }
        return null;
    }

    private function uploadFile(UploadedFile $file): string
    {
        $filename = uniqid() . '.' . $file->guessExtension();
        $file->move($this->getParameter('upload_directory'), $filename);

        return $filename;
    }

    private function deleteOldImage(string $imagePath): void
    {
        $filePath = $this->getParameter('upload_directory') . '/' . $imagePath;
        if (file_exists($filePath)) {
            unlink($filePath);
        }
    }

    public function updatePassword(
        User $user,
        Request $request,
        UserService $userService
    ): JsonResponse {
        $data = $this->extractRequestData($request);

        $errors = $this->validatePasswordUpdateData(
            $data,
            $userService
        );
        if (!empty($errors)) {
            return $this->json(
                ['errors' => $errors],
                400
            );
        }

        $userService->updatePassword(
            $user,
            $data['newPassword']
        );

        return $this->json(
            ['message' => 'Password updated successfully']
        );
    }

    private function validatePasswordUpdateData(
        array $data,
        UserService $userService
    ): array {
        $errors = [];

        if (!isset($data['newPassword'])) {
            $errors['newPassword'] = 'New password is required';
        }

        if (!isset($data['confirmPassword'])) {
            $errors['confirmPassword'] = 'Confirm password is required';
        }

        if (isset($data['newPassword'], $data['confirmPassword'])
            && $data['newPassword'] !== $data['confirmPassword']
        ) {
            $errors['confirmPassword'] = 'New passwords do not match';
        }

        if (empty($errors)) {
            $passwordErrors = $userService->validatePassword(
                $data['newPassword']
            );
            if (!empty($passwordErrors)) {
                $errors = array_merge($errors, $passwordErrors);
            }
        }

        return $errors;
    }



    public function deleteAccount(
        User $user,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $entityManager->remove($user);
        $entityManager->flush();

        return $this->json(
            ['message' => 'Account deleted successfully'],
            200
        );
    }

    private function getErrorsFromForm($form): array
    {
        $errors = [];
        foreach ($form->getErrors(true, true) as $error) {
            $errors[$error->getOrigin()->getName()] = $error->getMessage();
        }
        return $errors;
    }
}
