<?php

namespace App\Controller\Course;

use App\Entity\User;
use App\Service\UserService\UserService;
use App\Service\LessonService\LessonService;
use Symfony\Component\HttpFoundation\Request;
use App\Service\Course\CourseServiceInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class CoursesController extends AbstractController
{
    public function __construct(
        private CourseServiceInterface $courseService
    ) {
    }

    public function index(): JsonResponse
    {
        $courses = $this->courseService->getAllCourses();
        return $this->json(
            $courses,
            200,
            [],
            ['groups' => 'course:read']
        );
    }

    public function createCourse(Request $request): JsonResponse
    {
        $result = $this->courseService->createFullCourse(
            $request
        );

        if (isset($result['error'])) {
            return new JsonResponse(
                ['message' => $result['error']],
                $result['status']
            );
        }

        return new JsonResponse(
            ['message' => $result['message']],
            $result['status']
        );
    }

    public function getUserCoursesModules(
        int $id,
        UserService $userService
    ): JsonResponse {
        $user = $userService->getUserById($id);

        if (!$user) {
            return $this->json(
                ['error' => 'User not found'],
                404
            );
        }

        $userData = $this->formatUserCourses($user);

        return $this->json($userData);
    }

    private function formatUserCourses(
        User $user
    ): array {
        $courses = [];

        foreach ($user->getCourses() as $course) {
            $modules = array_map(
                fn ($module) => [
                    'id' => $module->getId(),
                    'title' => $module->getTitle(),
                ],
                $course->getModules()->toArray()
            );

            $courses[] = [
                'id' => $course->getId(),
                'title' => $course->getTitle(),
                'modules' => $modules,
            ];
        }

        return [
            'username' => $user->getFirstname() . ' ' . $user->getLastName(),
            'courses' => $courses,
        ];
    }

    public function getCoursesModulesLessonsWithoutResources(
        int $id,
        UserService $userService,
        LessonService $lessonService
    ): JsonResponse {
        $user = $userService->getUserById($id);

        if (!$user) {
            return $this->json(
                ['error' => 'User not found'], 404
            );
        }

        $lessonsWithoutResources = $lessonService->getLessonsWithoutResources($user);

        $coursesData = $this->formatCoursesWithLessonsWithoutResources(
            $user, $lessonsWithoutResources
        );

        return $this->json(['courses' => $coursesData]);
    }

    private function formatCoursesWithLessonsWithoutResources(
        User $user, array $lessonIdsWithoutResources
    ): array {
        $result = [];

        foreach ($user->getCourses() as $course) {
            $courseData = [
                'id' => $course->getId(),
                'title' => $course->getTitle(),
                'modules' => []
            ];

            foreach ($course->getModules() as $module) {
                $moduleData = [
                    'id' => $module->getId(),
                    'title' => $module->getTitle(),
                    'lessons' => []
                ];

                foreach ($module->getLessons() as $lesson) {
                    if (in_array($lesson->getId(), $lessonIdsWithoutResources)) {
                        $moduleData['lessons'][] = [
                            'id' => $lesson->getId(),
                            'title' => $lesson->getTitle(),
                        ];
                    }
                }

                if (!empty($moduleData['lessons'])) {
                    $courseData['modules'][] = $moduleData;
                }
            }

            if (!empty($courseData['modules'])) {
                $result[] = $courseData;
            }
        }

        return $result;
    }

    public function show(int $id): JsonResponse
    {
        $course = $this->courseService->getCourseById($id);
        return $this->json(
            $course,
            200,
            [],
            ['groups' => 'course:read']
        );
    }

    public function create(
        Request $request,
        ValidatorInterface $validator
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['title'], $data['description'], $data['duration'], $data['level'])) {
            return new JsonResponse(
                ['error' => 'Missing required fields (title, description, duration, level)'],
                400
            );
        }

        $course = $this->courseService->createCourse($data);

        return $this->json(
            $course,
            201
        );
    }

    public function update(
        int $id,
        Request $request
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['title'], $data['description'], $data['duration'], $data['level'])) {
            return new JsonResponse(
                ['error' => 'Missing required fields (title, description, duration, level)'],
                400
            );
        }

        $course = $this->courseService->getCourseById($id);
        $updatedCourse = $this->courseService->updateCourse(
            $course,
            $data
        );

        return $this->json(
            $updatedCourse,
            200
        );
    }

    public function delete(int $id): JsonResponse
    {
        $course = $this->courseService->getCourseById($id);
        $this->courseService->deleteCourse($course);

        return new JsonResponse(
            ['message' => 'Course deleted successfully'],
            204
        );
    }
}
