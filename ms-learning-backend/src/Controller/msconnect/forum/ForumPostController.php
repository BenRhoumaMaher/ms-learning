<?php

namespace App\Controller\msconnect\forum;

use App\Service\ForumPostService\ForumPostService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

class ForumPostController extends AbstractController
{
    public function index(ForumPostService $forumPostService): JsonResponse
    {
        $posts = $forumPostService->getAllPosts();
        return $this->json($posts);
    }

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
            return $this->json([
                'error' => $e->getMessage(),
            ], 400);
        } catch (\RuntimeException $e) {
            return $this->json([
                'error' => $e->getMessage(),
            ], 403);
        }
    }

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

    public function postsiblings(
        int $id,
        ForumPostService $forumPostService
    ): JsonResponse {
        try {
            $data = $forumPostService->getSiblingPosts($id);
            return $this->json($data);
        } catch (\InvalidArgumentException $e) {
            return $this->json([
                'error' => $e->getMessage(),
            ], 404);
        }
    }
}
