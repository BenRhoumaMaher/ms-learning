<?php

namespace App\Controller\Course;

use DateTime;
use App\Entity\Lesson;
use App\Entity\Module;
use DateTimeImmutable;
use App\Entity\Courses;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use App\Service\Course\CourseServiceInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
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



    public function show(int $id): JsonResponse
    {
        $course = $this->courseService->getCourseById($id);
        return $this->json($course);
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
        $updatedCourse = $this->courseService->updateCourse($course, $data);

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
