<?php

namespace App\Handler\Course;

use DateTime;
use DateTimeImmutable;
use App\Entity\StudentCourse;
use App\Repository\UserRepository;
use App\Repository\CourseRepository;
use App\Repository\CoursesRepository;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\StudentCourseRepository;
use App\Command\Course\EnrollInCourseCommand;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;
use Symfony\Component\Messenger\Handler\MessageHandlerInterface;

#[AsMessageHandler]
class EnrollInCourseHandler
{
    public function __construct(
        private EntityManagerInterface $em,
        private UserRepository $userRepository,
        private CoursesRepository $courseRepository,
        private StudentCourseRepository $studentCourseRepository
    ) {
    }

    public function __invoke(EnrollInCourseCommand $command)
    {
        $user = $this->userRepository->find($command->userId);
        $course = $this->courseRepository->find($command->courseId);

        if (!$user || !$course) {
            throw new \Exception('User or Course not found.');
        }

        $existing = $this->studentCourseRepository->findOneBy(
            [
            'user' => $user,
            'curse' => $course,
            ]
        );

        if ($existing) {
            throw new \Exception('Already enrolled in this course.');
        }

        $enrollment = new StudentCourse();
        $enrollment->setUser($user);
        $enrollment->setCurse($course);
        $enrollment->setStatus('enrolled');
        $enrollment->setProgress('0.00');
        $enrollment->setStartDate(new DateTime('now'));
        $enrollment->setEndDate(new DateTime('now'));
        $enrollment->setCreatedAt(new DateTimeImmutable());

        $this->em->persist($enrollment);
        $this->em->flush();

        return $enrollment->getId();
    }
}
