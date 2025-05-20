<?php

namespace App\Handler\Course;

use App\Query\Course\GetLatestCoursesQuery;
use App\Repository\CoursesRepository;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
class GetLatestCoursesHandler
{
    public function __construct(
        private CoursesRepository $coursesRepository
    ) {
    }

    public function __invoke(GetLatestCoursesQuery $query): array
    {
        return $this->coursesRepository->findBy(
            [],
            [
                'createdAt' => 'DESC',
            ],
            $query->limit
        );
    }
}
