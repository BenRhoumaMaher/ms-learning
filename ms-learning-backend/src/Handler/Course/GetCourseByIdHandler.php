<?php

namespace App\Handler\Course;

use App\Repository\CoursesRepository;
use App\Query\Course\GetCourseByIdQuery;
use App\Service\Course\CourseService;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

#[AsMessageHandler]
class GetCourseByIdHandler
{
    public function __construct(
        private CoursesRepository $courseRepository,
        private CourseService $courseService
    ) {
    }

    public function __invoke(GetCourseByIdQuery $query)
    {
        $course = $this->courseService->getCourseById($query->id);
        return $course;
    }
}
