<?php

namespace App\Controller\authentification;

use OpenApi\Attributes as OA;
use App\Service\UserService\UserService;
use Symfony\Component\HttpFoundation\Request;
use App\Service\MailService\MailServiceInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

final class RegisterController extends AbstractController
{
    public function __construct(
        private UserService $userService,
        private MailServiceInterface $mailService
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

        $errors = $this->userService->validateUserData($data);
        if (!empty($errors)) {
            return $this->json(
                ['errors' => $errors],
                400
            );
        }

        if ($this->userService->userExists($data['email'])) {
            return $this->json(
                ['errors' => ['email' => 'User already exists']],
                400
            );
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
            [
                'message' => 'User registered successfully'],
            201
        );
    }
}
