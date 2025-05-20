<?php

namespace App\Handler\Course;

use App\Query\Course\GetCourseWithModulesAndLessonsQuery;
use App\Repository\CoursesRepository;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
class GetCourseWithModulesAndLessonsQueryHandler
{
    public function __construct(
        private CoursesRepository $courseRepository
    ) {
    }

    public function __invoke(GetCourseWithModulesAndLessonsQuery $query): array
    {
        $course = $this->courseRepository->find($query->courseId);

        if (! $course) {
            throw new \Exception('Course not found');
        }

        $modules = [];

        foreach ($course->getModules() as $module) {
            $lessons = [];

            foreach ($module->getLessons() as $lesson) {
                $lessons[] = [
                    'id' => $lesson->getId(),
                    'title' => $lesson->getTitle(),
                    'type' => $lesson->getType(),
                    'livestarttime' => $lesson->getLiveStartTime(),
                    'video_url' => $lesson->getVideoUrl(),
                    'content' => $lesson->getContent(),
                    'duration' => $lesson->getDuration(),
                    'ressources' => $lesson->getRessources(),
                ];
            }

            $modules[] = [
                'id' => $module->getId(),
                'title' => $module->getTitle(),
                'lessons' => $lessons,
            ];
        }

        return [
            'id' => $course->getId(),
            // 'user' => $course->getEnrollments()->first()?->getUsername(),
            'title' => $course->getTitle(),
            'image' => $course->getImage(),
            'modules' => $modules,
        ];
    }
}
