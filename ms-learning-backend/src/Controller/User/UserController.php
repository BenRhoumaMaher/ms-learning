<?php

namespace App\Controller\User;

use App\Entity\User;
use App\Form\UserType;
use App\Repository\UserRepository;
use App\Service\UserService\UserService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use App\Service\UserService\UserServiceInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

final class UserController extends AbstractController
{
    public function __construct(
        private UserService $userService,
        private string $upload_directory,
        private string $baseUrl
    ) {
    }
    public function index(
        UserRepository $userRepository,
        SerializerInterface $serializer
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

    public function getUserInfos(
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

        $firstName = $user->getFirstname();
        $lastName = $user->getLastName();
        $userName = $user->getFirstname() . ' ' . $user->getLastName();
        $email = $user->getEmail();
        $expertise = $user->getExpertise();
        $address = $user->getAddress();
        $phone = $user->getPhone();
        $facebook = $user->getFacebook();
        $x = $user->getX();
        $instagram = $user->getInstagram();
        $linkedin = $user->getLinkedin();

        $userData = [
            'username' => $userName,
            'firstname' => $firstName,
            'lastname' => $lastName,
            'email' => $email,
            'address' => $address,
            'phone' => $phone,
            'facebook' => $facebook,
            'x' => $x,
            'instagram' => $instagram,
            'linkedin' => $linkedin,
            'expertise' => $expertise
        ];

        return $this->json(
            $userData,
            200,
            [],
            ['groups' => 'user:read']
        );
    }


    #[Route('', name: 'new', methods: ['POST'])]
    public function new(
        Request $request,
        EntityManagerInterface $entityManager,
        SerializerInterface $serializer,
        ValidatorInterface $validator
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        $user = new User();
        $form = $this->createForm(UserType::class, $user);
        $form->submit($data);

        if (!$form->isValid()) {
            return $this->json([
                'errors' => $this->getErrorsFromForm($form)
            ], JsonResponse::HTTP_BAD_REQUEST);
        }

        $entityManager->persist($user);
        $entityManager->flush();

        return $this->json($user, JsonResponse::HTTP_CREATED, [], ['groups' => 'user:read']);
    }

    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show(User $user): JsonResponse
    {
        return $this->json($user, JsonResponse::HTTP_OK, [], ['groups' => 'user:read']);
    }

    public function edit(
        Request $request,
        User $user,
        EntityManagerInterface $entityManager,
        SerializerInterface $serializer,
        ValidatorInterface $validator
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        $file = $request->files->get('profileImage');
        if ($file instanceof UploadedFile) {
            if ($user->getPicture()) {
                $this->deleteOldImage($user->getPicture());
            }

            $imagePath = $this->uploadFile($file);
            $user->setPicture($imagePath);
        }

        if (isset($data['firstName'])) {
            $user->setFirstname($data['firstName']);
        }
        if (isset($data['lastName'])) {
            $user->setLastName($data['lastName']);
        }
        if (isset($data['username'])) {
            $user->setUsername($data['username']);
        }
        if (isset($data['email'])) {
            $user->setEmail($data['email']);
        }
        if (isset($data['phone'])) {
            $user->setPhone($data['phone']);
        }
        if (isset($data['address'])) {
            $user->setAddress($data['address']);
        }
        if (isset($data['expertise'])) {
            $user->setExpertise($data['expertise']);
        }
        if (isset($data['x'])) {
            $user->setX($data['x']);
        }
        if (isset($data['facebook'])) {
            $user->setFacebook($data['facebook']);
        }
        if (isset($data['linkedin'])) {
            $user->setLinkedin($data['linkedin']);
        }
        if (isset($data['instagram'])) {
            $user->setInstagram($data['instagram']);
        }

        $errors = $validator->validate($user);
        if (count($errors) > 0) {
            $errorsArray = [];
            foreach ($errors as $error) {
                $errorsArray[$error->getPropertyPath()] = $error->getMessage();
            }
            return $this->json($errorsArray, 400);
        }

        $entityManager->flush();

        return $this->json(
            $user,
            200,
            [],
            ['groups' => 'user:read']
        );
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
        $data = json_decode($request->getContent(), true);

        if (!isset($data['newPassword'])) {
            return $this->json(['errors' => ['newPassword' => 'New password is required']], 400);
        }

        if (!isset($data['confirmPassword'])) {
            return $this->json(['errors' => ['confirmPassword' => 'Confirm password is required']], 400);
        }

        if ($data['newPassword'] !== $data['confirmPassword']) {
            return $this->json(['errors' => ['confirmPassword' => 'New passwords do not match']], 400);
        }

        $errors = $userService->validatePassword($data['newPassword']);
        if (!empty($errors)) {
            return $this->json(['errors' => $errors], 400);
        }

        $userService->updatePassword($user, $data['newPassword']);

        return $this->json(['message' => 'Password updated successfully']);
    }


    public function delete(
        Request $request,
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
