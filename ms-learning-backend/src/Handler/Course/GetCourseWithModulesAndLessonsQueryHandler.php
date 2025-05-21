<?php

/**
 * This file defines the handler for retrieving complete course structures
 * including modules and lessons in the MS-LEARNING platform.
 *
 * @category Handlers
 * @package  App\Handler\Course
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 * @project  MS-Learning (PFE Project)
 */

namespace App\Handler\Course;

use App\Query\Course\GetCourseWithModulesAndLessonsQuery;
use App\Repository\CoursesRepository;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

/**
 * Handles queries for complete course structures including:
 * - Course details
 * - All associated modules
 * - All lessons within each module
 * - Lesson-specific data including live session info and resources
 *
 * @category Handlers
 * @package  App\Handler\Course
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 */
#[AsMessageHandler]
class GetCourseWithModulesAndLessonsQueryHandler
{
    /**
     * @param CoursesRepository $courseRepository Repository for course entities
     */
    public function __construct(
        private CoursesRepository $courseRepository
    ) {
    }

    /**
     * Handle course structure query
     *
     * Retrieves and formats a complete course structure including:
     * - Basic course information (id, title, image)
     * - All modules with their lessons
     * - Detailed lesson information including:
     *   - Standard lesson data (title, content, duration)
     *   - Type-specific data (video URLs for recorded, timing for live sessions)
     *   - Associated resources
     *
     * @param GetCourseWithModulesAndLessonsQuery $query Contains:
     *                                                   - courseId: string (required) ID of course to retrieve
     *
     * @return array Structured course data including nested modules and lessons
     *
     * @throws \Exception When the specified course is not found
     */
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
            'title' => $course->getTitle(),
            'image' => $course->getImage(),
            'modules' => $modules,
        ];
    }
}
