<?php

namespace App\Controller\Lesson;

use App\Repository\LessonRepository;
use App\Service\UserService\UserService;
use Doctrine\ORM\EntityManagerInterface;
use App\Command\Lesson\EditLessonCommand;
use App\Command\Lesson\CreateLessonCommand;
use App\Command\Lesson\DeleteLessonCommand;
use App\Query\Lesson\GetLiveLessonInfoQuery;
use Symfony\Component\HttpFoundation\Request;
use App\Query\Lesson\GetUserLiveSessionsQuery;
use App\Service\QueryBusService\QueryBusService;
use App\Command\Lesson\AddResourceToLessonCommand;
use App\Query\Lesson\GetLatestUserLiveLessonQuery;
use Symfony\Component\HttpFoundation\JsonResponse;
use App\Service\CommandBusService\CommandBusService;
use App\Command\Lesson\ConvertLessonToRegisteredCommand;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

final class LessonController extends AbstractController
{
    public function __construct(
        private UserService $userService,
        private QueryBusService $queryBusService,
        private CommandBusService $commandBusService,
        private EntityManagerInterface $entityManager
    ) {
    }

    public function getLatestUserLiveLesson(int $id): JsonResponse
    {
        try {
            $query = new GetLatestUserLiveLessonQuery($id);
            $lesson = $this->queryBusService->handle($query);

            return $this->json(
                $lesson,
                200,
                [],
                ['groups' => 'lesson:read']
            );
        } catch (\Exception $e) {
            return $this->json(['error' => $e->getMessage()], 404);
        }
    }

    public function getUserLiveSessions(int $id): JsonResponse
    {
        try {
            $query = new GetUserLiveSessionsQuery($id);
            $sessions = $this->queryBusService->handle($query);

            return $this->json($sessions);
        } catch (\Exception $e) {
            return $this->json(['error' => $e->getMessage()], 400);
        }
    }

    public function latestLiveLessons(
        LessonRepository $lessonRepository
    ): JsonResponse {
        $lessons = $lessonRepository->findLatestLiveLessons();

        return $this->json(
            $lessons,
            200,
            [],
            ['groups' => 'lesson:read']
        );
    }

    public function getLiveLessonInfo(int $id): JsonResponse
    {
        try {
            $query = new GetLiveLessonInfoQuery($id);
            $lesson = $this->queryBusService->handle($query);

            return $this->json(
                $lesson,
                200,
                [],
                ['groups' => 'lesson:read']
            );
        } catch (\Exception $e) {
            return $this->json(['error' => $e->getMessage()], 404);
        }
    }

    public function editLesson(int $id, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        try {
            $command = new EditLessonCommand($id, $data);
            $result = $this->commandBusService->handle($command);

            if (isset($result['errors'])) {
                return $this->json(
                    ['errors' => $result['errors']],
                    400
                );
            }

            return $this->json($result, 200, [], ['groups' => 'lesson:read']);
        } catch (\Exception $e) {
            return $this->json(['error' => $e->getMessage()], 400);
        }
    }

    public function convertToRegistered(int $id, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['videoUrl'])) {
            return $this->json(['error' => 'Video URL is required'], 400);
        }

        try {
            $command = new ConvertLessonToRegisteredCommand($id, $data['videoUrl']);
            $result = $this->commandBusService->handle($command);

            if (isset($result['errors'])) {
                return $this->json(['errors' => $result['errors']], 400);
            }

            return $this->json($result, 200);
        } catch (\Exception $e) {
            return $this->json(['error' => $e->getMessage()], 400);
        }
    }


    public function addResourceToLesson(int $id, Request $request): JsonResponse
    {
        $resourceFile = $request->files->get('resource');

        if (!$resourceFile) {
            return $this->json(['error' => 'No resource file provided'], 400);
        }

        try {
            $command = new AddResourceToLessonCommand($id, $resourceFile);
            $result = $this->commandBusService->handle($command);

            return $this->json($result, 200);
        } catch (\Exception $e) {
            return $this->json(['error' => $e->getMessage()], 500);
        }
    }

    public function createLesson(Request $request): JsonResponse
    {
        $data = $request->request->all();
        $resourcesFile = $request->files->get('resources');

        try {
            $command = new CreateLessonCommand($data, $resourcesFile);
            $result = $this->commandBusService->handle($command);

            if (isset($result['error'])) {
                return $this->json(
                    ['error' => $result['error']],
                    400
                );
            }

            return $this->json($result, 201);
        } catch (\Exception $e) {
            return $this->json(['error' => $e->getMessage()], 500);
        }
    }

    public function deleteLesson(int $id): JsonResponse
    {
        try {
            $command = new DeleteLessonCommand($id);
            $result = $this->commandBusService->handle($command);

            return $this->json($result, 200);
        } catch (\Exception $e) {
            return $this->json(['error' => $e->getMessage()], 404);
        }
    }

    public function trackLessonEngagement(
        int $id,
        Request $request,
        LessonRepository $lessonRepository
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);
        $lesson = $lessonRepository->find($id);

        if (!$lesson) {
            return $this->json(['error' => 'Lesson not found'], 404);
        }

        $lesson
            ->addWatchTime((int)($data['watchTime'] ?? 0))
            ->incrementPauses(($data['pauseCount'] ?? 0))
            ->incrementReplays(($data['replayCount'] ?? 0))
            ->updateAverageCompletion((float)($data['completionPercentage'] ?? 0));

        $this->entityManager->persist($lesson);
        $this->entityManager->flush();

        return $this->json(['status' => 'success']);
    }

    public function trackLessonView(
        int $id,
        LessonRepository $lessonRepository,
    ): JsonResponse {
        $lesson = $lessonRepository->find($id);

        if (!$lesson) {
            return $this->json(['error' => 'Lesson not found'], 404);
        }

        $lesson->incrementTotalViews();
        $this->entityManager->flush();

        return $this->json(['status' => 'view tracked']);
    }

}
