<?php

namespace App\Handler\Course;

use App\Repository\CoursesRepository;
use App\Service\Course\CourseService;
use Doctrine\ORM\EntityManagerInterface;
use App\Command\Course\UpdateCourseCommand;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;
use Symfony\Component\Messenger\Handler\MessageHandlerInterface;

#[AsMessageHandler]

class UpdateCourseCommandHandler
{
    public function __construct(
        private EntityManagerInterface $em,
        private CoursesRepository $courseRepository,
        private CourseService $courseService
    ) {
    }

    public function __invoke(UpdateCourseCommand $command)
    {
        $course = $this->courseRepository->find($command->id);

        if (!$course) {
            throw new \Exception('Course not found');
        }

        $courseData = [
            'title' => $command->title,
            'description' => $command->description,
            'duration' => $command->duration,
            'level' => $command->level,
            'price' => $command->price,
            'image' => $command->image,
            'category' => $command->category,
            'promotion' => $command->promotion,
            'discount' => $command->discount,
        ];

        $this->courseService->updateCourse($course, $courseData);
    }
}
