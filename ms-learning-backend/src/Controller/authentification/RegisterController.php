<?php

namespace App\Controller\authentification;

use App\Entity\User;
use App\Service\MailService;
use App\Service\UserService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use OpenApi\Attributes as OA;
use Nelmio\ApiDocBundle\Annotation\Model;

final class RegisterController extends AbstractController
{
    public function __construct(
        private UserPasswordHasherInterface $passwordHasher,
        private EntityManagerInterface $em,
        private MailService $mailService,
        private UserService $userService
    ) {
    }
    #[OA\Post(
        path: "/api/register",
        summary: "Register a new user",
        description: "Creates a new user account and sends a welcome email.",
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(
                        property: "firstname",
                        type: "string",
                        example: "Maher"
                    ),
                    new OA\Property(
                        property: "lastname",
                        type: "string",
                        example: "Ben Rhouma"
                    ),
                    new OA\Property(
                        property: "email",
                        type: "string",
                        example: "maherbenrhouma@example.com"
                    ),
                    new OA\Property(
                        property: "password",
                        type: "string",
                        example: "Pas!sword123"
                    ),
                    new OA\Property(
                        property: "confirmPassword",
                        type: "string",
                        example: "Pas!sword123"
                    )
                ]
            )
        )
    )]
    #[OA\Response(
        response: 201,
        description: "User registered successfully",
        content: new OA\JsonContent(
            properties: [
                new OA\Property(
                    property: "message",
                    type: "string",
                    example: "User registered successfully"
                )
            ]
        )
    )]
    #[OA\Response(
        response: 400,
        description: "Validation errors",
        content: new OA\JsonContent(
            properties: [
                new OA\Property(
                    property: "errors",
                    type: "object",
                    properties: [
                        new OA\Property(
                            property: "firstname",
                            type: "string",
                            example: "First name is required"
                        ),
                        new OA\Property(
                            property: "lastname",
                            type: "string",
                            example: "Last name is required"
                        ),
                        new OA\Property(
                            property: "email",
                            type: "string",
                            example: "User already exists"
                        ),
                        new OA\Property(
                            property: "confirmPassword",
                            type: "string",
                            example: "Passwords do not match"
                        ),
                        new OA\Property(
                            property: "password",
                            type: "string0000",
                            example: "
                            Password must contain at least 
                            one special character (@$!%*?&)"
                        ),
                    ]
                )
            ]
        )
    )]
    #[OA\Tag(name: "Authentication")]
    public function register(
        Request $request,
        ValidatorInterface $validator
    ): JsonResponse {

        $data = json_decode($request->getContent(), true);
        $errors = [];

        $existingUser = $this->em->getRepository(
            User::class
        )->findOneBy(['email' => $data['email'] ?? null]);

        if ($existingUser) {
            return $this->json(
                ['errors' => ['email' => 'User already exists']],
                400
            );
        }

        if ($data['password'] !== ($data['confirmPassword'] ?? null)) {
            $errors['confirmPassword'] = 'Passwords do not match';
        }

        $user = new User();
        $user->setFirstname($data['firstname'] ?? null);
        $user->setLastname($data['lastname'] ?? null);
        $user->setEmail($data['email'] ?? null);
        $user->setPassword($data['password'] ?? null);
        $user->setRoles(['ROLE_USER']);

        $violations = $validator->validate($user);
        if (count($violations) > 0) {
            foreach ($violations as $violation) {
                $field = $violation->getPropertyPath();
                $errors[$field] = $violation->getMessage();
            }
        }

        if (!empty($errors)) {
            return $this->json(['errors' => $errors], 400);
        }

        $user = $this->userService->createUser(
            email: $data['email'],
            firstname: $data['firstname'],
            lastname: $data['lastname'],
            googleId: null,
            plainPassword: $data['password']
        );

        $this->mailService->sendEmail(
            $user->getEmail(),
            $user->getUsername(),
            'Welcome',
            "Welcome.html",
            ['username' => $user->getUsername()]
        );

        return $this->json(
            ['message' => 'User registered successfully']
        );
    }
}
