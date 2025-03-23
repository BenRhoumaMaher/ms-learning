<?php

namespace App\Controller\authentification;

use OpenApi\Attributes as OA;
use Symfony\Component\HttpFoundation\Request;
use App\Service\AuthService\AuthServiceInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

final class LoginController extends AbstractController
{
    public function __construct(
        private AuthServiceInterface $authService
    ) {
    }

    #[OA\Post(
        path: "/api/login",
        summary: "User login",
        description: "Authenticates the user and returns a JWT token.",
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(
                        property: "email",
                        type: "string",
                        example: "maherbenrhouma@example.com"
                    ),
                    new OA\Property(
                        property: "password",
                        type: "string",
                        example: "Strong@1230000"
                    )
                ]
            )
        )
    )]
    #[OA\Response(
        response: 200,
        description: "Successful authentication",
        content: new OA\JsonContent(
            properties: [
                new OA\Property(
                    property: "token",
                    type: "string",
                    example: "eyJhbGciOiJIUzI1NiIsInR..."
                ),
                new OA\Property(
                    property: "username",
                    type: "string",
                    example: "Maher Ben Rhoumaa"
                ),
                new OA\Property(
                    property: "user_id",
                    type: "integer",
                    example: 2
                )
            ]
        )
    )]
    #[OA\Response(
        response: 401,
        description: "Unauthorized or Invalid credentials",
        content: new OA\JsonContent(
            properties: [
                new OA\Property(
                    property: "error",
                    type: "string",
                    example: "Unauthorized"
                )
            ]
        )
    )]
    #[OA\Tag(name: "Authentication")]
    public function login(
        Request $request
    ): JsonResponse {

        $user = $this->getUser();
        if (!$user) {
            return $this->json(
                ['error' => 'Unauthorized'],
                401
            );
        }
        $tokenData = $this->authService->generateToken($user);

        return $this->json(
            $tokenData
        );
    }
}
