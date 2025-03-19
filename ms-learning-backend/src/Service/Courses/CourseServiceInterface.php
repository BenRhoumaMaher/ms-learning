<?php

namespace App\Service\Course;

use App\Entity\Courses;

interface CourseServiceInterface
{
    public function getAllCourses(): array;

    public function getCourseById(int $id): ?Courses;

    public function createCourse(array $data): Courses;

    public function updateCourse(Courses $course, array $data): Courses;

    public function deleteCourse(Courses $course): void;
}
