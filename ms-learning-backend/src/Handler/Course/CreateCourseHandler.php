<?php

namespace App\Handler\Course;

use App\Command\Course\CreateCourseCommand;
use App\Entity\Courses;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
class CreateCourseHandler
{
    public function __construct(
        private EntityManagerInterface $entityManager
    ) {
    }

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
