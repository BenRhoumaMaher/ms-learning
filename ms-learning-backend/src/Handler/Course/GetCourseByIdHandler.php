<?php

/**
 * This file defines the handler for retrieving individual course details
 * by ID in the MS-LEARNING platform.
 *
 * @category Handlers
 * @package  App\Handler\Course
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 * @project  MS-Learning (PFE Project)
 */

namespace App\Handler\Course;

use App\Query\Course\GetCourseByIdQuery;
use App\Repository\CoursesRepository;
use App\Service\Course\CourseService;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

/**
 * Handles queries for retrieving individual course details by ID.
 * Delegates the actual retrieval to the CourseService.
 *
 * @category Handlers
 * @package  App\Handler\Course
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 */
#[AsMessageHandler]
class GetCourseByIdHandler
{
    /**
     * @param CoursesRepository $courseRepository Repository for course entities
     * @param CourseService     $courseService    Service handling course operations
     */
    public function __construct(
        private CoursesRepository $courseRepository,
        private CourseService $courseService
    ) {
    }

    /**
     * Handle course retrieval by ID
     *
     * Processes the GetCourseByIdQuery and returns the requested course.
     * The actual retrieval is delegated to the CourseService.
     *
     * @param  GetCourseByIdQuery $query Contains:
     *                                   - id: string (required) ID of course to retrieve
     * @return mixed The requested course entity or null if not found
     */
    public function __invoke(GetCourseByIdQuery $query)
    {
        $course = $this->courseService->getCourseById($query->id);
        return $course;
    }
}
