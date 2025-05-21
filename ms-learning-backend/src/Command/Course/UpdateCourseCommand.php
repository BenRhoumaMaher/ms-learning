<?php

/**
 * This file defines the UpdateCourseCommand DTO (Data Transfer Object),
 * which encapsulates all necessary data for updating an existing course.
 * It contains both required and optional course properties for modification.
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
 * Represents the command to update an existing course in the MS-Learning platform.
 * Contains all mutable course properties including optional fields for promotions.
 *
 * @category Commands
 * @package  App\Command\Course
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 * @project  MS-Learning (PFE Project)
 */
class UpdateCourseCommand
{
    /**
     * Initializes a new instance of UpdateCourseCommand with course update data.
     *
     * @param int         $id          The ID of the course to update
     * @param string      $title       The updated title of the course
     * @param string      $description The updated description of the course
     * @param string      $duration    The updated duration (e.g., "3 hours")
     * @param string      $level       The updated difficulty level
     * @param float|null  $price       The updated price (optional)
     * @param string|null $image       The updated image path/URL (optional)
     * @param string|null $category    The updated category (optional)
     * @param bool|null   $promotion   Whether the course is on promotion (optional)
     * @param float|null  $discount    The updated discount percentage (optional)
     */
    public function __construct(
        public int $id,
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
