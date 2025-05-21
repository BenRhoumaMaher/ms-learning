<?php

/**
 * This file defines the GetAllCoursesHandler which handles retrieval
 * of all courses in the MS-LEARNING platform.
 *
 * @category Handlers
 * @package  App\Handler\Course
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 * @project  MS-Learning (PFE Project)
 */

namespace App\Handler\Course;

use App\Query\Course\GetAllCoursesQuery;
use App\Repository\CoursesRepository;
use App\Service\Course\CourseService;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

/**
 * Handles the GetAllCoursesQuery to retrieve all available courses.
 * Delegates the actual retrieval logic to the CourseService.
 *
 * @category Handlers
 * @package  App\Handler\Course
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 */
#[AsMessageHandler]
class GetAllCoursesHandler
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
     * Handle course retrieval query
     *
     * Processes the GetAllCoursesQuery and returns all available courses.
     * The actual retrieval is delegated to the CourseService.
     *
     * @param GetAllCoursesQuery $query The query object (unused parameters may be present for future extensibility)
     *
     * @return array Array of all course data
     */
    public function __invoke(GetAllCoursesQuery $query): array
    {
        return $this->courseService->getAllCourses();
    }
}
