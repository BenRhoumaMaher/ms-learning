<?php

/**
 * This file defines the handler for retrieving a user's live lesson sessions
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

use App\Query\Lesson\GetUserLiveSessionsQuery;
use App\Repository\LessonRepository;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

/**
 * Handles queries for retrieving a user's scheduled live lesson sessions.
 * Formats the session data with comprehensive timing information and
 * related course/instructor details.
 *
 * @category Handlers
 * @package  App\Handler\Lesson
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 */
#[AsMessageHandler]
class GetUserLiveSessionsHandler
{
    /**
     * @param LessonRepository $lessonRepository Repository for lesson entities
     */
    public function __construct(
        private LessonRepository $lessonRepository
    ) {
    }

    /**
     * Handle user live sessions query
     *
     * Retrieves and formats a user's live lesson sessions with:
     * - Session identification (ID, title)
     * - Detailed timing information (date, start/end times, duration)
     * - Course context (title, image)
     * - Instructor information
     *
     * @param GetUserLiveSessionsQuery $query Contains:
     *                                        - id: string (required) User ID
     *
     * @return array Array of formatted live sessions containing:
     *              - id: string Session ID
     *              - title: string Session title
     *              - date: string Session date (Y-m-d format)
     *              - startTime: string Start time (H:i format)
     *              - endTime: string End time (H:i format)
     *              - duration: string Session duration
     *              - course: string Course title
     *              - instructor: string Instructor username
     *              - image: string Course image URL
     */
    public function __invoke(GetUserLiveSessionsQuery $query): array
    {
        $liveSessions = $this->lessonRepository->findUserLiveSessions(
            $query->id
        );

        return array_map(
            fn ($session) => [
                'id' => $session->getId(),
                'title' => $session->getTitle(),
                'date' => $session->getLiveStartTime()->format('Y-m-d'),
                'startTime' => $session->getLiveStartTime()->format('H:i'),
                'endTime' => $session->getLiveEndTime()->format('H:i'),
                'duration' => $session->getDuration(),
                'course' => $session->getCourse()->getTitle(),
                'instructor' => $session->getUser()->getUserName(),
                'image' => $session->getCourse()->getImage(),
            ],
            $liveSessions
        );
    }
}
