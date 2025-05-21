<?php

namespace App\Handler\User;

use App\Query\Course\GetCoursesModulesLessonsWithoutResourcesQuery;
use App\Repository\LessonRepository;
use App\Repository\UserRepository;
use ECSPrefix202505\array;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]

class GetCoursesModulesLessonsWithoutResourcesQueryHandler
{
    /**
     * @param UserRepository   $userRepository   Repository for user entities
     * @param LessonRepository $lessonRepository Repository for lesson entities
     */
    public function __construct(
        private UserRepository $userRepository,
        private LessonRepository $lessonRepository
    ) {
    }

    /**
     * Handle the GetCoursesModulesLessonsWithoutResourcesQuery
     *
     * Retrieves a structured list of courses and their modules containing lessons
     * that have no associated resources.
     *
     * @param GetCoursesModulesLessonsWithoutResourcesQuery $query Contains:
     *                                                             - id: int (required) User ID
     *
     * @return array Structured data with courses, modules, and lessons without resources
     *
     * @throws \Exception When user is not found
     */
    public function __invoke(GetCoursesModulesLessonsWithoutResourcesQuery $query): array
    {
        $user = $this->userRepository->find($query->id);

        if (! $user) {
            throw new \Exception('User not found');
        }

        $lessonsWithoutResources = $this->getLessonsWithoutResources($user);

        return $this->formatCoursesWithLessonsWithoutResources($user, $lessonsWithoutResources);
    }

    /**
     * Get lessons without resources for a given user
     *
     * Fetches all lessons associated with the user that currently have no resources.
     *
     * @param mixed $user User entity
     *
     * @return array<int> List of lesson IDs without resources
     */
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

    /**
     * Format the user's courses, modules, and lessons without resources
     *
     * Constructs a nested array of courses, each with modules and their respective lessons
     * that lack resources, based on provided lesson IDs.
     *
     * @param mixed      $user                      User entity
     * @param array<int> $lessonIdsWithoutResources List of lesson IDs without resources
     *
     * @return array Nested array of structured course/module/lesson data
     */
    private function formatCoursesWithLessonsWithoutResources(
        $user,
        array $lessonIdsWithoutResources
    ): array {
        $result = [];

        foreach ($user->getCourses() as $course) {
            $courseData = [
                'id' => $course->getId(),
                'title' => $course->getTitle(),
                'modules' => [],
            ];

            foreach ($course->getModules() as $module) {
                $moduleData = [
                    'id' => $module->getId(),
                    'title' => $module->getTitle(),
                    'lessons' => [],
                ];

                foreach ($module->getLessons() as $lesson) {
                    if (in_array($lesson->getId(), $lessonIdsWithoutResources)) {
                        $moduleData['lessons'][] = [
                            'id' => $lesson->getId(),
                            'title' => $lesson->getTitle(),
                        ];
                    }
                }

                if (! empty($moduleData['lessons'])) {
                    $courseData['modules'][] = $moduleData;
                }
            }

            if (! empty($courseData['modules'])) {
                $result[] = $courseData;
            }
        }

        return $result;
    }
}
