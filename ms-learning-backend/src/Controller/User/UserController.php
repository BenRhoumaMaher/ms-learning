<?php

namespace App\Controller\User;

use App\Entity\User;
use App\Repository\UserRepository;
use App\Query\User\GetAllUsersQuery;
use App\Command\User\EditUserCommand;
use App\Query\User\GetUserInfosQuery;
use App\Repository\CoursesRepository;
use App\Repository\CategoryRepository;
use App\Query\User\GetInstructorsQuery;
use App\Query\User\GetUserCoursesQuery;
use App\Service\UserService\UserService;
use Doctrine\ORM\EntityManagerInterface;
use App\Command\User\AddUserInterestsCommand;
use Symfony\Component\HttpFoundation\Request;
use App\Command\User\UpdateUserPasswordCommand;
use App\Service\QueryBusService\QueryBusService;
use Symfony\Component\HttpFoundation\JsonResponse;
use App\Service\CommandBusService\CommandBusService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

final class UserController extends AbstractController
{
    public function __construct(
        private UserService $userService,
        private QueryBusService $queryBusService,
        private CommandBusService $commandBusService
    ) {
    }
    public function index(
    ): JsonResponse {
        $courses = $this->queryBusService->handle(new GetAllUsersQuery());

        return $this->json(
            $courses,
            200,
            [],
            ['groups' => 'user:read']
        );
    }
    public function getUserCourses(int $id): JsonResponse
    {
        try {
            $userCourses = $this->queryBusService->handle(
                new GetUserCoursesQuery($id)
            );

            return $this->json(
                $userCourses,
                200,
                [],
                ['groups' => 'course:read']
            );
        } catch (\Exception $e) {
            return $this->json(
                ['error' => $e->getMessage()],
                404
            );
        }
    }

    public function getUserInfos(int $id): JsonResponse
    {
        try {
            $userData = $this->queryBusService->handle(new GetUserInfosQuery($id));
            // dd($userData);
            return $this->json(
                $userData,
                200,
                [],
                ['groups' => 'user:read']
            );
        } catch (\Exception $e) {
            return $this->json(
                ['error' => $e->getMessage()],
                404
            );
        }
    }

    public function edit(Request $request, int $id): JsonResponse
    {
        $id = (int) $id;
        $data = json_decode($request->getContent(), true) ?? [];

        try {
            $command = new EditUserCommand(
                $id,
                $data,
                $request
            );
            $this->commandBusService->handle($command);

            return $this->json(
                ['message' => 'User updated successfully'],
                200
            );
        } catch (\Exception $e) {
            return $this->json(['error' => $e->getMessage()], 400);
        }
    }

    public function updatePassword(Request $request, int $id): JsonResponse
    {
        $data = json_decode($request->getContent(), true) ?? [];

        try {
            $command = new UpdateUserPasswordCommand($id, $data);
            $this->commandBusService->handle($command);

            return $this->json(['message' => 'Password updated successfully']);
        } catch (\Exception $e) {
            return $this->json(['error' => $e->getMessage()], 400);
        }
    }


    public function deleteAccount(
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

    public function addInterests(
        Request $request
    ): JsonResponse {
        $user = $this->getUser();
        if (!$user) {
            return new JsonResponse(
                ['error' => 'Unauthorized'],
                401
            );
        }

        $data = json_decode($request->getContent(), true);
        $categoryIds = $data['categories'] ?? [];

        if (empty($categoryIds)) {
            return new JsonResponse(
                ['error' => 'No categories provided'],
                400
            );
        }

        $command = new AddUserInterestsCommand($user->getId(), $categoryIds);
        $this->commandBusService->handle($command);

        return new JsonResponse(
            ['message' => 'Interest update request received'],
            202
        );
    }

    public function getInstructors(): JsonResponse
    {
        $query = new GetInstructorsQuery();
        $instructors = $this->queryBusService->handle(
            $query
        );

        return $this->json(
            $instructors,
            200,
            [],
            ['groups' => 'user:read']
        );
    }
}
