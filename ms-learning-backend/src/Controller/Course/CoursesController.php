<?php

/**
 * This file defines the CoursesController which handles
 * all course-related operations
 * including CRUD operations, enrollment, recommendations,
 * and analytics for the MS-LEARNING platform.
 *
 * @category Controllers
 * @package  App\Controller\Course
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 * @project  MS-Learning (PFE Project)
 */

namespace App\Controller\Course;

use App\Command\Course\CreateFullCourseCommand;
use App\Command\Course\DeleteCourseCommand;
use App\Command\Course\UpdateCourseCommand;
use App\Entity\QuizScore;
use App\Query\Course\GetAllCoursesQuery;
use App\Query\Course\GetCourseByIdQuery;
use App\Query\Course\GetCoursesModulesLessonsWithoutResourcesQuery;
use App\Query\Course\GetCourseWithModulesAndLessonsQuery;
use App\Query\Course\GetEnrolledCourseQuery;
use App\Query\Course\GetFreeCoursesQuery;
use App\Query\Course\GetLatestCoursesQuery;
use App\Query\Course\GetRecommendedCoursesQuery;
use App\Query\Course\GetUserCoursesModulesQuery;
use App\Repository\CoursesRepository;
use App\Repository\ForumPostRepository;
use App\Repository\LessonRepository;
use App\Repository\QuizRepository;
use App\Repository\QuizScoreRepository;
use App\Repository\StudentCourseRepository;
use App\Repository\UserRepository;
use App\Service\CommandBusService\CommandBusService;
use App\Service\Course\CourseService;
use App\Service\ElasticSearch\VideoEngagementAnalyticsService;
use App\Service\QueryBusService\QueryBusService;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Serializer\SerializerInterface;

/**
 * Handles all course-related operations including:
 * - Course listing and details
 * - Course creation, update, and deletion
 * - Enrollment management
 * - Course recommendations
 * - Quiz and analytics functionality
 *
 * @category Controllers
 * @package  App\Controller\Course
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 */
class CoursesController extends AbstractController
{
    /**
     * @param QueryBusService                 $queryBusService     Query bus
     *                                                             service
     * @param CommandBusService               $commandBusService   Command bus
     *                                                             service
     * @param QuizScoreRepository             $quizScoreRepository Quiz score
     *                                                             repository
     * @param EntityManagerInterface          $entityManager       Entity manager
     * @param UserRepository                  $userRepository      User repository
     * @param QuizRepository                  $quizRepository      Quiz repository
     * @param VideoEngagementAnalyticsService $videoAnalytics      Video analytics
     *                                                             service
     */
    public function __construct(
        private readonly QueryBusService $queryBusService,
        private readonly CommandBusService $commandBusService,
        private readonly QuizScoreRepository $quizScoreRepository,
        private readonly EntityManagerInterface $entityManager,
        private readonly UserRepository $userRepository,
        private readonly QuizRepository $quizRepository,
        private readonly VideoEngagementAnalyticsService $videoAnalytics
    ) {
    }

    /**
     * Get all courses
     *
     * @return JsonResponse List of all courses
     */
    public function index(): JsonResponse
    {
        $courses = $this->queryBusService->handle(new GetAllCoursesQuery());
        return $this->json(
            $courses,
            200,
            [],
            [
                'groups' => 'course:read',
            ]
        );
    }

    /**
     * Get course details by ID
     *
     * @param int $id Course ID
     *
     * @return JsonResponse Course details
     */
    public function show(int $id): JsonResponse
    {
        $course = $this->queryBusService->handle(new GetCourseByIdQuery($id));
        return $this->json(
            $course,
            200,
            [],
            [
                'groups' => 'course:read',
            ]
        );
    }

