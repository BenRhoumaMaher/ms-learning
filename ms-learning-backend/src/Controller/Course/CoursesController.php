<?php

namespace App\Controller\Course;

use App\Repository\UserRepository;
use App\Repository\LessonRepository;
use App\Repository\CoursesRepository;
use App\Service\Course\CourseService;
use App\Repository\CategoryRepository;
use App\Query\Course\GetAllCoursesQuery;
use App\Query\Course\GetCourseByIdQuery;
use Doctrine\ORM\EntityManagerInterface;
use App\Query\Course\GetFreeCoursesQuery;
use App\Command\Course\DeleteCourseCommand;
use App\Command\Course\UpdateCourseCommand;
use App\Query\Course\GetLatestCoursesQuery;
use App\Query\Course\GetEnrolledCourseQuery;
use App\Query\Course\GetEnrollzdCourseQuery;
use Symfony\Component\HttpFoundation\Request;
use App\Query\User\GetUserCoursesModulesQuery;
use Symfony\Component\Routing\Attribute\Route;
use App\Command\Course\CreateFullCourseCommand;
use App\Query\Course\GetRecommendedCoursesQuery;
use App\Service\QueryBusService\QueryBusService;
use Symfony\Component\HttpFoundation\JsonResponse;
use App\Service\CommandBusService\CommandBusService;
use Symfony\Component\Messenger\MessageBusInterface;
use App\Query\Course\GetCourseWithModulesAndLessonsQuery;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use App\Query\Course\GetCoursesModulesLessonsWithoutResourcesQuery;

class CoursesController extends AbstractController
{
    public function __construct(
        private QueryBusService $queryBusService,
        private CommandBusService $commandBusService
    ) {
    }

    public function index(): JsonResponse
    {
        $courses = $this->queryBusService->handle(new GetAllCoursesQuery());
        return $this->json(
            $courses,
            200,
            [],
            ['groups' => 'course:read']
        );
    }

