<?php

/**
 * This file defines the handler for retrieving the most recently created courses
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

use App\Query\Course\GetLatestCoursesQuery;
use App\Repository\CoursesRepository;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

/**
 * Handles queries for retrieving the newest courses in the system.
 * Results are sorted by creation date in descending order (newest first)
 * and can be limited to a specific number of results.
 *
 * @category Handlers
 * @package  App\Handler\Course
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 */
#[AsMessageHandler]
class GetLatestCoursesHandler
{
    /**
     * @param CoursesRepository $coursesRepository Repository for course entities
     */
    public function __construct(
        private CoursesRepository $coursesRepository
    ) {
    }

    /**
     * Handle latest courses retrieval
     *
     * Retrieves the most recently created courses, ordered by creation date
     * (newest first). The number of results can be limited using the query parameter.
     *
     * @param GetLatestCoursesQuery $query Contains:
     *                                     - limit: int|null Maximum number of courses to return
     *
     * @return array List of course entities ordered by creation date (newest first)
     */
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
