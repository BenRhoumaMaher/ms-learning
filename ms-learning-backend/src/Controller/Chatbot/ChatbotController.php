<?php

/**
 * This file handles all chatbot-related operations for the MS-LEARNING application.
 * It manages message sending, retrieval, responses,
 * and status updates for the chatbot system.
 *
 * @category Controllers
 * @package  App\Controller\Chatbot
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 * @project  MS-Learning (PFE Project)
 */

namespace App\Controller\Chatbot;

use App\Entity\ChatbotMessage;
use App\Repository\ChatbotMessageRepository;
use App\Repository\UserRepository;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

/**
 * Handles all chatbot operations including:
 * - Sending messages to the chatbot
 * - Retrieving user message history
 * - Managing pending/unanswered messages
 * - Admin responses to messages
 * - Message status updates
 *
 * @category Controllers
 * @package  App\Controller\Chatbot
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 */
class ChatbotController extends AbstractController
{
    /**
     * Sends a new message to the chatbot
     *
     * Processes user messages and stores them in the database
     *
     * @param Request                $request  The HTTP request
     *                                         containing message data
     * @param EntityManagerInterface $em       The entity manager
     * @param UserRepository         $userRepo The user repository
     *
     * @return JsonResponse Success response or error message
     *
     * @throws \InvalidArgumentException If required fields are missing or invalid
     */
    public function sendMessage(
        Request $request,
        EntityManagerInterface $em,
        UserRepository $userRepo
    ): JsonResponse {
        $jsonData = json_decode($request->getContent(), true);
        $userId = $jsonData['user_id'] ?? null;
        $messageText = $jsonData['message'] ?? null;

        if (! $userId || ! $messageText) {
            return $this->json(
                [
                    'error' => 'Missing user_id or message',
                ],
                400
            );
        }

        $user = $userRepo->find($userId);
        if (! $user) {
            return $this->json(
                [
                    'error' => 'Invalid user ID',
                ],
                401
            );
        }

        $message = new ChatbotMessage();
        $message->setUser($user);
        $message->setMessage($messageText);
        $message->setCreatedAt(new DateTimeImmutable());

        $em->persist($message);
        $em->flush();

        return $this->json(
            [
                'success' => true,
                'message' => 'Message sent successfully',
            ]
        );
    }

    /**
     * Retrieves all messages for a specific user
     *
     * Returns the complete message history for a user in chronological order
     *
     * @param Request                  $request    The HTTP request
     *                                             containing user ID
     * @param ChatbotMessageRepository $repository The message repository
     * @param UserRepository           $userRepo   The user repository
     *
     * @return JsonResponse List of user messages with detailed information
     *
     * @throws \InvalidArgumentException If user ID is missing or invalid
     */
    public function getUserMessages(
        Request $request,
        ChatbotMessageRepository $repository,
        UserRepository $userRepo
    ): JsonResponse {
        $userId = $request->query->get('user_id');

        if (! $userId) {
            return $this->json(
                [
                    'error' => 'Missing user_id',
                ],
                400
            );
        }

        $user = $userRepo->find(
            $userId
        );
        if (! $user) {
            return $this->json(
                [
                    'error' => 'Invalid user ID',
                ],
                401
            );
        }

        $messages = $repository->findBy(
            [
                'user' => $user,
            ],
            [
                'createdAt' => 'ASC',
            ]
        );

        return $this->json(
            [
                'messages' => array_map(
                    fn (ChatbotMessage $message) => [
                        'id' => $message->getId(),
                        'message' => $message->getMessage(),
                        'response' => $message->getResponse(),
                        'createdAt' => $message->getCreatedAt()->format('Y-m-d H:i:s'),
                        'respondAt' => $message->getRespondAt()?->format('Y-m-d H:i:s'),
                        'isRead' => $message->isRead(),
                    ],
                    $messages
                ),
            ]
        );
    }

    /**
     * Retrieves all pending/unanswered messages
     *
     * Returns messages that haven't received responses yet, ordered by creation date
     *
     * @param ChatbotMessageRepository $repository The message repository
     *
     * @return JsonResponse List of pending messages with user information
     */
    public function getPendingMessages(
        ChatbotMessageRepository $repository
    ): JsonResponse {
        $messages = $repository->findBy(
            [
                'response' => null,
            ],
            [
                'createdAt' => 'ASC',
            ]
        );

        return $this->json(
            [
                'messages' => array_map(
                    fn (ChatbotMessage $message) => [
                        'id' => $message->getId(),
                        'userId' => $message->getUser()->getId(),
                        'userName' => $message->getUser()->getUsername(),
                        'userEmail' => $message->getUser()->getEmail(),
                        'message' => $message->getMessage(),
                        'createdAt' => $message->getCreatedAt()->format('Y-m-d H:i:s'),
                    ],
                    $messages
                ),
            ]
        );
    }

    /**
     * Processes admin responses to user messages
     *
     * Handles admin replies to chatbot messages and updates message status
     *
     * @param int                      $id             The message ID to respond to
     * @param Request                  $request        The HTTP request containing
     *                                                 response data
     * @param ChatbotMessageRepository $repository     The message repository
     * @param EntityManagerInterface   $em             The entity manager
     * @param UserRepository           $userRepository The user repository
     *
     * @return JsonResponse Success response or error message
     *
     * @throws \InvalidArgumentException If response is missing or message not found
     */
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

    /**
     * Marks a message as read
     *
     * Updates the read status of a specific message
     *
     * @param int                      $id         The message ID to mark as read
     * @param ChatbotMessageRepository $repository The message repository
     * @param EntityManagerInterface   $em         The entity manager
     *
     * @return JsonResponse Success response or error message
     *
     * @throws \InvalidArgumentException If message not found
     */
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
