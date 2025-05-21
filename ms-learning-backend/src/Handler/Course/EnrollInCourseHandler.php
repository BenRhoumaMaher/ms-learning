<?php

/**
 * This file defines the EnrollInCourseHandler which handles student enrollments
 * in courses within the MS-LEARNING platform.
 *
 * @category Handlers
 * @package  App\Handler\Course
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 * @project  MS-Learning (PFE Project)
 */

namespace App\Handler\Course;

use App\Command\Course\EnrollInCourseCommand;
use App\Entity\StudentCourse;
use App\Repository\CoursesRepository;
use App\Repository\StudentCourseRepository;
use App\Repository\UserRepository;
use DateTime;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

/**
 * Handles the enrollment of students in courses by creating StudentCourse entities.
 * Validates that both user and course exist and that the user isn't already enrolled.
 * Sets initial enrollment status, progress, and dates.
 *
 * @category Handlers
 * @package  App\Handler\Course
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 */
#[AsMessageHandler]
class EnrollInCourseHandler
{
    /**
     * @param EntityManagerInterface  $em                      Doctrine entity manager
     * @param UserRepository          $userRepository          Repository for user entities
     * @param CoursesRepository       $courseRepository        Repository for course entities
     * @param StudentCourseRepository $studentCourseRepository Repository for enrollment records
     */
    public function __construct(
        private EntityManagerInterface $em,
        private UserRepository $userRepository,
        private CoursesRepository $courseRepository,
        private StudentCourseRepository $studentCourseRepository
    ) {
    }

    /**
     * Handle course enrollment command
     *
     * Creates a new enrollment record for a student in a course.
     * Validates existence of both user and course.
     * Checks for existing enrollment to prevent duplicates.
     * Sets initial enrollment data including dates and status.
     *
     * @param EnrollInCourseCommand $command Contains enrollment data:
     *                                       - userId: string (required) ID of user to enroll
     *                                       - courseId: string (required) ID of course to enroll in
     *
     * @return string ID of the created enrollment record
     *
     * @throws \Exception When user/course not found or already enrolled
     */
    public function __invoke(EnrollInCourseCommand $command)
    {
        $user = $this->userRepository->find($command->userId);
        $course = $this->courseRepository->find($command->courseId);

        if (! $user || ! $course) {
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
