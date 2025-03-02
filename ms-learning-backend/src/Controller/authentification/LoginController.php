<?php

namespace App\Controller\authentification;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use OpenApi\Attributes as OA;

final class LoginController extends AbstractController
{
    public function __construct(private JWTTokenManagerInterface $jwtManager)
    {
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
    public function login(Request $request): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return $this->json(
                ['error' => 'Unauthorized'],
                401
            );
        }
        $token = $this->jwtManager->createFromPayload(
            $this->getUser(),
            ['user_id' => $this->getUser()->getId()]
        );
        return $this->json(
            [
            'token' => $token,
            'username' => $this->getUser()->getUsername(),
            'user_id' => $this->getUser()->getId()
            ]
        );
    }
}
