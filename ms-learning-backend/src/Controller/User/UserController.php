<?php

/**
 * This file defines the UserController which handles all user-related operations
 * including profile management, enrollment, reviews, and social features for the MS-LEARNING platform.
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
use App\Entity\Review;
use DateTimeImmutable;
use App\Repository\PostRepository;
use App\Repository\UserRepository;
use App\Query\User\GetAllUsersQuery;
use App\Repository\ReviewRepository;
use App\Command\User\EditUserCommand;
use App\Query\User\GetUserInfosQuery;
use App\Repository\CoursesRepository;
use App\Query\User\GetInstructorsQuery;
use App\Query\User\GetUserCoursesQuery;
use App\Query\User\ShowInstructorQuery;
use App\Service\UserService\UserService;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\QAInstructorRepository;
use App\Repository\StudentCourseRepository;
use App\Query\Course\GetEnrolledCourseQuery;
use App\Command\Course\EnrollInCourseCommand;
use App\Command\User\AddUserInterestsCommand;
use Symfony\Component\HttpFoundation\Request;
use App\Repository\UserSubscriptionRepository;
use App\Command\User\UpdateUserPasswordCommand;
use App\Service\QueryBusService\QueryBusService;
use Symfony\Component\HttpFoundation\JsonResponse;
use App\Service\ElasticSearch\QuizAnalyticsService;
use App\Service\CommandBusService\CommandBusService;
use App\Service\ElasticSearch\ContentAnalyticsService;
use App\Query\User\GetInstructorCoursesWithoutQuizQuery;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

/**
 * Handles all user operations including:
 * - User profile management
 * - Course enrollment and reviews
 * - Social features (following, suggestions)
 * - Instructor-related operations
 * - Content analytics
 *
 * @category Controllers
 * @package  App\Controller\User
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 */
final class UserController extends AbstractController
{
    /**
     * @param QueryBusService      $queryBusService      Query bus service
     * @param CommandBusService    $commandBusService    Command bus service
     * @param QuizAnalyticsService $quizAnalyticsService Quiz analytics service
     */
    public function __construct(
        private readonly QueryBusService $queryBusService,
        private readonly CommandBusService $commandBusService,
        private readonly QuizAnalyticsService $quizAnalyticsService
    ) {
    }

    /**
     * Get all users
     *
     * Retrieves a list of all users in the system
     *
     * @return JsonResponse Returns array of User entities
     */
    public function index(
    ): JsonResponse {
        $courses = $this->queryBusService->handle(new GetAllUsersQuery());

        return $this->json(
            $courses,
            200,
            [],
            [
                'groups' => 'user:read',
            ]
        );
    }

    /**
     * Get instructor courses
     *
     * Retrieves courses of a specific instructor along with quiz analytics
     *
     * @param int $id User ID
     *
     * @return JsonResponse Returns array with courses and analytics data
     */
    public function getUserCourses(int $id): JsonResponse
    {
        try {
            $userCourses = $this->queryBusService->handle(
                new GetUserCoursesQuery($id)
            );

            $analytics = $this->quizAnalyticsService
                ->getInstructorQuizAnalytics($id);

            $responseData = array_merge(
                $userCourses,
                [
                    'analytics' => $analytics,
                ]
            );

            return $this->json(
                $responseData,
                200,
                [],
                [
                    'groups' => 'course:read',
                ]
            );
        } catch (\Exception $e) {
            return $this->json(
                [
                    'error' => $e->getMessage(),
                ],
                404
            );
        }
    }

    /**
     * Retrieves a list of courses for an instructor that do not have a quiz.
     * Each course in the list will only include its id and title.
     *
     * Example route (if using annotations):
     * #[Route("/courses/instructor/{id}/without-quiz", name="get_instructor_courses_without_quiz", methods:["GET"])]
     */
    public function getInstructorCoursesWithoutQuiz(int $id): JsonResponse
    {
        try {
            $courses = $this->queryBusService->handle(
                new GetInstructorCoursesWithoutQuizQuery($id)
            );

            return $this->json($courses, 200);
        } catch (\Exception $e) {
            $statusCode = (
                $e->getMessage() === 'Instructor not found'
            ) ? 404 : 500;
            return $this->json(
                [
                    'error' => $e->getMessage(),
                ],
                $statusCode
            );
        }
    }

