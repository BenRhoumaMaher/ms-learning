<?php

namespace App\Handler\User;

use App\Query\User\GetInstructorCoursesWithoutQuizQuery;
use App\Repository\UserRepository;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
class GetInstructorCoursesWithoutQuizQueryHandler
{
    public function __construct(
        private UserRepository $userRepository
    ) {
    }

    public function __invoke(GetInstructorCoursesWithoutQuizQuery $query): array
    {
        $instructor = $this->userRepository->find($query->instructorId);

        if (! $instructor) {
            throw new \Exception('Instructor not found');
        }

        $coursesWithoutQuiz = [];

        foreach ($instructor->getCourses() as $course) {
            if ($course->getQuiz() === null) {
                $coursesWithoutQuiz[] = [
                    'id' => $course->getId(),
                    'title' => $course->getTitle(),
                ];
            }
        }

        return $coursesWithoutQuiz;
    }
}
