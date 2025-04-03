<?php

namespace App\Handler\User;

use App\Repository\UserRepository;
use App\Repository\LessonRepository;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;
use Symfony\Component\Messenger\Handler\MessageHandlerInterface;
use App\Query\Course\GetCoursesModulesLessonsWithoutResourcesQuery;

#[AsMessageHandler]

class GetCoursesModulesLessonsWithoutResourcesQueryHandler
{
    public function __construct(
        private UserRepository $userRepository,
        private LessonRepository $lessonRepository
    ) {
    }

    public function __invoke(GetCoursesModulesLessonsWithoutResourcesQuery $query): array
    {
        $user = $this->userRepository->find($query->id);

        if (!$user) {
            throw new \Exception('User not found');
        }

        $lessonsWithoutResources = $this->getLessonsWithoutResources($user);

        return $this->formatCoursesWithLessonsWithoutResources($user, $lessonsWithoutResources);
    }

    private function getLessonsWithoutResources($user): array
    {
        $lessons = $this->lessonRepository->findUserLessonsNoRessources(
            $user->getId()
        );

        return array_map(
            fn ($lesson) => $lesson->getId(),
            $lessons
        );
    }

    private function formatCoursesWithLessonsWithoutResources(
        $user,
        array $lessonIdsWithoutResources
    ): array {
        $result = [];

        foreach ($user->getCourses() as $course) {
            $courseData = [
                'id' => $course->getId(),
                'title' => $course->getTitle(),
                'modules' => []
            ];

            foreach ($course->getModules() as $module) {
                $moduleData = [
                    'id' => $module->getId(),
                    'title' => $module->getTitle(),
                    'lessons' => []
                ];

                foreach ($module->getLessons() as $lesson) {
                    if (in_array($lesson->getId(), $lessonIdsWithoutResources)) {
                        $moduleData['lessons'][] = [
                            'id' => $lesson->getId(),
                            'title' => $lesson->getTitle(),
                        ];
                    }
                }

                if (!empty($moduleData['lessons'])) {
                    $courseData['modules'][] = $moduleData;
                }
            }

            if (!empty($courseData['modules'])) {
                $result[] = $courseData;
            }
        }

        return $result;
    }
}
