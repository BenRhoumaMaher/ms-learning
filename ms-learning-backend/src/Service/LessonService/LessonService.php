<?php

namespace App\Service\LessonService;

use DateTime;
use App\Entity\User;
use App\Entity\Lesson;
use DateTimeImmutable;
use App\Repository\UserRepository;
use App\Repository\LessonRepository;
use App\Repository\ModuleRepository;
use App\Repository\CoursesRepository;
use App\Service\Course\CourseService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class LessonService
{
    public function __construct(
        private LessonRepository $lessonRepository,
        private EntityManagerInterface $entityManager,
        private ValidatorInterface $validator,
        private UserRepository $userRepository,
        private CoursesRepository $coursesRepository,
        private ModuleRepository $moduleRepository,
        private CourseService $courseService
    ) {
    }
    public function getLessonsWithoutResources(User $user): array
    {
        $lessons = $this->lessonRepository->findUserLessonsNoRessources(
            $user->getId()
        );

        return array_map(
            fn ($lesson) => $lesson->getId(),
            $lessons
        );
    }

    public function updateLessonData(
        Lesson $lesson,
        array $data
    ): void {
        if (isset($data['title'])) {
            $lesson->setTitle($data['title']);
        }
        if (isset($data['content'])) {
            $lesson->setContent($data['content']);
        }
        if (isset($data['liveStartTime'])) {
            $lesson->setLiveStartTime(new DateTime($data['liveStartTime']));
        }
        if (isset($data['liveEndTime'])) {
            $lesson->setLiveEndTime(new DateTime($data['liveEndTime']));
        }
        if (isset($data['position'])) {
            $lesson->setPosition($data['position']);
        }
        if (isset($data['liveMeetingLink'])) {
            $lesson->setLiveMeetingLink($data['liveMeetingLink']);
        }

        if (isset($data['liveStartTime'], $data['liveEndTime'])) {
            $lesson->setDuration(
                (new DateTime($data['liveEndTime']))->getTimestamp() -
                (new DateTime($data['liveStartTime']))->getTimestamp()
            );
        }

        $lesson->setUpdatedAt(new DateTime());
    }

    public function validateLesson(Lesson $lesson): array
    {
        $errors = $this->validator->validate($lesson);
        if (count($errors) === 0) {
            return [];
        }

        $errorsArray = [];
        foreach ($errors as $error) {
            $errorsArray[$error->getPropertyPath()] = $error->getMessage();
        }

        return $errorsArray;
    }

    public function validateLessonData(array $data): ?string
    {
        $requiredFields = [
            'course_id', 'module_id', 'title',
             'content', 'position', 'type', 'user_id'];

        if ($data['type'] === 'live') {
            $requiredFields = array_merge(
                $requiredFields, 
                ['liveStartTime', 'liveEndTime', 'liveMeetingLink']
            );
        } else {
            $requiredFields[] = 'videoUrl';
        }

        foreach ($requiredFields as $field) {
            if (!isset($data[$field])) {
                return "Missing required field: $field";
            }
        }

        return null;
    }

    public function getEntitiesForLesson(array $data): array
    {
        $user = $this->userRepository->find($data['user_id']);
        $course = $this->coursesRepository->find($data['course_id']);
        $module = $this->moduleRepository->find($data['module_id']);

        if (!$user || !$course || !$module) {
            return ['error' => 'Invalid user, course, or module'];
        }

        return compact('user', 'course', 'module');
    }

    public function createLessonEntity(array $data, array $entities): Lesson
    {
        $lesson = new Lesson();
        $lesson->setTitle($data['title']);
        $lesson->setContent($data['content']);
        $lesson->setType($data['type']);
        $lesson->setPosition($data['position']);
        $lesson->setCreatedAt(new DateTimeImmutable());
        $lesson->setUser($entities['user']);
        $lesson->setCourse($entities['course']);
        $lesson->setModule($entities['module']);

        if ($data['type'] === 'live') {
            $lesson->setLiveStartTime(new DateTime($data['liveStartTime']));
            $lesson->setLiveEndTime(new DateTime($data['liveEndTime']));
            $lesson->setLiveMeetingLink($data['liveMeetingLink']);

            $duration = (new DateTime($data['liveEndTime']))->getTimestamp() -
                        (new DateTime($data['liveStartTime']))->getTimestamp();
            $lesson->setDuration($duration);
        } else {
            $lesson->setVideoUrl($data['videoUrl']);
            $lesson->setDuration(0);
        }

        return $lesson;
    }

    public function handleLessonResources(Lesson $lesson, UploadedFile $file): void
    {
        $resourcePath = $this->courseService->uploadFile($file);
        $lesson->setRessources($resourcePath);
    }

    public function saveTheLesson(Lesson $lesson): void
    {
        $this->entityManager->persist($lesson);
        $this->entityManager->flush();
    }

    public function saveLesson(Lesson $lesson): void
    {
        $this->entityManager->flush();
    }

    public function getLessonById(int $id): ?Lesson
    {
        return $this->lessonRepository->find($id);
    }

    public function convertLessonToRegistered(Lesson $lesson, string $videoUrl): void
    {
        $lesson->setType('registered');
        $lesson->setVideoUrl($videoUrl);
        $lesson->setLiveStartTime(null);
        $lesson->setLiveEndTime(null);
        $lesson->setLiveMeetingLink(null);
    }

}
