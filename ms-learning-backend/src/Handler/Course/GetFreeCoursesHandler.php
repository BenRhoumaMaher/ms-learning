<?php

/**
 * This file defines the handler for retrieving free courses (price = 0.00)
 * in the MS-LEARNING platform.
 *
 * @category Handlers
 * @package  App\Handler\Course
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 * @project  MS-Learning (PFE Project)
 */

namespace App\Handler\Course;

use App\Query\Course\GetFreeCoursesQuery;
use App\Repository\CoursesRepository;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

/**
 * Handles queries for retrieving all free courses (price = 0.00) from the system.
 * Results are sorted by creation date in descending order (newest first).
 *
 * @category Handlers
 * @package  App\Handler\Course
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 */
#[AsMessageHandler]
class GetFreeCoursesHandler
{
    /**
     * @param CoursesRepository $coursesRepository Repository for course entities
     */
    public function __construct(
        private CoursesRepository $coursesRepository
    ) {
    }

    /**
     * Handle free courses retrieval
     *
     * Retrieves all courses with price set to 0.00 (free courses).
     * Results are ordered by creation date (newest courses first).
     *
     * @param GetFreeCoursesQuery $query The query object (currently no parameters needed)
     *
     * @return array List of free course entities
     */
    public function __invoke(GetFreeCoursesQuery $query): array
    {
        return $this->coursesRepository->findBy(
            [
                'price' => 0.00,
            ],
            [
                'createdAt' => 'DESC',
            ]
        );
    }
}
