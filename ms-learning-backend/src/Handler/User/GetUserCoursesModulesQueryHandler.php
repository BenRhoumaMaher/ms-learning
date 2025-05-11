<?php

namespace App\Handler\User;

use App\Repository\UserRepository;
use App\Query\User\GetUserCoursesModulesQuery;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;
use App\Service\ElasticSearch\VideoEngagementAnalyticsService;

#[AsMessageHandler]
class GetUserCoursesModulesQueryHandler
{
    public function __construct(
        private UserRepository $userRepository,
        private VideoEngagementAnalyticsService $videoAnalyticsService
    ) {
    }

    public function __invoke(GetUserCoursesModulesQuery $query): array
    {
        $user = $this->userRepository->find($query->id);

        if (!$user) {
            throw new \Exception('User not found');
        }

        return $this->formatUserCourses($user);
    }

    private function formatUserCourses($user): array
    {
        $courses = [];

        foreach ($user->getCourses() as $course) {
            $modules = [];

            foreach ($course->getModules() as $module) {
                $lessons = [];

                foreach ($module->getLessons() as $lesson) {
                    $lessonData = [
                        'id' => $lesson->getId(),
                        'title' => $lesson->getTitle(),
                        'type' => $lesson->getType(),
                        'video_url' => $lesson->getVideoUrl(),
                        'duration' => $lesson->getDuration(),
                    ];

                    if ($lesson->getType() === 'registered') {
                        $lessonAnalytics = $this->videoAnalyticsService
                            ->getLessonAnalytics($lesson->getId());
                        $lessonData['analytics'] = [
                            'totalPauses' => $lessonAnalytics['totalPauses'] ?? 0,
                            'totalReplays' => $lessonAnalytics['totalReplays'] ?? 0,
                        ];
                    }

                    $lessons[] = $lessonData;
                }

                $modules[] = [
                    'id' => $module->getId(),
                    'title' => $module->getTitle(),
                    'position' => $module->getPosition(),
                    'course' => $module->getCourse()->getTitle(),
                    'lessons' => $lessons,
                ];
            }

            $courses[] = [
                'id' => $course->getId(),
                'title' => $course->getTitle(),
                'description' => $course->getDescription(),
                'price' => $course->getPrice(),
                'duration' => $course->getDuration(),
                'image' => $course->getImage(),
                'category' => $course->getCategory()->getName(),
                'modules' => $modules,
            ];
        }

        $videoAnalytics = $this->videoAnalyticsService
            ->getInstructorVideoAnalytics($user->getId());

        return [
            'username' => $user->getFirstname() . ' ' . $user->getLastName(),
            'courses' => $courses,
            'videoAnalytics' => $videoAnalytics
        ];

    }
}
