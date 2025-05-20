<?php

namespace App\Controller\Chatbot;

use App\Entity\ChatbotMessage;
use App\Repository\ChatbotMessageRepository;
use App\Repository\UserRepository;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

class ChatbotController extends AbstractController
{
    public function sendMessage(
        Request $request,
        EntityManagerInterface $em,
        UserRepository $userRepo
    ): JsonResponse {
        $jsonData = json_decode($request->getContent(), true);
        $userId = $jsonData['user_id'] ?? null;
        $messageText = $jsonData['message'] ?? null;

        if (! $userId || ! $messageText) {
            return $this->json([
                'error' => 'Missing user_id or message',
            ], 400);
        }

        $user = $userRepo->find($userId);
        if (! $user) {
            return $this->json([
                'error' => 'Invalid user ID',
            ], 401);
        }

        $message = new ChatbotMessage();
        $message->setUser($user);
        $message->setMessage($messageText);
        $message->setCreatedAt(new DateTimeImmutable());

        $em->persist($message);
        $em->flush();

        return $this->json([
            'success' => true,
            'message' => 'Message sent successfully',
        ]);
    }

    public function getUserMessages(
        Request $request,
        ChatbotMessageRepository $repository,
        UserRepository $userRepo
    ): JsonResponse {
        $userId = $request->query->get('user_id');

        if (! $userId) {
            return $this->json([
                'error' => 'Missing user_id',
            ], 400);
        }

        $user = $userRepo->find($userId);
        if (! $user) {
            return $this->json([
                'error' => 'Invalid user ID',
            ], 401);
        }

        $messages = $repository->findBy([
            'user' => $user,
        ], [
            'createdAt' => 'ASC',
        ]);

        return $this->json(
            [
                'messages' => array_map(
                    function (ChatbotMessage $message) {
                        return [
                            'id' => $message->getId(),
                            'message' => $message->getMessage(),
                            'response' => $message->getResponse(),
                            'createdAt' => $message->getCreatedAt()->format('Y-m-d H:i:s'),
                            'respondAt' => $message->getRespondAt()?->format('Y-m-d H:i:s'),
                            'isRead' => $message->isRead(),
                        ];
                    },
                    $messages
                ),
            ]
        );
    }

    public function getPendingMessages(
        ChatbotMessageRepository $repository
    ): JsonResponse {
        $messages = $repository->findBy([
            'response' => null,
        ], [
            'createdAt' => 'ASC',
        ]);

        return $this->json(
            [
                'messages' => array_map(
                    function (ChatbotMessage $message) {
                        return [
                            'id' => $message->getId(),
                            'userId' => $message->getUser()->getId(),
                            'userName' => $message->getUser()->getUsername(),
                            'userEmail' => $message->getUser()->getEmail(),
                            'message' => $message->getMessage(),
                            'createdAt' => $message->getCreatedAt()->format('Y-m-d H:i:s'),
                        ];
                    },
                    $messages
                ),
            ]
        );
    }

    public function respondToMessage(
        int $id,
        Request $request,
        ChatbotMessageRepository $repository,
        EntityManagerInterface $em,
        UserRepository $userRepository
    ): JsonResponse {
        $message = $repository->find($id);
        if (! $message) {
            return $this->json(
                [
                    'error' => 'Message not found',
                ],
                404
            );
        }

        $data = json_decode(
            $request->getContent(),
            true
        );
        $responseText = $data['response'] ?? null;
        $userId = $data['user_id'] ?? null;

        $admin = $userRepository->find($userId);

        if (! $responseText) {
            return $this->json(
                [
                    'error' => 'Response is required',
                ],
                403
            );
        }

        $message->setAdminuser($admin);
        $message->setResponse($responseText);
        $message->setRespondAt(new DateTimeImmutable());
        $message->setIsRead(false);

        $em->flush();

        return $this->json(
            [
                'success' => true,
                'message' => 'Response sent successfully',
            ]
        );
    }

    public function markAsRead(
        int $id,
        ChatbotMessageRepository $repository,
        EntityManagerInterface $em
    ): JsonResponse {
        $message = $repository->find($id);
        if (! $message) {
            return $this->json(
                [
                    'error' => 'Message not found',
                ],
                404
            );
        }

        $message->setIsRead(true);
        $em->flush();

        return $this->json(
            [
                'success' => true,
                'message' => 'Message marked as read',
            ]
        );
    }
}
