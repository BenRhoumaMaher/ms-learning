<?php

/**
 * This file defines the handler for retrieving recommended courses
 * based on user interests in the MS-LEARNING platform.
 *
 * @category Handlers
 * @package  App\Handler\Course
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 * @project  MS-Learning (PFE Project)
 */

namespace App\Handler\Course;

use App\Query\Course\GetRecommendedCoursesQuery;
use App\Repository\UserRepository;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

/**
 * Handles queries for retrieving personalized course recommendations
 * based on a user's interests. Returns up to 6 unique courses sorted
 * by creation date (newest first) from the user's interest categories.
 *
 * @category Handlers
 * @package  App\Handler\Course
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 */
#[AsMessageHandler]
class GetRecommendedCoursesHandler
{
    /**
     * @param UserRepository $userRepository Repository for user entities
     */
    public function __construct(
        private UserRepository $userRepository
    ) {
    }

    /**
     * Handle recommended courses retrieval
     *
     * Retrieves personalized course recommendations by:
     * 1. Finding all courses from the user's interest categories
     * 2. Removing duplicates
     * 3. Sorting by creation date (newest first)
     * 4. Returning maximum 6 courses
     *
     * @param GetRecommendedCoursesQuery $query Contains:
     *                                          - userId: string (required) ID of user for recommendations
     *
     * @return array List of recommended course entities (max 6)
     *
     * @throws NotFoundHttpException When the specified user is not found
     */
    public function __invoke(GetRecommendedCoursesQuery $query): array
    {
        $user = $this->userRepository->find($query->userId);
        if (! $user) {
            throw new NotFoundHttpException('User not found');
        }

        $interests = $user->getInterests();
        if ($interests->isEmpty()) {
            return [];
        }

        $courses = [];
        foreach ($interests as $category) {
            $courses = array_merge($courses, $category->getCourses()->toArray());
        }

        $unique = [];
        $ids = [];
        foreach ($courses as $course) {
            if (! in_array($course->getId(), $ids)) {
                $unique[] = $course;
                $ids[] = $course->getId();
            }
        }

        usort($unique, fn ($a, $b) => $b->getCreatedAt() <=> $a->getCreatedAt());

        return array_slice($unique, 0, 6);
    }
}
