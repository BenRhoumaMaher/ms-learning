<?php

/**
 * This file defines the ForumPostController which handles all forum post operations
 * including creation, retrieval, and related post suggestions
 * for the MS-LEARNING platform.
 *
 * @category Controllers
 * @package  App\Controller\msconnect\forum
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 * @project  MS-Learning (PFE Project)
 */

namespace App\Controller\msconnect\forum;

use App\Service\ForumPostService\ForumPostService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

/**
 * Handles all forum post operations including:
 * - Post creation and listing
 * - Post details retrieval
 * - Related post suggestions
 *
 * @category Controllers
 * @package  App\Controller\msconnect\forum
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 */
class ForumPostController extends AbstractController
{
    /**
     * Get all forum posts
     *
     * Retrieves a list of all forum posts in the system.
     *
     * @param ForumPostService $forumPostService Service for forum post operations
     *
     * @return JsonResponse Array of forum posts with basic information
     */
    public function index(ForumPostService $forumPostService): JsonResponse
    {
        $posts = $forumPostService->getAllPosts();
        return $this->json($posts);
    }

    /**
     * Create a new forum post
     *
     * Handles the creation of a new forum post with request data validation.
     *
     * @param Request          $request          HTTP request containing post data
     * @param ForumPostService $forumPostService Service for post creation
     *
     * @return JsonResponse JSON response with:
     *                      - message: string, success message
     *                      - id: int, ID of created post
     *
     * @throws \InvalidArgumentException If required data is missing or invalid (400)
     * @throws \RuntimeException         If user is not authorized to create posts (403)
     */
    public function create(
        Request $request,
        ForumPostService $forumPostService
    ): JsonResponse {
        try {
            $post = $forumPostService->createPost($request);

            return $this->json(
                [
                    'message' => 'Forum Post created!',
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
     * Get forum post details
     *
     * Retrieves detailed information about a specific post
     * and increments its view count.
     *
     * @param int              $id               Post ID
     * @param ForumPostService $forumPostService Service for post retrieval
     *
     * @return JsonResponse Complete post data including author and comments
     * @throws \InvalidArgumentException If post is not found (404)
     */
    public function show(
        int $id,
        ForumPostService $forumPostService
    ): JsonResponse {
        try {
            $data = $forumPostService->getPostDetailsAndIncrementViews($id);
            return $this->json($data);
        } catch (\InvalidArgumentException $e) {
            return $this->json(
                [
                    'message' => $e->getMessage(),
                ],
                404
            );
        }
    }

    /**
     * Get related forum posts
     *
     * Retrieves posts that are related to the specified post (sibling posts).
     *
     * @param int              $id               Post ID to find related posts for
     * @param ForumPostService $forumPostService Service for post retrieval
     *
     * @return JsonResponse Array of related forum posts
     * @throws \InvalidArgumentException If specified post is not found (404)
     */
    public function postsiblings(
        int $id,
        ForumPostService $forumPostService
    ): JsonResponse {
        try {
            $data = $forumPostService->getSiblingPosts($id);
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
