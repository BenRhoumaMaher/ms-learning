<?php

namespace App\Service\MessageService;

use App\Entity\Message;
use App\Entity\User;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Mercure\HubInterface;
use Symfony\Component\Mercure\Update;

class MessageService
{
    public function __construct(
        private EntityManagerInterface $em,
        private HubInterface $hub
    ) {
    }

    /**
     * @param array<string, mixed> $data
     *
     * @return array<string, mixed>
     */
    public function sendMessage(array $data): array
    {
        $userId = $data['user_id'] ?? null;
        $receiverId = $data['receiver_id'] ?? null;
        $roomId = $data['roomId'] ?? null;
        $content = $data['content'] ?? null;

        if (! $userId || ! $receiverId || ! $content) {
            throw new \InvalidArgumentException('User ID, Receiver ID and content required');
        }

        $user = $this->em->getRepository(User::class)->find($userId);
        $receiver = $this->em->getRepository(User::class)->find($receiverId);

        if (! $user || ! $receiver) {
            throw new \InvalidArgumentException('Invalid user or receiver');
        }

        if (! $roomId) {
            $userIds = [(int) $userId, (int) $receiverId];
            sort($userIds);
            $roomId = 'room_' . implode('_', $userIds);
        }

        $message = new Message();
        $message->setContent($content);
        $message->setRoomId($roomId);
        $message->setSender($user);
        $message->setReceiver($receiver);
        $message->setCreatedAt(new DateTimeImmutable());

        $this->em->persist($message);
        $this->em->flush();

        $payload = [
            'id' => $message->getId(),
            'content' => $message->getContent(),
            'sender' => $user->getUsername(),
            'senderId' => $user->getId(),
            'receiverId' => $receiver->getId(),
            'createdAt' => $message->getCreatedAt()->format('Y-m-d H:i:s'),
            'roomId' => $roomId,
            'picture' => $user->getPicture(),
        ];

        $update = new Update(
            sprintf('/chat/%s', $roomId),
            json_encode($payload)
        );

        $this->hub->publish($update);

        return $payload;
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function getMessagesForRoom(string $roomId, int|string $currentUserId): array
    {
        $userIds = explode('_', str_replace('room_', '', $roomId));

        if (count($userIds) !== 2) {
            throw new \InvalidArgumentException('Invalid room format');
        }

        if (! in_array((string) $currentUserId, $userIds, true)) {
            throw new \RuntimeException('Unauthorized access to this conversation');
        }

        $messages = $this->em->getRepository(Message::class)->createQueryBuilder('m')
            ->where('m.roomId = :roomId')
            ->setParameter('roomId', $roomId)
            ->orderBy('m.createdAt', 'ASC')
            ->getQuery()
            ->getResult();

        return array_map(
            function (Message $message) {
                return [
                    'id' => $message->getId(),
                    'content' => $message->getContent(),
                    'senderId' => $message->getSender()?->getId(),
                    'sender' => $message->getSender()?->getUsername(),
                    'receiverId' => $message->getReceiver()?->getId(),
                    'picture' => $message->getSender()?->getPicture(),
                    'roomId' => $message->getRoomId(),
                    'createdAt' => $message->getCreatedAt()?->format('Y-m-d H:i:s'),
                ];
            },
            $messages
        );
    }
}
