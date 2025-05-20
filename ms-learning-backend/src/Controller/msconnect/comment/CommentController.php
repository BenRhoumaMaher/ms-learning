<?php

namespace App\Controller\msconnect\comment;

use App\Service\CommentService\CommentService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

final class CommentController extends AbstractController
{
    public function create(
        Request $request,
        CommentService $commentCreator
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        try {
            $comment = $commentCreator->create($data);

            return $this->json(
                [
                    'message' => 'Comment added',
                    'id' => $comment->getId(),
                ]
            );
        } catch (\InvalidArgumentException $e) {
            return $this->json([
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    public function createReply(
        int $commentId,
        Request $request,
        CommentService $commentService
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        try {
            $reply = $commentService->createReply($data, $commentId);

            return $this->json(
                [
                    'message' => 'Reply added',
                    'id' => $reply->getId(),
                ]
            );
        } catch (\InvalidArgumentException $e) {
            return $this->json([
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    public function listRepliesByComment(
        int $commentId,
        CommentService $commentService
    ): JsonResponse {
        try {
            $replies = $commentService->listRepliesByComment($commentId);
            return $this->json($replies);
        } catch (\InvalidArgumentException $e) {
            return $this->json([
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    public function listByPost(
        int $postId,
        CommentService $commentService
    ): JsonResponse {
        $comments = $commentService->listByPost($postId);
        return $this->json($comments);
    }

    public function show(
        int $id,
        CommentService $commentService
    ): JsonResponse {
        try {
            $data = $commentService->getCommentData($id);
            return $this->json($data);
        } catch (\InvalidArgumentException $e) {
            return $this->json([
                'error' => $e->getMessage(),
            ], 404);
        }
    }
}
