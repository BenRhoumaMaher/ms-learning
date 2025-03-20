<?php

namespace App\Controller\User;

use App\Entity\User;
use App\Form\UserType;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use App\Service\MailService\MailServiceInterface;
use App\Service\UserService\UserServiceInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

final class InstructorDemands extends AbstractController
{
    public function __construct(
        private UserServiceInterface $userService,
        private MailServiceInterface $mailService
    ) {
    }
    public function index(
        UserRepository $userRepository,
        SerializerInterface $serializer
    ): JsonResponse {
        $instructors = $userRepository->findInstructors();

        return $this->json(
            $instructors,
            200,
            [],
            ['groups' => 'user:read']
        );
    }


    public function acceptInstructor(
        User $user,
        EntityManagerInterface $entityManager
    ): JsonResponse {

        $this->mailService->sendEmail(
            $user->getEmail(),
            $user->getUsername(),
            'Instructor Approval',
            "Approval.html",
            [
                'username' => $user->getUsername(),
                'email' => $user->getEmail(),
                'password' => $user->getPassword()]
        );

        return $this->json(
            [
            'message' => 'Instructor approved and email sent'
            ],
            201
        );
    }

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

    public function delete(
        Request $request,
        User $user,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $entityManager->remove($user);
        $entityManager->flush();

        return $this->json(
            ['message' => 'User deleted'],
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
