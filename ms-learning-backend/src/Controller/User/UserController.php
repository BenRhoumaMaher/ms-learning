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
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

final class UserController extends AbstractController
{
    public function __construct(
        private UserService $userService
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

    #[Route('/{id}', name: 'edit', methods: ['PUT', 'PATCH'])]
    public function edit(
        Request $request,
        User $user,
        EntityManagerInterface $entityManager,
        SerializerInterface $serializer,
        ValidatorInterface $validator
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);
        $form = $this->createForm(UserType::class, $user);
        $form->submit($data, 'PATCH' !== $request->getMethod());

        if (!$form->isValid()) {
            return $this->json([
                'errors' => $this->getErrorsFromForm($form)
            ], JsonResponse::HTTP_BAD_REQUEST);
        }

        $entityManager->flush();

        return $this->json($user, JsonResponse::HTTP_OK, [], ['groups' => 'user:read']);
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(Request $request, User $user, EntityManagerInterface $entityManager): JsonResponse
    {
        $entityManager->remove($user);
        $entityManager->flush();

        return $this->json(['message' => 'User deleted'], JsonResponse::HTTP_NO_CONTENT);
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
