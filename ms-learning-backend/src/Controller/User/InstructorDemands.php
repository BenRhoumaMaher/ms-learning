<?php

/**
 * This file defines the InstructorDemands controller which handles all instructor-related operations
 * including approval, management, and CRUD operations for the MS-LEARNING platform.
 *
 * @category Controllers
 * @package  App\Controller\User
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 * @project  MS-Learning (PFE Project)
 */

namespace App\Controller\User;

use App\Entity\User;
use App\Form\UserType;
use App\Repository\UserRepository;
use App\Service\MailService\MailServiceInterface;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

/**
 * Handles all instructor-related operations including:
 * - Instructor approval and notification
 * - Instructor listing and management
 * - User CRUD operations with validation
 *
 * @category Controllers
 * @package  App\Controller\User
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 */
final class InstructorDemands extends AbstractController
{
    /**
     * @param MailServiceInterface    $mailService Email notification service
     */
    public function __construct(
        private readonly MailServiceInterface $mailService
    ) {
    }

    /**
     * List all instructors
     *
     * Retrieves a list of all approved instructors in the system
     *
     * @param UserRepository      $userRepository Users repository
     * @param SerializerInterface $serializer     Serializer service
     *
     * @return JsonResponse Array of instructors with 'user:read' group serialization
     */
    public function index(
        UserRepository $userRepository,
        SerializerInterface $serializer
    ): JsonResponse {
        $instructors = $userRepository->findInstructors();

        return $this->json(
            $instructors,
            200,
            [],
            [
                'groups' => 'user:read',
            ]
        );
    }

    /**
     * Approves a user's instructor application and sends notification email.
     *
     * @param User                   $user          User entity to approve as instructor
     * @param EntityManagerInterface $entityManager Doctrine entity manager
     *
     * @return JsonResponse JSON response with a confirmation message.
     */
    public function acceptInstructor(
        User $user,
        EntityManagerInterface $entityManager
    ): JsonResponse {

        $this->mailService->sendEmail(
            $user->getEmail(),
            $user->getUsername(),
            'Instructor Approval',
            'Approval.html',
            [
                'username' => $user->getUsername(),
                'email' => $user->getEmail(),
                'password' => $user->getPassword(),
            ]
        );

        return $this->json(
            [
                'message' => 'Instructor approved and email sent',
            ],
            201
        );
    }

    /**
     * Create new user
     *
     * Creates a new user with form validation
     *
     * @param Request                $request       HTTP request containing user data
     * @param EntityManagerInterface $entityManager Doctrine entity manager
     * @param SerializerInterface    $serializer    Serializer service
     * @param ValidatorInterface     $validator     Validation service
     *
     * @return JsonResponse Created user data or validation errors
     */
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

        if (! $form->isValid()) {
            return $this->json(
                [
                    'errors' => $this->getErrorsFromForm($form),
                ],
                400
            );
        }

        $entityManager->persist($user);
        $entityManager->flush();

        return $this->json(
            $user,
            201,
            [],
            [
                'groups' => 'user:read',
            ]
        );
    }

    /**
     * Get user details
     *
     * Retrieves detailed information about a specific user
     *
     * @param User $user User entity to display
     *
     * @return JsonResponse User data with 'user:read' group serialization
     */
    public function show(User $user): JsonResponse
    {
        return $this->json(
            $user,
            200,
            [],
            [
                'groups' => 'user:read',
            ]
        );
    }

    /**
     * Update user information
     *
     * Edits user information with form validation (PUT for full update, PATCH for partial)
     *
     * #[Route('/{id}', name: 'edit', methods: ['PUT', 'PATCH'])]
     *
     * @param Request                $request       HTTP request containing update data
     * @param User                   $user          User entity to update
     * @param EntityManagerInterface $entityManager Doctrine entity manager
     * @param SerializerInterface    $serializer    Serializer service
     * @param ValidatorInterface     $validator     Validation service
     *
     * @return JsonResponse Updated user data or validation errors
     */
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
        $form->submit($data, $request->getMethod() !== 'PATCH');

        if (! $form->isValid()) {
            return $this->json(
                [
                    'errors' => $this->getErrorsFromForm($form),
                ],
                400
            );
        }

        $entityManager->flush();

        return $this->json(
            $user,
            200,
            [],
            [
                'groups' => 'user:read',
            ]
        );
    }

    /**
     * Delete user
     *
     * Removes a user from the system
     *
     * @param Request                $request       HTTP request
     * @param User                   $user          User entity to delete
     * @param EntityManagerInterface $entityManager Doctrine entity manager
     *
     * @return JsonResponse Deletion confirmation message
     */
    public function delete(
        Request $request,
        User $user,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $entityManager->remove($user);
        $entityManager->flush();

        return $this->json(
            [
                'message' => 'User deleted',
            ],
            200
        );
    }

    /**
     * Extract form errors
     *
     * @param mixed $form
     *
     * @return array<string, string> Associative array of field errors
     */
    private function getErrorsFromForm($form): array
    {
        $errors = [];
        foreach ($form->getErrors(true, true) as $error) {
            $errors[$error->getOrigin()->getName()] = $error->getMessage();
        }
        return $errors;
    }
}