    /**
     * Get enrolled course details
     *
     * @param int $id Enrollment ID
     *
     * @return JsonResponse Enrolled course details with progress
     */
    public function enrolledCourse(int $id): JsonResponse
    {
        $course = $this->queryBusService->handle(new GetEnrolledCourseQuery($id));
        $courseId = $course->getCurse()->getId();
        $curse = $course->getCurse();
        $courseData = $this->queryBusService->handle(
            new GetCourseWithModulesAndLessonsQuery($courseId)
        );
        $data = [
            'id' => $course->getId(),
            'user' => [
                'id' => $curse->getEnrollments()->first()?->getId(),
                'name' => $curse->getEnrollments()->first()?->getUsername(),
                'expertise' => $curse->getEnrollments()->first()?->getExpertise(),
                'x' => $curse->getEnrollments()->first()?->getX(),
                'linkedin' => $curse->getEnrollments()->first()?->getLinkedin(),
                'instagram' => $curse->getEnrollments()->first()?->getInstagram(),
                'facebook' => $curse->getEnrollments()->first()?->getFacebook(),
                'picture' => $curse->getEnrollments()->first()?->getPicture(),
            ],
            'course' => $courseData,
            'status' => $course->getStatus(),
            'progress' => $course->getProgress(),
            'startDate' => $course->getStartDate(),
            'endDate' => $course->getEndDate(),
        ];

        return $this->json($data);
    }

    /**
     * Create a new course with modules and lessons
     *
     * @param Request             $request       HTTP request containing course
     *                                           data and files
     * @param MessageBusInterface $commandBus    Command bus interface
     * @param CourseService       $courseService Course service for file handling
     *
     * @return JsonResponse       Response indicating course creation status
     */
    public function createCourse(Request $request, MessageBusInterface $commandBus, CourseService $courseService): JsonResponse
    {
        $jsonData = $request->request->get('data', null);
        if (! $jsonData) {
            return new JsonResponse(
                [
                    'error' => 'Invalid request, missing data',
                ],
                400
            );
        }

        $data = json_decode($jsonData, true);
        if (! $data || ! isset($data['user_id'], $data['course'], $data['modules'])) {
            return new JsonResponse(
                [
                    'error' => 'Missing required fields',
                ],
                400
            );
        }

        $files = $request->files->all();
        $processedFiles = [];

        foreach ($files['modules'] ?? [] as $moduleIndex => $moduleFiles) {
            foreach ($moduleFiles['lessons'] ?? [] as $lessonIndex => $lessonFiles) {
                if (isset($lessonFiles['resource'])) {
                    $processedFiles['modules'][$moduleIndex]['lessons'][$lessonIndex]['resource'] = $courseService
                        ->uploadFile(
                            $lessonFiles['resource']
                        );
                }
            }
        }

        $command = new CreateFullCourseCommand(
            $data['user_id'],
            $data['course'],
            $data['modules'],
            $processedFiles
        );

        $commandBus->dispatch($command);

        return new JsonResponse(
            [
                'message' => 'Course creation started',
            ],
            202
        );
    }

