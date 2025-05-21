<?php

/**
 * This file defines the handler for retrieving a user's latest upcoming live lesson
 * in the MS-LEARNING platform.
 *
 * @category Handlers
 * @package  App\Handler\Lesson
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 * @project  MS-Learning (PFE Project)
 */

namespace App\Handler\Lesson;

use App\Query\Lesson\GetLatestUserLiveLessonQuery;
use App\Repository\LessonRepository;
use App\Repository\UserRepository;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

/**
 * Handles queries for retrieving a user's most recent upcoming live lesson.
 * Verifies user existence and checks for available live lessons before returning.
 *
 * @category Handlers
 * @package  App\Handler\Lesson
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 */
#[AsMessageHandler]
class GetLatestUserLiveLessonHandler
{
    /**
     * @param UserRepository   $userRepository   Repository for user entities
     * @param LessonRepository $lessonRepository Repository for lesson entities
     */
    public function __construct(
        private UserRepository $userRepository,
        private LessonRepository $lessonRepository
    ) {
    }

    /**
     * Handle latest live lesson query
     *
     * Retrieves the most recent upcoming live lesson for a user.
     * First verifies user existence, then checks for available live lessons.
     *
     * @param GetLatestUserLiveLessonQuery $query Contains:
     *                                            - id: string (required) User ID
     *
     * @return mixed The latest upcoming live lesson entity
     *
     * @throws \Exception When user not found or no upcoming live lessons exist
     */
    public function __invoke(GetLatestUserLiveLessonQuery $query)
    {
        $user = $this->userRepository->find($query->id);
        if (! $user) {
            throw new \Exception('User not found');
        }

        $lesson = $this->lessonRepository->findLatestLiveLessonForUser(
            $query->id
        );
        if (! $lesson) {
            throw new \Exception('No upcoming live lessons for this user');
        }

        return $lesson;
    }
}
