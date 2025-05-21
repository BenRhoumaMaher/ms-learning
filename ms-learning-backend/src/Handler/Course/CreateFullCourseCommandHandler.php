<?php

/**
 * This file defines the CreateFullCourseCommandHandler which handles the creation
 * of complete course structures including modules and lessons in the MS-LEARNING platform.
 *
 * @category Handlers
 * @package  App\Handler\Course
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 * @project  MS-Learning (PFE Project)
 */

namespace App\Handler\Course;

use App\Command\Course\CreateFullCourseCommand;
use App\Entity\Lesson;
use App\Entity\Module;
use App\Repository\CoursesRepository;
use App\Repository\UserRepository;
use App\Service\Course\CourseService;
use DateTime;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

/**
 * Handles the CreateFullCourseCommand to create complete course structures including:
 * - The base course (must exist)
 * - Multiple modules with their positions
 * - Lessons within each module with various types (registered/live)
 * - Associated resources and metadata
 *
 * @category Handlers
 * @package  App\Handler\Course
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 */
#[AsMessageHandler]
class CreateFullCourseCommandHandler
{
    /**
     * @param EntityManagerInterface $entityManager    Doctrine entity manager
     * @param UserRepository         $userRepository   User entity repository
     * @param CoursesRepository      $courseRepository Course entity repository
     * @param CourseService          $courseService    Course-related services
     */
    public function __construct(
        private EntityManagerInterface $entityManager,
        private UserRepository $userRepository,
        private CoursesRepository $courseRepository,
        private CourseService $courseService
    ) {
    }

    /**
     * Handle full course creation command
     *
     * Creates and persists a complete course structure including:
     * - Modules with titles and positions
     * - Lessons with various types (registered/live)
     * - Lesson resources and metadata
     * - Live lesson specific data (when applicable)
     *
     * @param CreateFullCourseCommand $command Contains full course creation data:
     *                                         - userId: string (required)
     *                                         - courseId: string (required)
     *                                         - modules: array (required) Array of module data
     *                                         - files: array (optional) Uploaded files structure
     *
     * @return array Result of the operation with status and message
     *
     * @throws \Exception When user or course not found
     */
    public function __invoke(CreateFullCourseCommand $command): array
    {
        $user = $this->userRepository->find($command->userId);
        if (! $user) {
            throw new \Exception('User not found');
        }

        $course = $this->courseRepository->find($command->courseId);
        if (! $course) {
            throw new \Exception('Course not found');
        }

        foreach ($command->modules as $moduleIndex => $moduleData) {
            if (! isset($moduleData['title'], $moduleData['position'])) {
                continue;
            }

            $module = new Module();
            $module->setTitle($moduleData['title']);
            $module->setPosition($moduleData['position']);
            $module->setCourse($course);
            $module->setUser($user);
            $module->setCreatedAt(new DateTimeImmutable());

            $this->entityManager->persist($module);

            foreach ($moduleData['lessons'] as $lessonIndex => $lessonData) {
                if (! isset($lessonData['title'], $lessonData['content'])) {
                    continue;
                }

                $lesson = new Lesson();
                $lesson->setTitle($lessonData['title']);
                $lesson->setContent($lessonData['content']);
                $lesson->setDuration($lessonData['duration']);
                $lesson->setPosition($lessonData['position']);
                $lesson->setType($lessonData['type']);
                $lesson->setModule($module);
                $lesson->setUser($user);
                $lesson->setCreatedAt(new DateTimeImmutable());

                if ($lessonData['type'] === 'registered' && isset($lessonData['video_url'])) {
                    $lesson->setVideoUrl($lessonData['video_url']);
                }
                if ($lessonData['type'] === 'live') {
                    if (isset($lessonData['livestarttime'])) {
                        $lesson->setLiveStartTime(
                            new DateTime(
                                $lessonData['livestarttime']
                            )
                        );
                    }
                    if (isset($lessonData['liveendtime'])) {
                        $lesson->setLiveEndTime(new DateTime($lessonData['liveendtime']));
                    }
                    if (isset($lessonData['liveMeetingLink'])) {
                        $lesson->setLiveMeetingLink($lessonData['liveMeetingLink']);
                    }
                }

                if (isset($command->files['modules'][$moduleIndex]['lessons'][$lessonIndex]['resource'])) {
                    $file = $command->files['modules'][$moduleIndex]['lessons'][$lessonIndex]['resource'];
                    $fileUrl = $this->courseService->uploadFile($file);
                    $lesson->setRessources($fileUrl);
                }

                $this->entityManager->persist($lesson);
            }
        }

        $this->entityManager->flush();

        return [
            'message' => 'Course created successfully',
            'status' => 201,
        ];
    }
}
