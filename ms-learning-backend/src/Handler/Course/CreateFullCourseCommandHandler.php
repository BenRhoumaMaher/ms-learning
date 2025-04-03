<?php

namespace App\Handler\Course;

use DateTime;
use App\Entity\Lesson;
use App\Entity\Module;
use DateTimeImmutable;
use App\Repository\UserRepository;
use App\Repository\CoursesRepository;
use App\Service\Course\CourseService;
use Doctrine\ORM\EntityManagerInterface;
use App\Command\Course\CreateFullCourseCommand;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]

class CreateFullCourseCommandHandler
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private UserRepository $userRepository,
        private CoursesRepository $courseRepository,
        private CourseService $courseService
    ) {
    }

    public function __invoke(CreateFullCourseCommand $command): array
    {
        $user = $this->userRepository->find($command->userId);
        if (!$user) {
            throw new \Exception('User not found');
        }

        $course = $this->courseRepository->find($command->courseId);
        if (!$course) {
            throw new \Exception('Course not found');
        }

        foreach ($command->modules as $moduleIndex => $moduleData) {
            if (!isset($moduleData['title'], $moduleData['position'])) {
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
                if (!isset($lessonData['title'], $lessonData['content'])) {
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
                    $file = $command->files['modules']
                    [$moduleIndex]['lessons'][$lessonIndex]['resource'];
                    $fileUrl = $this->courseService->uploadFile($file);
                    $lesson->setRessources($fileUrl);
                }

                $this->entityManager->persist($lesson);
            }
        }

        $this->entityManager->flush();

        return ['message' => 'Course created successfully', 'status' => 201];
    }
}
