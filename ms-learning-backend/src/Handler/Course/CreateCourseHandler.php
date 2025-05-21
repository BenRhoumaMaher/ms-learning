<?php

/**
 * This file defines the CreateCourseHandler which handles the creation
 * of new courses in the MS-LEARNING platform.
 *
 * @category Handlers
 * @package  App\Handler\Course
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 * @project  MS-Learning (PFE Project)
 */

namespace App\Handler\Course;

use App\Command\Course\CreateCourseCommand;
use App\Entity\Courses;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

/**
 * Handles the CreateCourseCommand to persist new course entities.
 * Sets all required and optional course properties based on command data.
 *
 * @category Handlers
 * @package  App\Handler\Course
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 */
#[AsMessageHandler]
class CreateCourseHandler
{
    /**
     * @param EntityManagerInterface $entityManager Doctrine entity manager
     */
    public function __construct(
        private EntityManagerInterface $entityManager
    ) {
    }

    /**
     * Handle course creation command
     *
     * Creates and persists a new Course entity with properties from the command.
     * Handles both required and optional fields.
     *
     * @param CreateCourseCommand $command Contains course creation data:
     *                                     - title: string (required)
     *                                     - description: string (required)
     *                                     - duration: string (required)
     *                                     - level: string (required)
     *                                     - price: float|null (optional)
     *                                     - image: string|null (optional)
     *                                     - category: Category|null (optional)
     *                                     - promotion: bool|null (optional)
     *                                     - discount: float|null (optional)
     *
     * @return Courses The created and persisted course entity
     */
    public function __invoke(CreateCourseCommand $command): Courses
    {
        $course = new Courses();
        $course->setTitle($command->title);
        $course->setDescription($command->description);
        $course->setDuration($command->duration);
        $course->setLevel($command->level);
        $course->setCreatedAt(new \DateTimeImmutable());

        if ($command->price !== null) {
            $course->setPrice($command->price);
        }
        if ($command->image !== null) {
            $course->setImage($command->image);
        }
        if ($command->category !== null) {
            $course->setCategory($command->category);
        }
        if ($command->promotion !== null) {
            $course->setPromotion($command->promotion);
        }
        if ($command->discount !== null) {
            $course->setDiscount($command->discount);
        }

        $this->entityManager->persist($course);
        $this->entityManager->flush();

        return $course;
    }
}
