<?php

namespace App\Handler\Course;

use App\Repository\CoursesRepository;
use App\Query\Course\GetFreeCoursesQuery;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
class GetFreeCoursesHandler
{
    public function __construct(private CoursesRepository $coursesRepository)
    {
    }

    public function __invoke(GetFreeCoursesQuery $query): array
    {
        return $this->coursesRepository->findBy(
            ['price' => 0.00],
            ['createdAt' => 'DESC']
        );
    }
}