    public function show(int $id): JsonResponse
    {
        $course = $this->queryBusService->handle(new GetCourseByIdQuery($id));
        return $this->json(
            $course,
            200,
            [],
            ['groups' => 'course:read']
        );
    }

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
            'endDate' => $course->getEndDate()
        ];

        return $this->json($data);
    }

    public function createCourse(Request $request, MessageBusInterface $commandBus, CourseService $courseService): JsonResponse
    {
        $jsonData = $request->request->get('data');
        if (!$jsonData) {
            return new JsonResponse(['error' => 'Invalid request, missing data'], 400);
        }

        $data = json_decode($jsonData, true);
        if (!$data || !isset($data['user_id'], $data['course'], $data['modules'])) {
            return new JsonResponse(['error' => 'Missing required fields'], 400);
        }

        $files = $request->files->all();
        $processedFiles = [];

        foreach ($files['modules'] ?? [] as $moduleIndex => $moduleFiles) {
            foreach ($moduleFiles['lessons'] ?? [] as $lessonIndex => $lessonFiles) {
                if (isset($lessonFiles['resource'])) {
                    $processedFiles['modules'][$moduleIndex]['lessons'][$lessonIndex]['resource'] =
                        $courseService->uploadFile($lessonFiles['resource']);
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

        return new JsonResponse(['message' => 'Course creation started'], 202);
    }

    public function getUserCoursesModules(
        int $id,
        MessageBusInterface $queryBus
    ): JsonResponse {
        try {
            $userData = $this->queryBusService->handle(
                new GetUserCoursesModulesQuery($id)
            );

            return $this->json($userData);
        } catch (\Exception $e) {
            return $this->json(['error' => $e->getMessage()], 404);
        }
    }

    public function getCoursesModulesLessonsWithoutResources(
        int $id,
        MessageBusInterface $queryBus
    ): JsonResponse {
        try {
            $coursesData = $this->queryBusService->handle(
                new GetCoursesModulesLessonsWithoutResourcesQuery($id)
            );

            return $this->json(
                ['courses' => $coursesData]
            );
        } catch (\Exception $e) {
            return $this->json(
                ['error' => $e->getMessage()],
                404
            );
        }
    }

    public function getCourseWithModulesAndLessons(
        int $id,
    ): JsonResponse {
        try {
            $courseData = $this->queryBusService->handle(
                new GetCourseWithModulesAndLessonsQuery($id)
            );

            return $this->json($courseData);
        } catch (\Exception $e) {
            return $this->json(['error' => $e->getMessage()], 404);
        }
    }

    public function translateLesson(
        int $id,
        Request $request,
        LessonRepository $lessonRepository,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        try {
            $lesson = $lessonRepository->find($id);
            if (!$lesson) {
                throw $this->createNotFoundException('Lesson not found');
            }

            $language = $request->request->get('lang', 'fr');

            if ($lesson->getTranslation($language)) {
                return $this->json(
                    [
                    'status' => 'success',
                    'from_cache' => true,
                    'segments' => $lesson->getTranslation($language)
                    ]
                );
            }

            $videoPath = $this->getParameter(
                'kernel.project_dir'
            ) . '/public/' . $lesson->getVideoUrl();
            if (!file_exists($videoPath)) {
                throw new \Exception('Video file not found');
            }

            $client = new \GuzzleHttp\Client();
            $response = $client->post(
                'http://whisper:5000/transcribe',
                [
                'multipart' => [
                    [
                        'name' => 'video',
                        'contents' => fopen($videoPath, 'r'),
                        'filename' => 'video.mp4'
                    ],
                    [
                        'name' => 'lang',
                        'contents' => $language
                    ]
                ],
                'timeout' => 60
                ]
            );

            $subtitles = json_decode($response->getBody(), true);

            if (!isset($subtitles['segments'])) {
                throw new \Exception('Invalid response from translation service');
            }

            $lesson->addTranslation($language, $subtitles['segments']);
            $entityManager->persist($lesson);
            $entityManager->flush();

            return $this->json(
                [
                'status' => 'success',
                'from_cache' => false,
                'segments' => $subtitles['segments']
                ]
            );

        } catch (\Exception $e) {
            return $this->json(
                [
                'status' => 'error',
                'message' => $e->getMessage()
                ],
                500
            );
        }
    }


    public function update(
        int $id,
        Request $request
    ): JsonResponse {
        $data = json_decode(
            $request->getContent(),
            true
        );

        if (!isset($data['title'], $data['description'], $data['duration'], $data['level'])) {
            return new JsonResponse(
                ['error' => 'Missing required fields'],
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
            ['message' => 'Course updated successfully'],
            200
        );
    }


    public function delete(int $id): JsonResponse
    {
        $command = new DeleteCourseCommand($id);
        $this->commandBusService->handle($command);

        return new JsonResponse(
            ['message' => 'Course deleted successfully'],
            204
        );
    }

    public function getLatestCourses(): JsonResponse
    {
        $courses = $this->queryBusService->handle(
            new GetLatestCoursesQuery()
        );

        return $this->json(
            $courses,
            200,
            [],
            ['groups' => 'course:read']
        );
    }

    public function getFreeCourses(): JsonResponse
    {
        $courses = $this->queryBusService->handle(
            new GetFreeCoursesQuery()
        );

        return $this->json(
            $courses,
            200,
            [],
            ['groups' => 'course:read']
        );
    }

    public function getRecommendedCourses(int $id): JsonResponse
    {
        try {
            $courses = $this->queryBusService->handle(
                new GetRecommendedCoursesQuery($id)
            );
        } catch (NotFoundHttpException $e) {
            return $this->json(['error' => $e->getMessage()], 404);
        }

        if (empty($courses)) {
            return $this->json(
                ['message' => 'No courses found matching your interests'],
                200
            );
        }

        return $this->json(
            $courses,
            200,
            [],
            ['groups' => 'course:read']
        );
    }

    public function getCoursesByCategory(
        int $id,
        CoursesRepository $courseRepo
    ): JsonResponse {
        $courses = $courseRepo->findBy(['category' => $id]);
        return $this->json(
            $courses,
            200,
            [],
            ['groups' => 'course:read']
        );
    }

    // public function create(
    //     Request $request,
    //     ValidatorInterface $validator
    // ): JsonResponse {
    //     $data = json_decode($request->getContent(), true);

    //     if (!isset($data['title'], $data['description'], $data['duration'], $data['level'])) {
    //         return new JsonResponse(
    //             ['error' => 'Missing required fields (title, description, duration, level)'],
    //             400
    //         );
    //     }

    //     $course = $this->courseService->createCourse($data);

    //     return $this->json(
    //         $course,
    //         201
    //     );
    // }
}
