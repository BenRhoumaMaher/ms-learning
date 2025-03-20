<?php

namespace App\Service\Course;

use App\Entity\Courses;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class CourseService implements CourseServiceInterface
{
    public function __construct(
        private EntityManagerInterface $entityManager
    ) {
    }

    public function getAllCourses(): array
    {
        return $this->entityManager->getRepository(
            Courses::class
        )->findAll();
    }

    public function getCourseById(
        int $id
    ): ?Courses {
        $course = $this->entityManager->getRepository(
            Courses::class
        )->find($id);

        if (!$course) {
            throw new NotFoundHttpException("Course not found");
        }

        return $course;
    }

    public function createCourse(array $data): Courses
    {
        $course = new Courses();
        $course->setTitle($data['title']);
        $course->setDescription($data['description']);
        $course->setDuration($data['duration']);
        $course->setLevel($data['level']);
        $course->setCreatedAt(new \DateTimeImmutable());

        if (isset($data['price'])) {
            $course->setPrice($data['price']);
        }

        if (isset($data['image'])) {
            $course->setImage($data['image']);
        }

        if (isset($data['category'])) {
            $course->setCategory($data['category']); // Make sure to fetch the actual Category entity before setting
        }

        if (isset($data['promotion'])) {
            $course->setPromotion($data['promotion']);
        }

        if (isset($data['discount'])) {
            $course->setDiscount($data['discount']);
        }

        $this->entityManager->persist($course);
        $this->entityManager->flush();

        return $course;
    }

    public function updateCourse(Courses $course, array $data): Courses
    {
        $course->setTitle($data['title']);
        $course->setDescription($data['description']);
        $course->setDuration($data['duration']);
        $course->setLevel($data['level']);
        $course->setUpdatedAt(new \DateTime());

        if (isset($data['price'])) {
            $course->setPrice($data['price']);
        }

        if (isset($data['image'])) {
            $course->setImage($data['image']);
        }

        if (isset($data['category'])) {
            $course->setCategory($data['category']); // Ensure it's an actual Category entity
        }

        if (isset($data['promotion'])) {
            $course->setPromotion($data['promotion']);
        }

        if (isset($data['discount'])) {
            $course->setDiscount($data['discount']);
        }

        $this->entityManager->flush();

        return $course;
    }

    public function deleteCourse(Courses $course): void
    {
        $this->entityManager->remove($course);
        $this->entityManager->flush();
    }
}
