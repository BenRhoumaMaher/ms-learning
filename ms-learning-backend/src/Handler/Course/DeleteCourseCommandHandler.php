<?php

/**
 * This file defines the DeleteCourseCommandHandler which handles the deletion
 * of courses in the MS-LEARNING platform.
 *
 * @category Handlers
 * @package  App\Handler\Course
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 * @project  MS-Learning (PFE Project)
 */

namespace App\Handler\Course;

use App\Command\Course\DeleteCourseCommand;
use App\Repository\CoursesRepository;
use App\Service\Course\CourseService;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

/**
 * Handles the DeleteCourseCommand to remove course entities from the system.
 * Uses the CourseService to handle the actual deletion process including
 * any necessary cleanup of related resources.
 *
 * @category Handlers
 * @package  App\Handler\Course
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 */
#[AsMessageHandler]
class DeleteCourseCommandHandler
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
     * Handle course deletion command
     *
     * Finds and deletes a course entity based on the provided ID.
     * Throws an exception if the course cannot be found.
     *
     * @param DeleteCourseCommand $command Contains course deletion data:
     *                                     - id: string (required) ID of course to delete
     *
     * @throws \Exception When course with specified ID is not found
     */
    public function __invoke(DeleteCourseCommand $command)
    {
        $course = $this->courseRepository->find($command->id);
        if (! $course) {
            throw new \Exception('Course not found');
        }

        $this->courseService->deleteCourse($course);
    }
}
