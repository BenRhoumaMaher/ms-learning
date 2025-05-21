<?php

/**
 * This file defines the LessonController which handles all lesson-related operations
 * including CRUD operations, live session management,
 * and engagement tracking for the MS-LEARNING platform.
 *
 * @category Controllers
 * @package  App\Controller\Lesson
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 * @project  MS-Learning (PFE Project)
 */

namespace App\Controller\Lesson;

use App\Command\Lesson\AddResourceToLessonCommand;
use App\Command\Lesson\ConvertLessonToRegisteredCommand;
use App\Command\Lesson\CreateLessonCommand;
use App\Command\Lesson\DeleteLessonCommand;
use App\Command\Lesson\EditLessonCommand;
use App\Query\Lesson\GetLatestUserLiveLessonQuery;
use App\Query\Lesson\GetLiveLessonInfoQuery;
use App\Query\Lesson\GetUserLiveSessionsQuery;
use App\Repository\LessonRepository;
use App\Service\CommandBusService\CommandBusService;
use App\Service\QueryBusService\QueryBusService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

/**
 * Handles all lesson operations including:
 * - Live lesson management
 * - Lesson CRUD operations
 * - Resource management
 * - Engagement tracking
 *
 * @category Controllers
 * @package  App\Controller\Lesson
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 */
final class LessonController extends AbstractController
{
    /**
     * @param QueryBusService        $queryBusService   Query bus service
     * @param CommandBusService      $commandBusService Command bus service
     * @param EntityManagerInterface $entityManager     Doctrine entity manager
     */
    public function __construct(
        private readonly QueryBusService $queryBusService,
        private readonly CommandBusService $commandBusService,
        private readonly EntityManagerInterface $entityManager
    ) {
    }

    /**
     * Get user's latest live lesson
     *
     * @param int $id User ID
     *
     * @return JsonResponse Latest live lesson data or error message
     */
    public function getLatestUserLiveLesson(int $id): JsonResponse
    {
        try {
            $query = new GetLatestUserLiveLessonQuery($id);
            $lesson = $this->queryBusService->handle($query);

            return $this->json(
                $lesson,
                200,
                [],
                [
                    'groups' => 'lesson:read',
                ]
            );
        } catch (\Exception $e) {
            return $this->json(
                [
                    'error' => $e->getMessage(),
                ],
                404
            );
        }
    }

    /**
     * Get user's live sessions
     *
     * @param int $id User ID
     *
     * @return JsonResponse List of user's live sessions or error message
     */
    public function getUserLiveSessions(int $id): JsonResponse
    {
        try {
            $query = new GetUserLiveSessionsQuery($id);
            $sessions = $this->queryBusService->handle($query);

            return $this->json($sessions);
        } catch (\Exception $e) {
            return $this->json(
                [
                    'error' => $e->getMessage(),
                ],
                400
            );
        }
    }

    /**
     * Get latest live lessons
     *
     * @param LessonRepository $lessonRepository Lessons repository
     *
     * @return JsonResponse List of recent live lessons
     */
    public function latestLiveLessons(
        LessonRepository $lessonRepository
    ): JsonResponse {
        $lessons = $lessonRepository->findLatestLiveLessons();

        return $this->json(
            $lessons,
            200,
            [],
            [
                'groups' => 'lesson:read',
            ]
        );
    }

    /**
     * Get live lesson information
     *
     * @param int $id Lesson ID
     *
     * @return JsonResponse Detailed live lesson information or error message
     */
    public function getLiveLessonInfo(int $id): JsonResponse
    {
        try {
            $query = new GetLiveLessonInfoQuery($id);
            $lesson = $this->queryBusService->handle($query);

            return $this->json(
                $lesson,
                200,
                [],
                [
                    'groups' => 'lesson:read',
                ]
            );
        } catch (\Exception $e) {
            return $this->json(
                [
                    'error' => $e->getMessage(),
                ],
                404
            );
        }
    }

    /**
     * Edit lesson details
     *
     * @param int     $id      Lesson ID
     * @param Request $request HTTP request containing updated lesson data
     *
     * @return JsonResponse Updated lesson data or validation errors
     */
    public function editLesson(int $id, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        try {
            $command = new EditLessonCommand($id, $data);
            $result = $this->commandBusService->handle($command);

            if (isset($result['errors'])) {
                return $this->json(
                    [
                        'errors' => $result['errors'],
                    ],
                    400
                );
            }

            return $this->json(
                $result,
                200,
                [],
                [
                    'groups' => 'lesson:read',
                ]
            );
        } catch (\Exception $e) {
            return $this->json(
                [
                    'error' => $e->getMessage(),
                ],
                400
            );
        }
    }

