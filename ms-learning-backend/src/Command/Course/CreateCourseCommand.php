<?php

/**
 * This file defines the CreateCourseCommand DTO (Data Transfer Object),
 * which encapsulates all necessary data for creating a new course.
 * It serves as a structured input for course creation operations.
 *
 * @category Commands
 * @package  App\Command\Course
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 * @project  MS-Learning (PFE Project)
 */

namespace App\Command\Course;

/**
 * Represents the data required to create a new course in the MS-Learning platform.
 * Contains all course properties including
 * optional fields for promotions and discounts.
 *
 * @category Commands
 * @package  App\Command\Course
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 */
class CreateCourseCommand
{
    /**
     * Initializes a new instance of the CreateCourseCommand with course details.
     *
     * @param string      $title       The title of the course.
     * @param string      $description The detailed description of the course.
     * @param string      $duration    The duration of the course (e.g., "2 hours").
     * @param string      $level       The difficulty level of the course.
     * @param float|null  $price       The price of the course (optional).
     * @param string|null $image       The image URL/path for the course (optional).
     * @param string|null $category    The category of the course (optional).
     * @param bool|null   $promotion   Whether the course is on promotion (optional).
     * @param float|null  $discount    The discount percentage if
     *                                 the course is on promotion (optional).
     */
    public function __construct(
        public string $title,
        public string $description,
        public string $duration,
        public string $level,
        public ?float $price = null,
        public ?string $image = null,
        public ?string $category = null,
        public ?bool $promotion = null,
        public ?float $discount = null
    ) {
    }
}
