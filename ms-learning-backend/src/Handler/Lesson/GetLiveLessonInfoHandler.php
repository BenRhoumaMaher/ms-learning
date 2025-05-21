<?php

/**
 * This file defines the handler for retrieving detailed information
 * about a live lesson in the MS-LEARNING platform.
 *
 * @category Handlers
 * @package  App\Handler\Lesson
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 * @project  MS-Learning (PFE Project)
 */

namespace App\Handler\Lesson;

use App\Query\Lesson\GetLiveLessonInfoQuery;
use App\Repository\LessonRepository;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

/**
 * Handles queries for comprehensive live lesson information including:
 * - Basic lesson details
 * - Scheduling information
 * - Associated course data
 * - Quiz information
 * - Category reference
 *
 * @category Handlers
 * @package  App\Handler\Lesson
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 */
#[AsMessageHandler]
class GetLiveLessonInfoHandler
{
    /**
     * @param LessonRepository $lessonRepository Repository for lesson entities
     */
    public function __construct(
        private LessonRepository $lessonRepository
    ) {
    }

    /**
     * Handle live lesson info query
     *
     * Retrieves and formats comprehensive information about a live lesson including:
     * - Lesson metadata (title, content, position)
     * - Scheduling (start/end times, meeting link)
     * - Course information
     * - Quiz details (time limit, question count, passing score)
     * - Category reference
     *
     * @param GetLiveLessonInfoQuery $query Contains:
     *                                      - id: string (required) Lesson ID
     *
     * @return array Structured live lesson information containing:
     *              - id: string Lesson ID
     *              - title: string Lesson title
     *              - content: string Lesson content
     *              - liveStartTime: DateTime Lesson start time
     *              - liveEndTime: DateTime Lesson end time
     *              - position: int Lesson position
     *              - liveMeetingLink: string Meeting URL
     *              - course: array Course information including:
     *                - id: string Course ID
     *                - title: string Course title
     *                - quiz: array Quiz information including:
     *                  - id: string Quiz ID
     *                  - title: string Quiz title
     *                  - time_limit: int Time limit in minutes
     *                  - questions: int Question count
     *                  - passing_score: int Passing score percentage
     *              - category: string Category ID
     *
     * @throws \Exception When specified lesson is not found
     */
    public function __invoke(GetLiveLessonInfoQuery $query): array
    {
        $lesson = $this->lessonRepository->find($query->id);

        if (! $lesson) {
            throw new \Exception('Lesson not found');
        }

        return [
            'id' => $lesson->getId(),
            'title' => $lesson->getTitle(),
            'content' => $lesson->getContent(),
            'liveStartTime' => $lesson->getLiveStartTime(),
            'liveEndTime' => $lesson->getLiveEndTime(),
            'position' => $lesson->getPosition(),
            'liveMeetingLink' => $lesson->getLiveMeetingLink(),
            'course' => [
                'id' => $lesson->getCourse()->getId(),
                'title' => $lesson->getCourse()->getTitle(),
                'quiz' => [
                    'id' => $lesson->getCourse()->getQuiz()->getId(),
                    'title' => $lesson->getCourse()->getQuiz()->getTitle(),
                    'time_limit' => $lesson->getCourse()->getQuiz()->getTimeLimit(),
                    'questions' => count($lesson->getCourse()->getQuiz()->getQuestions()),
                    'passing_score' => $lesson->getCourse()->getQuiz()->getPassingScore(),
                ],
            ],
            'category' => $lesson->getCourse()->getCategory()->getId(),
        ];
    }
}
