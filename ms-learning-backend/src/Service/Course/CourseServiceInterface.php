<?php

namespace App\Service\Course;

use App\Entity\Courses;

interface CourseServiceInterface
{
    /**
     * @return array<int, array{
     *     id: int,
     *     title: string,
     *     description: string|null,
     *     price: float|null,
     *     duration: int|null,
     *     level: string|null,
     *     category: array{name: string|null}|null,
     *     image: string|null,
     *     instructor?: array{
     *         id: int,
     *         name: string,
     *         expertise: string|null,
     *         x: string|null,
     *         linkedin: string|null,
     *         instagram: string|null,
     *         facebook: string|null,
     *         picture: string|null
     *     },
     *     modules: array<int, array{
     *         id: int,
     *         title: string,
     *         lessons: array<int, array{
     *             id: int,
     *             title: string,
     *             type: string,
     *             livestarttime: ?\DateTimeInterface,
     *             video_url: string|null,
     *             content: string|null,
     *             duration: int|null,
     *             ressources: string|null
     *         }>
     *     }>
     * }>
     */
    public function getAllCourses(): array;

    public function getCourseById(int $id): ?Courses;

    /**
     * @param array{
     *     title: string,
     *     description: string,
     *     duration: int,
     *     level: string,
     *     price?: float,
     *     image?: string,
     *     category?: mixed,
     *     promotion?: mixed,
     *     discount?: mixed
     * } $data
     */
    public function createCourse(array $data): Courses;

    /**
     * @param array{
     *     title: string,
     *     description: string,
     *     duration: int,
     *     level: string,
     *     price?: float,
     *     image?: string,
     *     category?: mixed,
     *     promotion?: mixed,
     *     discount?: mixed
     * } $data
     */
    public function updateCourse(Courses $course, array $data): Courses;

    public function deleteCourse(Courses $course): void;
}
