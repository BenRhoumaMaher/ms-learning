<?php

namespace App\Handler\Course;

use App\Query\Course\GetAllCoursesQuery;
use App\Repository\CoursesRepository;
use App\Service\Course\CourseService;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
class GetAllCoursesHandler
{
    public function __construct(
        private CoursesRepository $courseRepository,
        private CourseService $courseService
    ) {
    }

    public function __invoke(GetAllCoursesQuery $query): array
    {
        return $this->courseService->getAllCourses();
    }
}
