<?php

namespace App\Controller\msconnect\post;

use App\Repository\PostRepository;
use App\Service\PostService\PostService;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

final class PostController extends AbstractController
{
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
            return $this->json(['error' => $e->getMessage()], 400);
        }
    }

    public function list(PostService $postService): JsonResponse
    {
        $posts = $postService->getAllPosts();
        return $this->json($posts);
    }

    public function edit(
        int $id,
        Request $request,
        PostService $postService
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);
        $result = $postService->updatePost($id, $data);

        if (isset($result['error'])) {
            return $this->json(['error' => $result['error']], $result['code']);
        }

        return $this->json(['message' => $result['message']], $result['code']);
    }
    public function toggleLike(
        int $id,
        Request $request,
        PostService $postService
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);
        $userId = $data['user_id'] ?? null;

        if (!$userId) {
            return $this->json(['error' => 'User ID required'], 400);
        }

        $result = $postService->toggleLike($id, $userId);

        if (isset($result['error'])) {
            return $this->json(['error' => $result['error']], $result['code']);
        }

        return $this->json(
            [
            'liked' => $result['liked'],
            'likesCount' => $result['likesCount']
            ],
            $result['code']
        );
    }
    public function delete(
        int $id,
        PostService $postService
    ): JsonResponse {
        $result = $postService->delete($id);

        if (isset($result['error'])) {
            return $this->json(['error' => $result['error']], $result['code']);
        }

        return $this->json(['message' => $result['message']], $result['code']);
    }

    public function show(
        int $id,
        PostRepository $postRepository,
        PostService $postService
    ): JsonResponse {
        $post = $postRepository->find($id);

        if (!$post) {
            return $this->json(['error' => 'Post not found'], 404);
        }

        return $this->json($postService->show($post));
    }
}
