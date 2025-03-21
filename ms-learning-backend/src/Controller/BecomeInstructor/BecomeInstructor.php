<?php

namespace App\Controller\BecomeInstructor;

use App\Service\UserService\BecomeInstructorService;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class BecomeInstructor extends AbstractController
{
    public function __construct(
        private BecomeInstructorService $userService
    ) {
    }
    public function register(
        Request $request,
        ValidatorInterface $validator
    ): JsonResponse {

        $data = $request->request->all();
        $resumeFile = $request->files->get('resume');

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
            resume: $resumeFile,
            expertise: $data['expertise'],
            googleId: null,
            plainPassword: $data['password'] ?? null,
            courses : $data['courses'] ?? []
        );

        return $this->json(
            [
                'message' => 'User registered successfully'],
            201
        );
    }
}
