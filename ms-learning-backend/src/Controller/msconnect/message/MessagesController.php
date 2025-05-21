<?php

/**
 * This file defines the MessagesController which handles all messaging operations
 * including sending, retrieving, and translating messages
 * for the MS-LEARNING platform.
 *
 * @category Controllers
 * @package  App\Controller\msconnect\message
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 * @project  MS-Learning (PFE Project)
 */

namespace App\Controller\msconnect\message;

use App\Service\MessageService\MessageService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

/**
 * Handles all messaging operations including:
 * - Sending messages between users
 * - Retrieving message history for chat rooms
 * - Real-time message translation
 *
 * @category Controllers
 * @package  App\Controller\msconnect\message
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 */
class MessagesController extends AbstractController
{
    /**
     * Send a new message
     *
     * Creates and stores a new message in the specified chat room.
     *
     * @param Request        $request        HTTP request containing message data
     * @param MessageService $messageService Service for message operations
     *
     * @return JsonResponse JSON containing:
     *                      - status: string
     *                      - id: string (ID of created message)
     *
     * @throws \InvalidArgumentException If required data is missing or invalid (400)
     */
    public function sendMessage(
        Request $request,
        MessageService $messageService
    ): JsonResponse {
        try {
            $data = json_decode($request->getContent(), true);
            $response = $messageService->sendMessage($data);

            return $this->json($response, 201);
        } catch (\InvalidArgumentException $e) {
            return $this->json(
                [
                    'error' => $e->getMessage(),
                ],
                400
            );
        }
    }

    /**
     * Get messages for a chat room
     *
     * Retrieves message history for a specific chat room
     * with user access validation.
     *
     * @param string         $roomId         ID of the chat room
     * @param Request        $request        HTTP request containing query parameter:
     *                                       ?userId=string (user ID for access validation)
     * @param MessageService $messageService Service for message operations
     *
     * @return JsonResponse Array of message objects with:
     *     - id
     *     - content
     *     - senderId
     *     - timestamp
     *     - type
     * @throws \InvalidArgumentException If room ID or user ID is invalid (400)
     * @throws \RuntimeException If user is not authorized to access this room (403)
     */
    public function getMessages(
        string $roomId,
        Request $request,
        MessageService $messageService
    ): JsonResponse {
        $userId = $request->query->get('userId');
        try {
            $messages = $messageService->getMessagesForRoom($roomId, $userId);
            return $this->json($messages);
        } catch (\InvalidArgumentException $e) {
            return $this->json(
                [
                    'error' => $e->getMessage(),
                ],
                400
            );
        } catch (\RuntimeException $e) {
            return $this->json(
                [
                    'error' => $e->getMessage(),
                ],
                403
            );
        }
    }

    /**
     * Translate message text
     *
     * Translates message content to the specified language using external translation service.
     *
     * @param Request $request HTTP request containing:
     *                          - text: string (message to translate)
     *                          - lang: string (target language, default 'fr')
     *
     * @return JsonResponse JSON containing:
     *                      - status: string ('success' or 'error')
     *                      - translated: string (translated content) on success
     *                      - message: string (error message) on failure
     *
     * @throws \InvalidArgumentException If message text is missing (400)
     * @throws \Exception If translation service fails (500)
     */
    public function translateMessage(
        Request $request
    ): JsonResponse {
        try {
            $messageText = $request->request->get('text');
            $targetLang = $request->request->get('lang', 'fr');

            if (! $messageText) {
                throw new \InvalidArgumentException('Message text is required.');
            }

            $client = new \GuzzleHttp\Client();
            $response = $client->post(
                'http://whisper:5000/translate-text',
                [
                    'form_params' => [
                        'text' => $messageText,
                        'lang' => $targetLang,
                    ],
                    'timeout' => 20,
                ]
            );

            $translated = json_decode($response->getBody(), true);
            return $this->json(
                [
                    'status' => 'success',
                    'translated' => $translated['translated'],
                ]
            );

        } catch (\Exception $e) {
            return $this->json(
                [
                    'status' => 'error',
                    'message' => $e->getMessage(),
                ],
                500
            );
        }
    }
}
