<?php

namespace App\Handler\Course;

use App\Command\Course\DeleteCourseCommand;
use App\Repository\CoursesRepository;
use App\Service\Course\CourseService;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]

class DeleteCourseCommandHandler
{
    public function __construct(
        private CoursesRepository $courseRepository,
        private CourseService $courseService
    ) {
    }

    public function __invoke(DeleteCourseCommand $command)
    {
        $course = $this->courseRepository->find($command->id);
        if (! $course) {
            throw new \Exception('Course not found');
        }

        $this->courseService->deleteCourse($course);
    }
}
