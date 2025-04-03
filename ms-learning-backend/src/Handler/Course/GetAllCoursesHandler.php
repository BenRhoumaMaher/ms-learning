<?php

namespace App\Handler\Course;

use App\Repository\CoursesRepository;
use App\Query\Course\GetAllCoursesQuery;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;
use App\Service\Course\CourseService;

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