    /**
     * Get user profile information
     *
     * Retrieves detailed profile information for a user
     *
     * @param int $id User ID
     *
     * @return JsonResponse Returns array with user info
     */
    public function getUserInfos(int $id): JsonResponse
    {
        try {
            $userData = $this->queryBusService->handle(new GetUserInfosQuery($id));
            return $this->json(
                $userData,
                200,
                [],
                [
                    'groups' => 'user:read',
                ]
            );
        } catch (\Exception $e) {
            return $this->json(
                [
                    'error' => $e->getMessage(),
                ],
                404
            );
        }
    }

    /**
     * Update user profile
     *
     * Edits user profile information with optional image upload
     *
     * @param Request $request HTTP request containing update data
     * @param int     $id      User ID
     *
     * @return JsonResponse Returns success/error message
     */
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
                [
                    'message' => 'User updated successfully',
                ],
                200
            );
        } catch (\Exception $e) {
            return $this->json(
                [
                    'error' => $e->getMessage(),
                ],
                400
            );
        }
    }

    /**
     * Update user password
     *
     * Changes a user's password after validation
     *
     * @param Request $request HTTP request containing new password
     * @param int     $id      User ID
     *
     * @return JsonResponse Returns success or error message
     */
    public function updatePassword(Request $request, int $id): JsonResponse
    {
        $data = json_decode($request->getContent(), true) ?? [];

        try {
            $command = new UpdateUserPasswordCommand($id, $data);
            $this->commandBusService->handle($command);

            return $this->json(
                [
                    'message' => 'Password updated successfully',
                ]
            );
        } catch (\Exception $e) {
            return $this->json(
                [
                    'error' => $e->getMessage(),
                ],
                400
            );
        }
    }

    /**
     * Delete user account
     *
     * Permanently removes a user account from the system
     *
     * @param int                    $id            User ID
     * @param EntityManagerInterface $entityManager Doctrine entity manager
     */
    public function deleteAccount(
        int $id,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $user = $entityManager->getRepository(User::class)->find($id);

        if (! $user) {
            return $this->json(
                [
                    'message' => 'User not found',
                ],
                404
            );
        }

        $entityManager->remove($user);
        $entityManager->flush();

        return $this->json(
            [
                'message' => 'Account deleted successfully',
            ],
            200
        );
    }

    /**
     * Add user interests
     *
     * Updates a user's interest categories
     *
     * @param Request $request HTTP request containing category IDs
     *
     * @return JsonResponse Returns success or error message
     */
    public function addInterests(
        Request $request
    ): JsonResponse {
        $user = $this->getUser();
        if (! $user instanceof User) {
            return new JsonResponse(
                [
                    'error' => 'Unauthorized',
                ],
                401
            );
        }

        $data = json_decode($request->getContent(), true);
        $categoryIds = $data['categories'] ?? [];

        if (empty($categoryIds)) {
            return new JsonResponse(
                [
                    'error' => 'No categories provided',
                ],
                400
            );
        }

        $command = new AddUserInterestsCommand($user->getId(), $categoryIds);
        $this->commandBusService->handle($command);

        return new JsonResponse(
            [
                'message' => 'Interest update request received',
            ],
            202
        );
    }

    /**
     * Get all instructors
     *
     * Retrieves a list of all instructors in the system
     *
     * @return JsonResponse Returns array of User entities
     */
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
            [
                'groups' => 'user:read',
            ]
        );
    }

    /**
     * Get instructor details
     *
     * Retrieves detailed information about a specific instructor
     *
     * @param int $id Instructor ID
     *
     * @return JsonResponse Returns instructor data or error message
     */
    public function showInstructor(int $id): JsonResponse
    {
        try {
            $data = $this->queryBusService->handle(new ShowInstructorQuery($id));
        } catch (\Throwable $e) {
            return $this->json(
                [
                    'error' => $e->getMessage(),
                ],
                404
            );
        }

        return $this->json($data);
    }

    /**
     * Enroll in course
     *
     * Enrolls a user in a specific course
     *
     * @param int     $courseId Course ID
     * @param Request $request  HTTP request containing user ID
     *
     * @return JsonResponse Returns enrollment result or error message
     */
    public function enroll(int $courseId, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $userId = $data['userId'] ?? null;

        if (! is_int($userId)) {
            return $this->json(
                [
                    'error' => 'Invalid or missing userId',
                ],
                400
            );
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
            return $this->json(
                [
                    'error' => $e->getMessage(),
                ],
                400
            );
        }
    }

    /**
     * Get course reviews
     *
     * Retrieves all reviews for a specific course
     *
     * @param int               $courseId          Course ID
     * @param ReviewRepository  $reviewRepository  Reviews repository
     * @param CoursesRepository $coursesRepository Courses repository
     *
     * @return JsonResponse Returns array of Review entities
     */
    public function getCourseReviews(
        int $courseId,
        ReviewRepository $reviewRepository,
        CoursesRepository $coursesRepository
    ): JsonResponse {

        $course = $coursesRepository->find($courseId);

        if (! $course) {
            return $this->json(
                [
                    'error' => 'Course not found',
                ],
                404
            );
        }

        $reviews = $reviewRepository->findBy(
            [
                'course' => $course,
            ]
        );

        return $this->json(
            $reviews,
            200,
            [],
            [
                'groups' => ['review:read', 'user:read'],
            ]
        );
    }

    /**
     * Create course review
     *
     * Adds a new review for a course
     *
     * @param int                    $courseId          Course ID
     * @param Request                $request           HTTP request containing review data
     * @param CoursesRepository      $coursesRepository Courses repository
     * @param EntityManagerInterface $em                Doctrine entity manager
     *
     * @return JsonResponse Returns success or error message
     */
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
        if (! $course) {
            return $this->json(
                [
                    'error' => 'Course not found',
                ],
                404
            );
        }

        $data = json_decode($request->getContent(), true);
        $userId = $data['userId'] ?? null;
        $rating = $data['rating'] ?? null;
        $comment = $data['comment'] ?? '';

        $user = $em->getRepository(User::class)->find($userId);

        if ($rating === null) {
            return $this->json(
                [
                    'error' => 'Rating is required',
                ],
                400
            );
        }

        $review = new Review();
        $review->setUser($user);
        $review->setCourse($course);
        $review->setRating((int) $rating);
        $review->setComment($comment);
        $review->setCreatedAt(new DateTimeImmutable());

        $em->persist($review);
        $em->flush();

        return $this->json(
            [
                'message' => 'Review added successfully',
            ],
            201
        );
    }

    /**
     * Get student course titles
     *
     * Retrieves course enrollment information for a student
     *
     * @param User                    $user         User entity
     * @param StudentCourseRepository $stCourseRepo Student courses repository
     *
     * @return JsonResponse Returns array with student course data
     */
    public function getStudentCourseTitles(
        User $user,
        StudentCourseRepository $stCourseRepo
    ): JsonResponse {
        $enrollmentData = $stCourseRepo->
            findCourseTitlesByUserId($user->getId());

        return $this->json(
            [
                'student' => $user->getId(),
                'course_titles' => $enrollmentData['titles'],
                'course_ids' => $enrollmentData['ids'],
                'enrollment_ids' => $enrollmentData['enrollmentIds'],
                'course_images' => $enrollmentData['courseImages'],
                'live_lessons' => $enrollmentData['liveLessons'],
            ]
        );
    }

    /**
     * Get student enrolled courses
     *
     * Retrieves course enrollment information for a student
     *
     * @param User                    $user         User entity
     * @param StudentCourseRepository $stCourseRepo Student courses repository
     *
     * @return JsonResponse Returns array with student enrolled courses ids
     */
    public function getStudentEnrolCourse(
        User $user,
        StudentCourseRepository $stCourseRepo
    ): JsonResponse {
        $enrollmentData = $stCourseRepo->
            findCourseTitlesByUserId($user->getId());

        return $this->json(
            [
                'student' => $user->getId(),
                'course_ids' => $enrollmentData['ids'],
            ]
        );
    }

    /**
     * Follow another user
     *
     * Creates a follow relationship between users
     *
     * @param Request     $request     HTTP request containing user IDs
     * @param UserService $userService User service
     *
     * @return JsonResponse Returns success or error message
     */
    public function follow(
        Request $request,
        UserService $userService
    ): JsonResponse {
        $data = json_decode(
            $request->getContent(),
            true
        );

        $userId = $data['user_id'] ?? null;
        $targetId = $data['target_id'] ?? null;

        if (! $userId || ! $targetId) {
            return $this->json(
                [
                    'error' => 'Missing user_id or target_id',
                ],
                400
            );
        }

        $result = $userService->follow((int) $userId, (int) $targetId);

        if (isset($result['error'])) {
            return $this->json(
                [
                    'error' => $result['error'],
                ],
                $result['code'] ?? 400
            );
        }

        return $this->json(
            [
                'message' => $result['message'],
            ]
        );
    }

    /**
     * Unfollow another user
     *
     * Removes a follow relationship between users
     *
     * @param Request     $request     HTTP request containing user IDs
     * @param UserService $userService User service
     *
     * @return JsonResponse Returns success or error message
     */
    public function unfollow(
        Request $request,
        UserService $userService
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        $userId = $data['user_id'] ?? null;
        $targetId = $data['target_id'] ?? null;

        if (! $userId || ! $targetId) {
            return $this->json(
                [
                    'error' => 'Missing user_id or target_id',
                ],
                400
            );
        }

        $result = $userService->unfollow((int) $userId, (int) $targetId);

        if (isset($result['error'])) {
            return $this->json(
                [
                    'error' => $result['error'],
                ],
                $result['code'] ?? 400
            );
        }

        return $this->json(
            [
                'message' => $result['message'],
            ]
        );
    }

    /**
     * Get suggested users
     *
     * Retrieves suggested users to follow based on common interests
     *
     * @param int            $userId         User ID
     * @param UserRepository $userRepository Users repository
     *
     * @return JsonResponse Returns array of User entities
     */
    public function suggested(
        int $userId,
        UserRepository $userRepository
    ): JsonResponse {
        $currentUser = $userRepository->find($userId);

        if (! $currentUser) {
            return $this->json(
                [
                    'error' => 'User not found',
                ],
                404
            );
        }

        $suggestedUsers = $userRepository->findSuggestedUsers($currentUser);

        return $this->json(
            $suggestedUsers,
            200,
            [],
            [
                'groups' => ['user:read'],
            ]
        );
    }

    /**
     * Get user followers
     *
     * Retrieves a list of users following the specified user
     *
     * @param int            $userId         User ID
     * @param UserRepository $userRepository Users repository
     *
     * @return JsonResponse Returns array of User entities
     */
    public function followers(
        int $userId,
        UserRepository $userRepository
    ): JsonResponse {
        $user = $userRepository->find($userId);

        if (! $user) {
            return $this->json(
                [
                    'error' => 'User not found',
                ],
                404
            );
        }

        $followers = $user->getFollowers();

        return $this->json(
            $followers,
            200,
            [],
            [
                'groups' => ['user:read'],
            ]
        );
    }

    /**
     * Get user followings
     *
     * Retrieves a list of users the specified user is following
     *
     * @param int            $userId         User ID
     * @param UserRepository $userRepository Users repository
     *
     * @return JsonResponse Returns array of User entities
     */
    public function followings(
        int $userId,
        UserRepository $userRepository
    ): JsonResponse {
        $user = $userRepository->find($userId);

        if (! $user) {
            return $this->json(
                [
                    'error' => 'User not found',
                ],
                404
            );
        }

        $followings = $user->getFollowing();

        return $this->json(
            $followings,
            200,
            [],
            [
                'groups' => ['user:read'],
            ]
        );
    }

    /**
     * Get user posts
     *
     * Retrieves all posts created by a user
     *
     * @param int         $id          User ID
     * @param UserService $userService User service
     *
     * @return JsonResponse Returns array of user posts
     */
    public function getUserPosts(
        int $id,
        UserService $userService
    ): JsonResponse {
        $data = $userService->getUserPosts($id);

        return new JsonResponse($data);
    }

    /**
     * Get user's current subscription plan
     *
     * Retrieves active subscription information for a user
     *
     * @param int                        $userId           User ID
     * @param UserSubscriptionRepository $subscriptionRepo Subscriptions repository
     *
     * @return JsonResponse Returns array with:
     *                      - planId: int|null
     *                      - planName: string|null
     *                      - endDate: string|null
     */
    public function getUserCurrentPlan(
        int $userId,
        UserSubscriptionRepository $subscriptionRepo
    ): JsonResponse {
        $subscription = $subscriptionRepo->findActivePlanByUserId($userId);

        if (! $subscription) {
            return $this->json(
                [
                    'planId' => null,
                    'planName' => null,
                ],
                200
            );
        }

        return $this->json(
            [
                'planId' => $subscription->getPlan()->getId(),
                'planName' => $subscription->getPlan()->getName(),
                'endDate' => $subscription->getEndDate()->format('Y-m-d'),
            ]
        );
    }

    /**
     * Get user content
     *
     * Retrieves all content (reviews, posts) created by a user with analytics
     *
     * @param User                    $user             User entity
     * @param PostRepository          $postRepository   Posts repository
     * @param ContentAnalyticsService $contentAnalytics Content analytics service
     *
     * @return JsonResponse Returns array with user content data
     */
    public function getUserContent(
        User $user,
        PostRepository $postRepository,
        ContentAnalyticsService $contentAnalytics
    ): JsonResponse {
        $reviews = [];
        foreach ($user->getCourses() as $course) {
            foreach ($course->getReviews() as $review) {
                $reviews[] = [
                    'course_id' => $course->getId(),
                    'course_title' => $course->getTitle(),
                    'rating' => $review->getRating(),
                    'comment' => $review->getComment(),
                    'created_at' => $review->getCreatedAt()->format('Y-m-d H:i:s'),
                ];
            }
        }

        $courseTitles = array_map(
            fn ($course) => $course->getTitle(),
            $user->getCourses()->toArray()
        );
        $posts = $postRepository->findPostsByUserOrCourses(
            $user,
            $courseTitles
        );

        $formattedPosts = array_map(
            fn ($post) => [
                'id' => $post->getId(),
                'title' => $post->getTitle(),
                'content' => $post->getContent(),
                'tags' => $post->getTags(),
                'created_at' => $post->getCreatedAt()->format('Y-m-d H:i:s'),
            ],
            $posts
        );

        $analytics = $contentAnalytics->getContentAnalytics($user->getId());

        return $this->json(
            [
                'reviews' => [
                    'data' => $reviews,
                    'analytics' => $analytics['reviews'],
                ],
                'posts' => [
                    'data' => $formattedPosts,
                    'analytics' => $analytics['posts'],
                ],
            ]
        );
    }

    /**
     * Get QA instructor information
     *
     * Retrieves QA instructor details
     *
     * @param QAInstructorRepository $qainsRepo QA instructors repository
     *
     * @return JsonResponse Returns array of QA instructor data
     */
    public function getQaInstructor(
        QAInstructorRepository $qainsRepo
    ): JsonResponse {
        $qaItems = $qainsRepo
            ->findAll();

        return $this->json(
            $qaItems,
            200,
            [],
            [
                'groups' => 'qainstructor:read',
            ]
        );
    }
}
