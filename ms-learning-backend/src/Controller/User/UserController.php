<?php

namespace App\Controller\User;

use App\Entity\User;
use App\Entity\Review;
use DateTimeImmutable;
use App\Repository\UserRepository;
use App\Query\User\GetAllUsersQuery;
use App\Repository\ReviewRepository;
use App\Command\User\EditUserCommand;
use App\Query\User\GetUserInfosQuery;
use App\Repository\CoursesRepository;
use App\Repository\CategoryRepository;
use App\Query\User\GetInstructorsQuery;
use App\Query\User\GetUserCoursesQuery;
use App\Query\User\ShowInstructorQuery;
use App\Service\UserService\UserService;
use Doctrine\ORM\EntityManagerInterface;
use App\Query\Course\GetEnrolledCourseQuery;
use App\Command\Course\EnrollInCourseCommand;
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
        $profileImage = $request->files->get('profileImage');
        try {
            $command = new EditUserCommand(
                $id,
                $data,
                $profileImage
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

    public function showInstructor(int $id): JsonResponse
    {
        try {
            $data = $this->queryBusService->handle(new ShowInstructorQuery($id));
        } catch (\Throwable $e) {
            return $this->json(['error' => $e->getMessage()], 404);
        }

        return $this->json($data);
    }

    public function enroll(int $courseId, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $userId = $data['userId'] ?? null;

        if (!is_int($userId)) {
            return $this->json(['error' => 'Invalid or missing userId'], 400);
        }

        try {
            $command = new EnrollInCourseCommand($userId, $courseId);
            $result = $this->commandBusService->handle($command);

            return $this->json(
                [
                'success' => true,
                'message' => 'Successfully enrolled in course',
                'enrollmentId' => $result,
                ]
            );
        } catch (\Exception $e) {
            return $this->json(['error' => $e->getMessage()], 400);
        }
    }

    public function getCourseReviews(
        int $courseId,
        ReviewRepository $reviewRepository,
        CoursesRepository $coursesRepository
    ): JsonResponse {
        $course = $this->queryBusService->handle(
            new GetEnrolledCourseQuery($courseId)
        );
        $currentcourseId = $course->getCurse()->getId();
        $course = $coursesRepository->find($currentcourseId);
        if (!$course) {
            return $this->json(['error' => 'Course not found'], 404);
        }

        $reviews = $reviewRepository->findBy(['course' => $course]);

        return $this->json(
            $reviews,
            200,
            [],
            ['groups' => ['review:read', 'user:read']]
        );
    }

    public function createReviewForCourse(
        int $courseId,
        Request $request,
        CoursesRepository $coursesRepository,
        EntityManagerInterface $em,
    ): JsonResponse {
        $course = $this->queryBusService->handle(
            new GetEnrolledCourseQuery($courseId)
        );
        $currentcourseId = $course->getCurse()->getId();
        $course = $coursesRepository->find($currentcourseId);
        if (!$course) {
            return $this->json(['error' => 'Course not found'], 404);
        }

        $data = json_decode($request->getContent(), true);
        $userId = $data['userId'] ?? null;
        $rating = $data['rating'] ?? null;
        $comment = $data['comment'] ?? '';

        $user = $em->getRepository(User::class)->find($userId);

        if ($rating === null) {
            return $this->json(['error' => 'Rating is required'], 400);
        }

        $review = new Review();
        $review->setUser($user);
        $review->setCourse($course);
        $review->setRating((int) $rating);
        $review->setComment($comment);
        $review->setCreatedAt(new DateTimeImmutable());

        $em->persist($review);
        $em->flush();

        return $this->json(['message' => 'Review added successfully'], 201);
    }

}
