<?php

namespace App\Service\Chatbot;

use App\Entity\ChatbotMessage;
use App\Repository\MessageRepository;
use App\Repository\UserRepository;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;

class ChatbotMessageService
{
    public function __construct(
        private readonly UserRepository $userRepository,
        private readonly EntityManagerInterface $em,
        private MessageRepository $messageRepository
    ) {
    }

    public function sendMessage(int $userId, string $messageText): void
    {
        $user = $this->userRepository->find($userId);

        if (! $user) {
            throw new \InvalidArgumentException('Invalid user ID');
        }

        $message = new ChatbotMessage();
        $message->setUser($user);
        $message->setMessage($messageText);
        $message->setCreatedAt(new DateTimeImmutable());

        $this->em->persist($message);
        $this->em->flush();
    }

    /**
     * Get pending chatbot messages without responses
     *
     * @return array<int, array{
     *     id: int|null,
     *     userId: int,
     *     userName: string,
     *     userEmail: string,
     *     message: string,
     *     createdAt: string
     * }>
     */
    public function getPendingMessages(): array
    {
        $messages = $this->messageRepository->findBy(
            [
                'response' => null,
            ],
            [
                'createdAt' => 'ASC',
            ]
        );

        return array_map(
            function (ChatbotMessage $message) {
                $user = $message->getUser();
                return [
                    'id' => $message->getId(),
                    'userId' => $user->getId(),
                    'userName' => $user->getUsername(),
                    'userEmail' => $user->getEmail(),
                    'message' => $message->getMessage(),
                    'createdAt' => $message->getCreatedAt()->format('Y-m-d H:i:s'),
                ];
            },
            $messages
        );
    }

    /**
     * Get all chatbot messages for a specific user
     *
     * @return array<int, array{
     *     id: int|null,
     *     message: string|null,
     *     response: string|null,
     *     createdAt: string,
     *     respondAt: string|null,
     *     isRead: bool|null
     * }>
     */
    public function getMessagesByUserId(int $userId): array
    {
        $user = $this->userRepository->find($userId);

        if (! $user) {
            throw new \InvalidArgumentException('Invalid user ID');
        }

        $messages = $this->messageRepository->findBy(
            [
                'user' => $user,
            ],
            [
                'createdAt' => 'ASC',
            ]
        );

        return array_map(
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
        );
    }

    public function respondToMessage(int $messageId, int $adminUserId, string $responseText): void
    {
        $message = $this->messageRepository->find($messageId);
        if (! $message) {
            throw new \RuntimeException('Message not found');
        }

        if (! $responseText) {
            throw new \InvalidArgumentException('Response is required');
        }

        $admin = $this->userRepository->find($adminUserId);
        if (! $admin) {
            throw new \InvalidArgumentException('Admin user not found');
        }

        $message->setAdminuser($admin);
        $message->setResponse($responseText);
        $message->setRespondAt(new DateTimeImmutable());
        $message->setIsRead(false);

        $this->em->flush();
    }

    public function markMessageAsRead(int $messageId): void
    {
        $message = $this->messageRepository->find($messageId);

        if (! $message) {
            throw new \RuntimeException('Message not found');
        }

        $message->setIsRead(true);
        $this->em->flush();
    }
}
