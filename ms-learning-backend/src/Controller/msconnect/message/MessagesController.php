<?php

namespace App\Controller\msconnect\message;

use Symfony\Component\HttpFoundation\Request;
use App\Service\MessageService\MessageService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class MessagesController extends AbstractController
{
    public function sendMessage(
        Request $request,
        MessageService $messageService
    ): JsonResponse {
        try {
            $data = json_decode($request->getContent(), true);
            $response = $messageService->sendMessage($data);

            return $this->json($response, 201);
        } catch (\InvalidArgumentException $e) {
            return $this->json(['error' => $e->getMessage()], 400);
        }
    }
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
            return $this->json(['error' => $e->getMessage()], 400);
        } catch (\RuntimeException $e) {
            return $this->json(['error' => $e->getMessage()], 403);
        }
    }

    public function translateMessage(
        Request $request
    ): JsonResponse {
        try {
            $messageText = $request->request->get('text');
            $targetLang = $request->request->get('lang', 'fr');

            if (!$messageText) {
                throw new \InvalidArgumentException("Message text is required.");
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
