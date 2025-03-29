<?php

namespace App\Controller\Lesson;

use App\Repository\UserRepository;
use App\Repository\LessonRepository;
use App\Service\Course\CourseService;
use App\Service\UserService\UserService;
use Doctrine\ORM\EntityManagerInterface;
use App\Service\LessonService\LessonService;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

final class LessonController extends AbstractController
{
    public function __construct(
        private UserService $userService
    ) {
    }

    public function getLatestUserLiveLesson(
        int $id,
        LessonRepository $lessonRepository,
        UserRepository $userRepository
    ): JsonResponse {
        $user = $userRepository->find($id);
        if (!$user) {
            return $this->json(
                ['error' => 'User not found'],
                404
            );
        }

        $lesson = $lessonRepository->findLatestLiveLessonForUser($id);

        if (!$lesson) {
            return $this->json(
                ['message' => 'No upcoming live lessons for this user'],
                404
            );
        }

        return $this->json(
            $lesson,
            200,
            [],
            ['groups' => 'lesson:read']
        );
    }

    public function getUserLiveSessions(
        int $id,
        LessonRepository $lessonRepository
    ): JsonResponse {
        $liveSessions = $lessonRepository->findUserLiveSessions($id);

        $formattedSessions = array_map(
            function ($session) {
                return [
                    'id' => $session->getId(),
                    'title' => $session->getTitle(),
                    'date' => $session->getLiveStartTime()->format('Y-m-d'),
                    'startTime' => $session->getLiveStartTime()->format('H:i'),
                    'endTime' => $session->getLiveEndTime()->format('H:i')
                ];
            },
            $liveSessions
        );

        return $this->json($formattedSessions);
    }

    public function getLiveLessonInfo(
        int $id,
        LessonRepository $lessonRepository
    ): JsonResponse {
        $lesson = $lessonRepository->find($id);

        if (!$lesson) {
            return $this->json(
                ['error' => 'Lesson not found'],
                404
            );
        }

        $formattedLesson = [
            'id' => $lesson->getId(),
            'title' => $lesson->getTitle(),
            'content' => $lesson->getContent(),
            'liveStartTime' => $lesson->getLiveStartTime(),
            'liveEndTime' => $lesson->getLiveEndTime(),
            'position' => $lesson->getPosition(),
            'liveMeetingLink' => $lesson->getLiveMeetingLink(),
        ];

        return $this->json(
            $formattedLesson,
            200,
            [],
            ['groups' => 'lesson:read']
        );
    }

    public function editLesson(
        int $id,
        Request $request,
        LessonService $lessonService
    ): JsonResponse {
        $lesson = $lessonService->getLessonById($id);

        if (!$lesson) {
            return $this->json(['error' => 'Lesson not found'], 404);
        }

        $data = json_decode($request->getContent(), true);

        try {
            $lessonService->updateLessonData($lesson, $data);
            $errors = $lessonService->validateLesson($lesson);

            if (!empty($errors)) {
                return $this->json(['errors' => $errors], 400);
            }

            $lessonService->saveLesson($lesson);

            return $this->json($lesson, 200, [], ['groups' => 'lesson:read']);
        } catch (\Exception $e) {
            return $this->json(['error' => $e->getMessage()], 400);
        }
    }

    public function convertToRegistered(
        int $id,
        Request $request,
        LessonService $lessonService
    ): JsonResponse {
        $lesson = $lessonService->getLessonById($id);

        if (!$lesson) {
            return $this->json(['error' => 'Lesson not found'], 404);
        }

        $data = json_decode($request->getContent(), true);

        if (!isset($data['videoUrl'])) {
            return $this->json(['error' => 'Video URL is required'], 400);
        }

        try {
            $lessonService->convertLessonToRegistered($lesson, $data['videoUrl']);
            $errors = $lessonService->validateLesson($lesson);

            if (!empty($errors)) {
                return $this->json(['errors' => $errors], 400);
            }

            $lessonService->saveLesson($lesson);

            return $this->json(
                ['message' => 'Lesson converted to registered successfully'],
                200
            );
        } catch (\Exception $e) {
            return $this->json(['error' => $e->getMessage()], 400);
        }
    }


    public function addResourceToLesson(
        int $id,
        Request $request,
        LessonRepository $lessonRepository,
        CourseService $courseService,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $resourceFile = $request->files->get('resource');

        if (!$resourceFile) {
            return $this->json(['error' => 'No resource file provided'], 400);
        }

        $lesson = $lessonRepository->find($id);
        if (!$lesson) {
            return $this->json(['error' => 'Lesson not found'], 404);
        }

        try {
            $resourcePath = $courseService->uploadFile($resourceFile);
            $lesson->setRessources($resourcePath);

            $entityManager->persist($lesson);
            $entityManager->flush();

            return $this->json(
                [
                'message' => 'Resource added successfully',
                'resource_path' => $resourcePath
                ],
                200
            );
        } catch (\Exception $e) {
            return $this->json(
                [
                'error' => 'Failed to upload resource: ' . $e->getMessage()
                ],
                500
            );
        }
    }

    public function createLesson(
        Request $request,
        LessonService $lessonService
    ): JsonResponse {
        $data = $request->request->all();
        $resourcesFile = $request->files->get('resources');

        $validationError = $lessonService->validateLessonData($data);
        if ($validationError) {
            return $this->json(['error' => $validationError], 400);
        }

        $entities = $lessonService->getEntitiesForLesson($data);
        if (isset($entities['error'])) {
            return $this->json(['error' => $entities['error']], 404);
        }

        try {
            $lesson = $lessonService->createLessonEntity($data, $entities);

            if ($resourcesFile) {
                $lessonService->handleLessonResources($lesson, $resourcesFile);
            }

            $lessonService->saveTheLesson($lesson);

            return $this->json(
                [
                'message' => 'Lesson created successfully',
                'lesson_id' => $lesson->getId(),
                'resources_path' => $lesson->getRessources()
                ], 201
            );
        } catch (\Exception $e) {
            return $this->json(['error' => $e->getMessage()], 500);
        }
    }

    public function deleteLesson(
        int $id,
        LessonRepository $lessonRepository,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $lesson = $lessonRepository->find($id);

        if (!$lesson) {
            return $this->json(['error' => 'Lesson not found'], 404);
        }

        $entityManager->remove($lesson);
        $entityManager->flush();

        return $this->json(
            ['message' => 'Lesson deleted successfully'],
            200
        );
    }
}