    /**
     * Get user courses with modules and analytics
     *
     * @param int $id User ID
     *
     * @return JsonResponse User courses data with video analytics
     */
    public function getUserCoursesModules(
        int $id,
    ): JsonResponse {
        try {
            $userData = $this->queryBusService->handle(
                new GetUserCoursesModulesQuery($id)
            );

            $videoAnalytics = $this->videoAnalytics
                ->getInstructorVideoAnalytics($id);

            foreach ($userData['courses'] as &$course) {
                foreach ($course['modules'] as &$module) {
                    foreach ($module['lessons'] as &$lesson) {
                        if ($lesson['type'] === 'registered') {
                            $lessonAnalytics = $this->videoAnalytics
                                ->getLessonAnalytics($lesson['id']);
                            $lesson['analytics'] = $lessonAnalytics;
                        }
                    }
                }
            }

            $response = [
                ...$userData,
                'videoAnalytics' => $videoAnalytics,
            ];

            return $this->json($response);
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
     * Get courses with modules and lessons (without resources)
     *
     * @param int $id Course ID
     *
     * @return JsonResponse Courses data without resources
     */
    public function getCoursesModulesLessonsWithoutResources(
        int $id,
    ): JsonResponse {
        try {
            $coursesData = $this->queryBusService->handle(
                new GetCoursesModulesLessonsWithoutResourcesQuery($id)
            );

            return $this->json(
                [
                    'courses' => $coursesData,
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
     * Get course details with modules and lessons
     *
     * @param int $id Course ID
     *
     * @return JsonResponse Complete course structure
     */
    public function getCourseWithModulesAndLessons(
        int $id,
    ): JsonResponse {
        try {
            $courseData = $this->queryBusService->handle(
                new GetCourseWithModulesAndLessonsQuery($id)
            );

            return $this->json($courseData);
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
     * Translate lesson content
     *
     * @param int           $id            Lesson ID
     * @param Request       $request       HTTP request containing
     *                                     language preference
     * @param CourseService $courseService Course service for translation
     *
     * @return JsonResponse Translated lesson content
     */
    public function translateLesson(
        int $id,
        Request $request,
        CourseService $courseService
    ): JsonResponse {
        try {
            $language = $request->request->get('lang', 'fr');
            $result = $courseService->translateLesson($id, $language);

            return $this->json($result);
        } catch (\Exception $e) {
            return $this->json(
                [
                    'status' => 'error',
                    'message' => $e->getMessage(),
                ],
                500
            );
        }
    }

    /**
     * Generate lesson notes automatically
     *
     * @param int           $id            Lesson ID
     * @param CourseService $courseService Course service for note generation
     *
     * @return JsonResponse Generated lesson notes
     */
    public function generateLessonNotes(
        int $id,
        CourseService $courseService
    ): JsonResponse {
        try {
            $result = $courseService->generateLessonNotes($id);

            return $this->json($result);
        } catch (\Exception $e) {
            return $this->json(
                [
                    'status' => 'error',
                    'message' => $e->getMessage(),
                ],
                500
            );
        }
    }

    /**
     * Update course information
     *
     * @param int     $id      Course ID
     * @param Request $request HTTP request containing updated course data
     *
     * @return JsonResponse Update confirmation
     */
    public function update(
        int $id,
        Request $request
    ): JsonResponse {
        $data = json_decode(
            $request->getContent(),
            true
        );

        if (! isset($data['title'], $data['description'], $data['duration'], $data['level'])) {
            return new JsonResponse(
                [
                    'error' => 'Missing required fields',
                ],
                400
            );
        }

        $command = new UpdateCourseCommand(
            id: $id,
            title: $data['title'],
            description: $data['description'],
            duration: $data['duration'],
            level: $data['level'],
            price: $data['price'] ?? null,
            image: $data['image'] ?? null,
            category: $data['category'] ?? null,
            promotion: $data['promotion'] ?? null,
            discount: $data['discount'] ?? null
        );

        $this->commandBusService->handle($command);

        return $this->json(
            [
                'message' => 'Course updated successfully',
            ],
            200
        );
    }

    /**
     * Delete a course
     *
     * @param int $id Course ID
     *
     * @return JsonResponse Deletion confirmation
     */
    public function delete(int $id): JsonResponse
    {
        $command = new DeleteCourseCommand($id);
        $this->commandBusService->handle($command);

        return new JsonResponse(
            [
                'message' => 'Course deleted successfully',
            ],
            204
        );
    }

    /**
     * Get latest courses
     *
     * @return JsonResponse List of recently added courses
     */
    public function getLatestCourses(): JsonResponse
    {
        $courses = $this->queryBusService->handle(
            new GetLatestCoursesQuery()
        );

        return $this->json(
            $courses,
            200,
            [],
            [
                'groups' => 'course:read',
            ]
        );
    }

    /**
     * Get free courses
     *
     * @return JsonResponse List of free courses
     */
    public function getFreeCourses(): JsonResponse
    {
        $courses = $this->queryBusService->handle(
            new GetFreeCoursesQuery()
        );

        return $this->json(
            $courses,
            200,
            [],
            [
                'groups' => 'course:read',
            ]
        );
    }

    /**
     * Get recommended courses for user
     *
     * @param int $id User ID
     *
     * @return JsonResponse List of recommended courses
     */
    public function getRecommendedCourses(int $id): JsonResponse
    {
        try {
            $courses = $this->queryBusService->handle(
                new GetRecommendedCoursesQuery($id)
            );
        } catch (NotFoundHttpException $e) {
            return $this->json(
                [
                    'error' => $e->getMessage(),
                ],
                404
            );
        }

        if (empty($courses)) {
            return $this->json(
                [
                    'message' => 'No courses found matching your interests',
                ],
                200
            );
        }

        return $this->json(
            $courses,
            200,
            [],
            [
                'groups' => 'course:read',
            ]
        );
    }

    /**
     * Get courses by category
     *
     * @param int               $id         Category ID
     * @param CoursesRepository $courseRepo Courses repository
     *
     * @return JsonResponse List of courses in specified category
     */
    public function getCoursesByCategory(
        int $id,
        CoursesRepository $courseRepo
    ): JsonResponse {
        $courses = $courseRepo->findBy(
            [
                'category' => $id,
            ]
        );
        return $this->json(
            $courses,
            200,
            [],
            [
                'groups' => 'course:read',
            ]
        );
    }

    /**
     * Get quiz questions for lesson
     *
     * @param int              $lessonId         Lesson ID
     * @param LessonRepository $lessonRepository Lesson repository
     * @param QuizRepository   $quizRepository   Quiz repository
     *
     * @return JsonResponse Quiz questions and answers
     */
    public function getQuizQuestions(
        int $lessonId,
        LessonRepository $lessonRepository,
        QuizRepository $quizRepository
    ): JsonResponse {

        $lesson = $lessonRepository->find($lessonId);

        if (! $lesson) {
            return $this->json(
                [
                    'error' => 'Lesson not found',
                ],
                404
            );
        }

        $course = $lesson->getCourse();

        if (! $course) {
            return $this->json(
                [
                    'error' => 'Course not found for this lesson',
                ],
                404
            );
        }

        $quiz = $quizRepository->findOneBy(
            [
                'course' => $course,
            ]
        );

        if (! $quiz) {
            return $this->json(
                [
                    'error' => 'Quiz not found for this course',
                ],
                404
            );
        }

        $questions = $quiz->getQuestions();
        $result = [];

        foreach ($questions as $question) {
            $answers = [];
            foreach ($question->getAnswers() as $answer) {
                $answers[] = [
                    'id' => $answer->getId(),
                    'text' => $answer->getText(),
                    'isCorrect' => $answer->isCorrect(),
                ];
            }

            $result[] = [
                'id' => $question->getId(),
                'text' => $question->getText(),
                'answers' => $answers,
                'position' => $question->getPosition(),
            ];
        }

        return $this->json(
            [
                'timeLimit' => $quiz->getTimeLimit(),
                'questions' => $result,
            ]
        );
    }

    /**
     * Save quiz score
     *
     * @param Request $request HTTP request containing quiz results
     *
     * @return JsonResponse Score saving confirmation
     */
    public function saveScore(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (! isset($data['userId'], $data['quizId'], $data['score'], $data['totalQuestions'])) {
            return $this->json(
                [
                    'error' => 'Missing required fields',
                ],
                400
            );
        }

        $user = $this->userRepository->find($data['userId']);
        if (! $user) {
            return $this->json(
                [
                    'error' => 'User not found',
                ],
                404
            );
        }

        $quiz = $this->quizRepository->find($data['quizId']);
        if (! $quiz) {
            return $this->json(
                [
                    'error' => 'Quiz not found',
                ],
                404
            );
        }

        $score = new QuizScore();
        $score->setUser($user);
        $score->setQuiz($quiz);
        $score->setScore($data['score']);
        $score->setTotalQuestions($data['totalQuestions']);
        $score->setCompletedAt(new DateTimeImmutable());

        $this->entityManager->persist($score);
        $this->entityManager->flush();

        return $this->json(
            [
                'success' => true,
                'scoreId' => $score->getId(),
            ]
        );
    }

    /**
     * Get quiz comparison data
     *
     * @param int     $quizId  Quiz ID
     * @param Request $request HTTP request containing user score data
     *
     * @return JsonResponse Comparative quiz statistics
     */
    public function getComparisonData(
        int $quizId,
        Request $request
    ): JsonResponse {
        $userId = (int) $request->query->get('userId', '0');
        $userScore = (int) $request->query->get('userScore', '0');
        $totalQuestions = (int) $request->query->get('totalQuestions', '0');

        if (! $userId || ! $userScore || ! $totalQuestions) {
            return $this->json(
                [
                    'error' => 'Missing required parameters',
                ],
                400
            );
        }

        $stats = $this->quizScoreRepository->getQuizStatistics($quizId);
        $ranking = $this->quizScoreRepository->getUserRanking(
            $quizId,
            $userId,
            $userScore
        );

        return $this->json(
            [
                'averageScore' => (float) $stats['averageScore'],
                'highestScore' => (int) $stats['highestScore'],
                'totalAttempts' => (int) $stats['totalAttempts'],
                'ranking' => [
                    'position' => (int) $ranking['position'],
                    'total' => (int) $ranking['total'],
                ],
            ]
        );
    }

    /**
     * Get trending courses
     *
     * @param StudentCourseRepository $studentCourseRepo Student course
     *                                                   repository
     * @param SerializerInterface     $serializer        Serializer interface
     *
     * @return JsonResponse List of popular courses
     */
    public function getTrendingCourses(
        StudentCourseRepository $studentCourseRepo,
        SerializerInterface $serializer
    ): JsonResponse {
        $courses = $studentCourseRepo->findTrendingCourses();

        return new JsonResponse(
            $serializer->serialize(
                $courses,
                'json',
                [
                    'groups' => ['course:read'],
                ]
            ),
            200,
            [],
            true
        );
    }

    /**
     * Get instructor forum posts
     *
     * @param int                 $id                  Instructor ID
     * @param ForumPostRepository $forumPostRepository Forum post repository
     * @param SerializerInterface $serializer          Serializer interface
     *
     * @return JsonResponse List of instructor's forum posts
     */
    public function getInstructorForumPosts(
        int $id,
        ForumPostRepository $forumPostRepository,
        SerializerInterface $serializer
    ): JsonResponse {
        $forumPosts = $forumPostRepository->findByInstructorId($id);

        $json = $serializer->serialize(
            $forumPosts,
            'json',
            [
                'groups' => ['forum:read'],
            ]
        );

        return new JsonResponse(
            $json,
            200,
            [],
            true
        );
    }

    /**
     * Get quiz scores for lesson
     *
     * @param int                 $id                  Lesson ID
     * @param LessonRepository    $lessonRepository    Lesson repository
     * @param QuizScoreRepository $quizScoreRepository Quiz score repository
     *
     * @return JsonResponse Quiz score data
     */
    public function getQuizScoresForLesson(
        int $id,
        LessonRepository $lessonRepository,
        QuizScoreRepository $quizScoreRepository
    ): JsonResponse {
        $lesson = $lessonRepository->find($id);

        if (! $lesson) {
            return $this->json(
                [
                    'error' => 'Lesson not found',
                ],
                404
            );
        }

        $course = $lesson->getCourse();
        if (! $course) {
            return $this->json(
                [
                    'error' => 'No course associated with lesson',
                ],
                404
            );
        }

        $quiz = $course->getQuiz();
        if (! $quiz) {
            return $this->json(
                [
                    'error' => 'No quiz associated with course',
                ],
                404
            );
        }

        $quizScores = $quizScoreRepository->findBy(
            [
                'quiz' => $quiz,
            ]
        );

        $data = array_map(
            fn ($score) => [
                'id' => $score->getId(),
                'user_id' => $score->getUser()?->getId(),
                'quiz_id' => $score->getQuiz()?->getId(),
                'score' => $score->getScore(),
            ],
            $quizScores
        );

        return $this->json($data);
    }
}
