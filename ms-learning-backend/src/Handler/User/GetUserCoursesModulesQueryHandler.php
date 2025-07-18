<?php

namespace App\Handler\User;

use App\Entity\User;
use App\Query\Course\GetUserCoursesModulesQuery;
use App\Repository\UserRepository;
use App\Service\ElasticSearch\VideoEngagementAnalyticsService;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
class GetUserCoursesModulesQueryHandler
{
    /**
     * @param UserRepository                  $userRepository        Repository for user entities
     * @param VideoEngagementAnalyticsService $videoAnalyticsService Service for retrieving video analytics data
     */
    public function __construct(
        private UserRepository $userRepository,
        private VideoEngagementAnalyticsService $videoAnalyticsService
    ) {
    }

    /**
     * Handle the GetUserCoursesModulesQuery
     *
     * Retrieves the user's courses, modules, and lessons, including video analytics,
     * structured into a nested array suitable for API output.
     *
     * @param GetUserCoursesModulesQuery $query Contains:
     *                                          - id: int (required) User ID
     *
     * @return array{
     *     username: string,
     *     courses: array<int, array{
     *         id: int,
     *         title: string,
     *         description: string,
     *         price: float,
     *         duration: int,
     *         image: string,
     *         category: string,
     *         modules: array<int, array{
     *             id: int,
     *             title: string,
     *             position: int,
     *             course: string,
     *             lessons: array<int, array{
     *                 id: int,
     *                 title: string,
     *                 type: string,
     *                 video_url: ?string,
     *                 duration: ?int,
     *                 analytics?: array{totalPauses: int, totalReplays: int}
     *             }>
     *         }>
     *     }>,
     *     videoAnalytics: array<string, mixed>
     * }
     *
     * @throws \Exception When user is not found
     */
    public function __invoke(GetUserCoursesModulesQuery $query): array
    {
        $user = $this->userRepository->find($query->id);

        if (! $user) {
            throw new \Exception('User not found');
        }

        return $this->formatUserCourses($user);
    }

    /**
     * Format user courses with modules, lessons, and analytics
     *
     * Builds a nested data structure representing the user's courses, each with
     * related modules and lessons, including video analytics for registered lessons.
     *
     * @param User $user The user whose course/module/lesson structure will be formatted
     *
     * @return array{
     *     username: string,
     *     courses: array<int, array{
     *         id: int,
     *         title: string,
     *         description: string,
     *         price: float,
     *         duration: int,
     *         image: string,
     *         category: string,
     *         modules: array<int, array{
     *             id: int,
     *             title: string,
     *             position: int,
     *             course: string,
     *             lessons: array<int, array{
     *                 id: int,
     *                 title: string,
     *                 type: string,
     *                 video_url: ?string,
     *                 duration: ?int,
     *                 analytics?: array{totalPauses: int, totalReplays: int}
     *             }>
     *         }>
     *     }>,
     *     videoAnalytics: array<string, mixed>
     * }
     */
    private function formatUserCourses(User $user): array
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
            'videoAnalytics' => $videoAnalytics,
        ];

    }
}
