<?php

namespace App\Handler\Course;

use App\Query\Course\GetEnrolledCourseQuery;
use App\Service\Course\CourseService;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

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
