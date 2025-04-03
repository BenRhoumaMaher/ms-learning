<?php

namespace App\Controller\BecomeInstructor;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use App\Service\CommandBusService\CommandBusService;
use App\Service\UserService\BecomeInstructorService;
use App\Command\Instructor\RegisterInstructorCommand;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class BecomeInstructor extends AbstractController
{
    public function __construct(
        private BecomeInstructorService $userService,
        private CommandBusService $commandBusService
    ) {
    }
    public function register(
        Request $request
    ): JsonResponse {
        $data = $request->request->all();
        $resumeFile = $request->files->get('resume');

        if (!isset($data['email'], $data['firstname'], $data['lastname'], $data['expertise'])) {
            return $this->json(
                ['error' => 'Missing required fields'],
                400
            );
        }

        $command = new RegisterInstructorCommand(
            $data['email'],
            $data['firstname'],
            $data['lastname'],
            $resumeFile,
            $data['expertise'],
            $data['password'] ?? null,
            $data['courses'] ?? []
        );

        $this->commandBusService->handle($command);

        return $this->json(
            ['message' => 'Instructor registration started'],
            202
        );
    }
}
