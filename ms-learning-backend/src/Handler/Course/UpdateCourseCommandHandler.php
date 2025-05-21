<?php

/**
 * This file defines the handler for updating course information
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

use App\Command\Course\UpdateCourseCommand;
use App\Repository\CoursesRepository;
use App\Service\Course\CourseService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

/**
 * Handles the updating of course information including:
 * - Basic course details (title, description)
 * - Course metadata (duration, level)
 * - Pricing and promotional information
 * - Category and image updates
 *
 * @category Handlers
 * @package  App\Handler\Course
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 */
#[AsMessageHandler]
class UpdateCourseCommandHandler
{
    /**
     * @param EntityManagerInterface $em               Doctrine entity manager
     * @param CoursesRepository      $courseRepository Repository for course entities
     * @param CourseService          $courseService    Service handling course operations
     */
    public function __construct(
        private EntityManagerInterface $em,
        private CoursesRepository $courseRepository,
        private CourseService $courseService
    ) {
    }

    /**
     * Handle course update command
     *
     * Updates a course entity with the provided data through the CourseService.
     * Validates the existence of the course before proceeding with updates.
     *
     * @param UpdateCourseCommand $command Contains:
     *                                     - id: string (required) ID of course to update
     *                                     - title: string|null
     *                                     - description: string|null
     *                                     - duration: string|null
     *                                     - level: string|null
     *                                     - price: float|null
     *                                     - image: string|null
     *                                     - category: mixed|null
     *                                     - promotion: bool|null
     *                                     - discount: float|null
     *
     * @throws \Exception When the specified course is not found
     */
    public function __invoke(UpdateCourseCommand $command)
    {
        $course = $this->courseRepository->find($command->id);

        if (! $course) {
            throw new \Exception('Course not found');
        }

        $courseData = [
            'title' => $command->title,
            'description' => $command->description,
            'duration' => $command->duration,
            'level' => $command->level,
            'price' => $command->price,
            'image' => $command->image,
            'category' => $command->category,
            'promotion' => $command->promotion,
            'discount' => $command->discount,
        ];

        $this->courseService->updateCourse($course, $courseData);
    }
}
