<?php

/**
 * This file defines the handler for retrieving enrolled course details
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

use App\Query\Course\GetEnrolledCourseQuery;
use App\Service\Course\CourseService;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

/**
 * Handles queries for retrieving details of courses the student is enrolled in.
 * Specifically designed to return course information with enrollment context.
 * Delegates the actual retrieval to the CourseService.
 *
 * @category Handlers
 * @package  App\Handler\Course
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 */
#[AsMessageHandler]
class GetEnrolledCourseQueryHandler
{
    /**
     * @param CourseService $courseService Service handling course operations
     *                                     including enrollment-specific logic
     */
    public function __construct(
        private CourseService $courseService
    ) {
    }

    /**
     * Handle enrolled course retrieval
     *
     * Processes the GetEnrolledCourseQuery and returns the requested course
     * with enrollment context. The actual retrieval is delegated to the
     * CourseService which may include additional enrollment-specific data.
     *
     * @param GetEnrolledCourseQuery $query Contains:
     *                                      - id: string (required) ID of enrolled course to retrieve
     *
     * @return mixed The requested course entity with enrollment context,
     *              or null if not found/not enrolled
     */
    public function __invoke(GetEnrolledCourseQuery $query)
    {
        $course = $this->courseService->getEnrolledCourseById($query->id);
        return $course;
    }
}