    /**
     * Convert live lesson to registered lesson
     *
     * @param int     $id      Lesson ID
     * @param Request $request HTTP request containing video URL
     *
     * @return JsonResponse Conversion result or error message
     */
    public function convertToRegistered(int $id, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (! isset($data['videoUrl'])) {
            return $this->json(
                [
                    'error' => 'Video URL is required',
                ],
                400
            );
        }

        try {
            $command = new ConvertLessonToRegisteredCommand($id, $data['videoUrl']);
            $result = $this->commandBusService->handle($command);

            if (isset($result['errors'])) {
                return $this->json(
                    [
                        'errors' => $result['errors'],
                    ],
                    400
                );
            }

            return $this->json($result, 200);
        } catch (\Exception $e) {
            return $this->json(
                [
                    'error' => $e->getMessage(),
                ],
                400
            );
        }
    }

    /**
     * Add resource to lesson
     *
     * @param int     $id      Lesson ID
     * @param Request $request HTTP request containing resource file
     *
     * @return JsonResponse Operation result or error message
     */
    public function addResourceToLesson(int $id, Request $request): JsonResponse
    {
        $resourceFile = $request->files->get('resource');

        if (! $resourceFile) {
            return $this->json(
                [
                    'error' => 'No resource file provided',
                ],
                400
            );
        }

        try {
            $command = new AddResourceToLessonCommand($id, $resourceFile);
            $result = $this->commandBusService->handle($command);

            return $this->json($result, 200);
        } catch (\Exception $e) {
            return $this->json(
                [
                    'error' => $e->getMessage(),
                ],
                500
            );
        }
    }

    /**
     * Create new lesson
     *
     * @param Request $request HTTP request containing lesson data and resources
     *
     * @return JsonResponse Created lesson data or validation errors
     */
    public function createLesson(Request $request): JsonResponse
    {
        $data = $request->request->all();
        $resourcesFile = $request->files->get('resources');

        try {
            $command = new CreateLessonCommand($data, $resourcesFile);
            $result = $this->commandBusService->handle($command);

            if (isset($result['error'])) {
                return $this->json(
                    [
                        'error' => $result['error'],
                    ],
                    400
                );
            }

            return $this->json($result, 201);
        } catch (\Exception $e) {
            return $this->json(
                [
                    'error' => $e->getMessage(),
                ],
                500
            );
        }
    }

    /**
     * Delete lesson
     *
     * @param int $id Lesson ID
     *
     * @return JsonResponse Deletion confirmation or error message
     */
    public function deleteLesson(int $id): JsonResponse
    {
        try {
            $command = new DeleteLessonCommand($id);
            $result = $this->commandBusService->handle($command);

            return $this->json($result, 200);
        } catch (\Exception $e) {
            return $this->json(
                [
                    'error' => $e->getMessage(),
                ],
                404
            );
        }
    }

    /**
     * Track lesson engagement metrics
     *
     * @param int              $id               Lesson ID
     * @param Request          $request          HTTP request containing
     *                                           engagement data
     * @param LessonRepository $lessonRepository Lessons repository
     *
     * @return JsonResponse Tracking confirmation or error message
     */
    public function trackLessonEngagement(
        int $id,
        Request $request,
        LessonRepository $lessonRepository
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);
        $lesson = $lessonRepository->find($id);

        if (! $lesson) {
            return $this->json(
                [
                    'error' => 'Lesson not found',
                ],
                404
            );
        }

        $lesson
            ->addWatchTime((int) ($data['watchTime'] ?? 0))
            ->incrementPauses()
            ->incrementReplays()
            ->updateAverageCompletion((float) ($data['completionPercentage'] ?? 0));

        $this->entityManager->persist($lesson);
        $this->entityManager->flush();

        return $this->json(
            [
                'status' => 'success',
            ]
        );
    }

    /**
     * Track lesson view
     *
     * @param int              $id               Lesson ID
     * @param LessonRepository $lessonRepository Lessons repository
     *
     * @return JsonResponse View tracking confirmation or error message
     */
    public function trackLessonView(
        int $id,
        LessonRepository $lessonRepository,
    ): JsonResponse {
        $lesson = $lessonRepository->find($id);

        if (! $lesson) {
            return $this->json(
                [
                    'error' => 'Lesson not found',
                ],
                404
            );
        }

        $lesson->incrementTotalViews();
        $this->entityManager->flush();

        return $this->json(
            [
                'status' => 'view tracked',
            ]
        );
    }
}
