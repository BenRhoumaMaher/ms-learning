<?php

namespace App\Command\Course;

class CreateCourseCommand
{
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
