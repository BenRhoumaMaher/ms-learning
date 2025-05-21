<?php

/**
 * This file defines the PostController which handles all post-related operations
 * including creation, listing, editing, and engagement
 * features for the MS-LEARNING platform.
 *
 * @category Controllers
 * @package  App\Controller\msconnect\post
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 * @project  MS-Learning (PFE Project)
 */

namespace App\Controller\msconnect\post;

use App\Repository\PostRepository;
use App\Service\PostService\PostService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

/**
 * Handles all post operations including:
 * - Post creation with media upload
 * - Post listing and details
 * - Post editing and deletion
 * - Like engagement features
 *
 * @category Controllers
 * @package  App\Controller\msconnect\post
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 */
final class PostController extends AbstractController
{
    /**
     * @return JsonResponse JSON response with:
     *                      - message: string (success message)
     *                      - id: int (ID of created post)
     */
    public function create(
        Request $request,
        PostService $postService
    ): JsonResponse {
        try {
            $jsonData = $request->request->get('data');
            $decoded = json_decode($jsonData, true);
            $file = $request->files->get('file');

            $post = $postService->create($decoded, $file);

            return $this->json(
                [
                    'message' => 'Post created!',
                    'id' => $post->getId(),
                ],
                200
            );
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
     * List all posts
     *
     * Retrieves all posts in reverse chronological order.
     *
     * @param PostService $postService Post service for retrieval logic
     *
     * @return JsonResponse Array of post objects with basic information
     */
    public function list(PostService $postService): JsonResponse
    {
        $posts = $postService->getAllPosts();
        return $this->json($posts);
    }

    /**
     * @return JsonResponse JSON response with:
     *                      - message: string (on success)
     *                      - error: string (on failure)
     */
    public function edit(
        int $id,
        Request $request,
        PostService $postService
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);
        $result = $postService->updatePost($id, $data);

        if (isset($result['error'])) {
            return $this->json(
                [
                    'error' => $result['error'],
                ],
                $result['code']
            );
        }

        return $this->json(
            [
                'message' => $result['message'],
            ],
            $result['code']
        );
    }

    /**
     * Toggle like on a post.
     *
     * @param int $id Post ID to like/unlike
     * @param Request $request HTTP request containing JSON with user ID:
     *                        { "user_id": string }
     * @param PostService $postService Post service for like logic
     *
     * @return JsonResponse JSON response containing:
     *                      - liked: bool Current like status after toggle
     *                      - likesCount: int Updated total likes count
     *                      - error: string (optional) Error details
     *
     * @throws \InvalidArgumentException If user ID is missing (400)
     */
    public function toggleLike(
        int $id,
        Request $request,
        PostService $postService
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);
        $userId = $data['user_id'] ?? null;

        if (! $userId) {
            return $this->json(
                [
                    'error' => 'User ID required',
                ],
                400
            );
        }

        $result = $postService->toggleLike($id, $userId);

        if (isset($result['error'])) {
            return $this->json(
                [
                    'error' => $result['error'],
                ],
                $result['code']
            );
        }

        return $this->json(
            [
                'liked' => $result['liked'],
                'likesCount' => $result['likesCount'],
            ],
            $result['code']
        );
    }

    /**
     * @return JsonResponse JSON response with:
     *                      - message: string (on success)
     *                      - error: string (on failure)
     */
    public function delete(
        int $id,
        PostService $postService
    ): JsonResponse {
        $result = $postService->delete($id);

        if (isset($result['error'])) {
            return $this->json(
                [
                    'error' => $result['error'],
                ],
                $result['code']
            );
        }

        return $this->json(
            [
                'message' => $result['message'],
            ],
            $result['code']
        );
    }

    /**
     * @return JsonResponse JSON response with full post data including:
     *                      - content
     *                      - author info
     *                      - media
     *                      - engagement stats
     */
    public function show(
        int $id,
        PostRepository $postRepository,
        PostService $postService
    ): JsonResponse {
        $post = $postRepository->find($id);

        if (! $post) {
            return $this->json(
                [
                    'error' => 'Post not found',
                ],
                404
            );
        }

        return $this->json($postService->show($post));
    }
}
