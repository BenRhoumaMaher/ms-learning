<?php

/**
 * This file defines the CommentController which
 * handles all comment-related operations
 * including creation, replies, and listing for the
 * MS-LEARNING platform's discussion features.
 *
 * @category Controllers
 * @package  App\Controller\msconnect\comment
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 * @project  MS-Learning (PFE Project)
 */

namespace App\Controller\msconnect\comment;

use App\Service\CommentService\CommentService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

/**
 * Handles all comment operations including:
 * - Comment creation and replies
 * - Comment listing and retrieval
 * - Threaded comment discussions
 *
 * @category Controllers
 * @package  App\Controller\msconnect\comment
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 */
final class CommentController extends AbstractController
{
    /**
     * Create a new comment
     *
     * @param Request        $request        HTTP request containing comment
     *                                       data in JSON format
     * @param CommentService $commentCreator Comment service for creation logic
     *
     * @return JsonResponse JSON containing a success message and comment ID
     * @throws \InvalidArgumentException If required data is missing or invalid
     * }
     * @throws \InvalidArgumentException If required data is missing or invalid
     */
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
            return $this->json(
                [
                    'error' => $e->getMessage(),
                ],
                404
            );
        }
    }

    /**
     * Create a reply to an existing comment
     *
     * @param int            $commentId      ID of parent comment
     * @param Request        $request        HTTP request containing reply data
     *                                       in JSON format
     * @param CommentService $commentService Comment service for reply logic
     *
     * @return JsonResponse JSON response containing:
     *                      - 'message': string Success message
     *                      - 'id': int ID of the created reply
     * @throws \InvalidArgumentException If parent comment not found or data invalid
     */
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
            return $this->json(
                [
                    'error' => $e->getMessage(),
                ],
                404
            );
        }
    }

    /**
     * List all replies for a comment
     *
     * @param int            $commentId      ID of parent comment
     * @param CommentService $commentService Comment service for retrieval logic
     *
     * @return JsonResponse Array of reply comments
     * @throws \InvalidArgumentException If parent comment not found
     */
    public function listRepliesByComment(
        int $commentId,
        CommentService $commentService
    ): JsonResponse {
        try {
            $replies = $commentService->listRepliesByComment($commentId);
            return $this->json($replies);
        } catch (\InvalidArgumentException $e) {
            return $this->json(
                [
                    'error' => $e->getMessage(),
                ],
                404
            );
        }
    }

    /**
     * List all comments for a post
     *
     * @param int            $postId         ID of the post
     * @param CommentService $commentService Comment service for retrieval logic
     *
     * @return JsonResponse Array of comments with their replies
     */
    public function listByPost(
        int $postId,
        CommentService $commentService
    ): JsonResponse {
        $comments = $commentService->listByPost($postId);
        return $this->json($comments);
    }

    /**
     * Get detailed data for a specific comment
     *
     * @param int            $id             Comment ID
     * @param CommentService $commentService Comment service for retrieval logic
     *
     * @return JsonResponse Complete comment data including author information
     * @throws \InvalidArgumentException If comment not found
     */
    public function show(
        int $id,
        CommentService $commentService
    ): JsonResponse {
        try {
            $data = $commentService->getCommentData($id);
            return $this->json($data);
        } catch (\InvalidArgumentException $e) {
            return $this->json(
                [
                    'error' => $e->getMessage(),
                ],
                404
            );
        }
    }
}
