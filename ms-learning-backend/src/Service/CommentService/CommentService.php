<?php

namespace App\Service\CommentService;

use App\Entity\Comment;
use App\Entity\CommentReply;
use App\Repository\CommentRepository;
use App\Repository\PostRepository;
use App\Repository\UserRepository;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;

class CommentService
{
    public function __construct(
        private PostRepository $postRepository,
        private UserRepository $userRepository,
        private CommentRepository $commentRepository,
        private EntityManagerInterface $em
    ) {
    }

    /**
     * Create a new comment for a post
     *
     * @param array{post_id: int, user_id: int, content: string} $data
     *
     * @return Comment
     */
    public function create(array $data): Comment
    {
        $postId = $data['post_id'] ?? null;
        $userId = $data['user_id'] ?? null;
        $content = $data['content'] ?? null;

        $user = $this->userRepository->find($userId);
        if (! $user) {
            throw new \InvalidArgumentException('User not found');
        }

        $post = $this->postRepository->find($postId);
        if (! $post) {
            throw new \InvalidArgumentException('Post not found');
        }

        $comment = new Comment();
        $comment->setPost($post);
        $comment->setUser($user);
        $comment->setContent($content);
        $comment->setCreatedAt(new DateTimeImmutable());

        $this->em->persist($comment);
        $this->em->flush();

        return $comment;
    }

    /**
     * Create a reply to an existing comment
     *
     * @param array{user_id: int, content: string} $data
     * @param int $commentId
     *
     * @return CommentReply
     */
    public function createReply(array $data, int $commentId): CommentReply
    {
        $userId = $data['user_id'] ?? null;
        $content = $data['content'] ?? null;

        $user = $this->userRepository->find($userId);
        if (! $user) {
            throw new \InvalidArgumentException('User not found');
        }

        $comment = $this->commentRepository->find($commentId);
        if (! $comment) {
            throw new \InvalidArgumentException('Comment not found');
        }

        $reply = new CommentReply();
        $reply->setComment($comment);
        $reply->setUser($user);
        $reply->setContent($content);
        $reply->setCreatedAt(new DateTimeImmutable());

        $this->em->persist($reply);
        $this->em->flush();

    }

    /**
     * List replies for a given comment
     *
     * @param int $commentId
     *
     * @return array<int, array{
     *     id: int|null,
     *     content: string|null,
     *     author: string,
     *     createdAt: string
     * }>
     */
    public function listRepliesByComment(int $commentId): array
    {
        $comment = $this->commentRepository->find($commentId);
        if (! $comment) {
            throw new \InvalidArgumentException('Comment not found');
        }

        $replies = $this->em->getRepository(CommentReply::class)->findBy(
            [
                'comment' => $commentId,
            ],
            [
                'createdAt' => 'ASC',
            ]
        );

        $data = [];
        foreach ($replies as $reply) {
            $data[] = [
                'id' => $reply->getId(),
                'content' => $reply->getContent(),
                'author' => $reply->getUser()->getUsername(),
                'createdAt' => $reply->getCreatedAt()->format('Y-m-d H:i:s'),
            ];
        }

        return $data;
    }

    /**
     * List comments for a given post
     *
     * @param int $postId
     *
     * @return array<int, array{
     *     id: int|null,
     *     content: string|null,
     *     author: string,
     *     createdAt: string
     * }>
     */
    public function listByPost(int $postId): array
    {
        $comments = $this->commentRepository->findBy(
            [
                'post' => $postId,
            ],
            [
                'createdAt' => 'ASC',
            ]
        );

        $data = [];

        foreach ($comments as $comment) {
            $data[] = [
                'id' => $comment->getId(),
                'content' => $comment->getContent(),
                'author' => $comment->getUser()->getUsername(),
                'createdAt' => $comment->getCreatedAt()->format('Y-m-d H:i:s'),
            ];
        }

        return $data;
    }

    /**
     * Get a single comment's detailed data
     *
     * @param int $id
     *
     * @return array{
     *     id: int|null,
     *     content: string|null,
     *     author: string,
     *     createdAt: string,
     *     postId: int|null
     * }
     */
    public function getCommentData(int $id): array
    {
        $comment = $this->commentRepository->find($id);

        if (! $comment) {
            throw new \InvalidArgumentException('Comment not found');
        }

        return [
            'id' => $comment->getId(),
            'content' => $comment->getContent(),
            'author' => $comment->getUser()->getUsername(),
            'createdAt' => $comment->getCreatedAt()->format('Y-m-d H:i:s'),
            'postId' => $comment->getPost()->getId(),
        ];
    }
}
