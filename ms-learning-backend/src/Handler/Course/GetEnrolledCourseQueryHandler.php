<?php

namespace App\Handler\Course;

use App\Repository\CoursesRepository;
use App\Service\Course\CourseService;
use App\Query\Course\GetCourseByIdQuery;
use App\Query\Course\GetEnrolledCourseQuery;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

#[AsMessageHandler]
class GetEnrolledCourseQueryHandler
{
    public function __construct(
        private CourseService $courseService
    ) {
    }

    public function __invoke(GetEnrolledCourseQuery $query)
    {
        $course = $this->courseService->getEnrolledCourseById($query->id);
        return $course;
    }
}
