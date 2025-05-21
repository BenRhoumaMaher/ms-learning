<?php

namespace App\Service\PostService;

use App\Entity\Post;
use App\Entity\PostLike;
use App\Entity\User;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class PostService
{
    public function __construct(
        private EntityManagerInterface $em,
        private ParameterBagInterface $params
    ) {
    }

    /**
     * @param array<string, mixed> $data
     */
    public function create(array $data, ?UploadedFile $file): Post
    {
        $userId = $data['user_id'] ?? null;
        $title = $data['title'] ?? null;
        $content = $data['content'] ?? '';

        if (! $userId) {
            throw new \InvalidArgumentException('User ID is required');
        }

        $user = $this->em->getRepository(User::class)->find($userId);
        if (! $user) {
            throw new \InvalidArgumentException('Invalid user ID');
        }

        $mediaPaths = $this->uploadPostImages($file);
        $tags = $this->extractTags($content);

        $post = new Post();
        $post->setUser($user);
        $post->setTitle($title);
        $post->setContent($content);
        $post->setMedia(implode(',', $mediaPaths));
        $post->setTags(implode(',', $tags));
        $post->setCreatedAt(new DateTimeImmutable());

        $this->em->persist($post);
        $this->em->flush();

        return $post;
    }

    /**
     * @return array<int, array{
     *     id: int|null,
     *     title: string|null,
     *     content: string,
     *     media: string[],
     *     tags: string[],
     *     author: string|null,
     *     image: string|null,
     *     user_id: int|null,
     *     createdAt: string
     * }>
     */
    public function getAllPosts(): array
    {
        $posts = $this->em->getRepository(
            Post::class
        )->findBy([], [
            'createdAt' => 'DESC',
        ]);
        $data = [];

        foreach ($posts as $post) {
            $data[] = [
                'id' => $post->getId(),
                'title' => $post->getTitle(),
                'content' => $post->getContent(),
                'media' => explode(',', $post->getMedia() ?? ''),
                'tags' => explode(',', $post->getTags() ?? ''),
                'author' => $post->getUser()?->getUsername(),
                'image' => $post->getUser()?->getPicture(),
                'user_id' => $post->getUser()?->getId(),
                'createdAt' => $post->getCreatedAt()->format('Y-m-d H:i:s'),
            ];
        }

        return $data;
    }

    /**
     * @param array<string, mixed> $data
     *
     * @return array<string, mixed>
     */
    public function updatePost(int $id, array $data): array
    {
        $post = $this->em->getRepository(
            Post::class
        )->find($id);

        if (! $post) {
            return [
                'error' => 'Post not found',
                'code' => 404,
            ];
        }

        $title = $data['title'] ?? null;
        $content = $data['content'] ?? null;

        if (! $title || ! $content) {
            return [
                'error' => 'Title and content are required',
                'code' => 400,
            ];
        }

        $post->setTitle($title);
        $post->setContent($content);

        $this->em->flush();

        return [
            'message' => 'Post updated',
            'code' => 200,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function toggleLike(
        int $postId,
        int $userId
    ): array {
        $post = $this->em->getRepository(
            Post::class
        )->find($postId);
        if (! $post) {
            return [
                'error' => 'Post not found',
                'code' => 404,
            ];
        }

        $user = $this->em->getRepository(
            User::class
        )->find($userId);
        if (! $user) {
            return [
                'error' => 'Invalid user',
                'code' => 404,
            ];
        }

        foreach ($post->getLikes() as $like) {
            if ($like->getUser()->getId() === $user->getId()) {
                $this->em->remove($like);
                $this->em->flush();
                $likesCount = $this->em->getRepository(
                    PostLike::class
                )->count([
                    'post' => $post,
                ]);

                return [
                    'liked' => false,
                    'likesCount' => $likesCount,
                    'code' => 200,
                ];
            }
        }

        $like = new PostLike();
        $like->setPost($post);
        $like->setUser($user);

        $this->em->persist($like);
        $this->em->flush();

        $likesCount = $this->em->getRepository(PostLike::class)->count([
            'post' => $post,
        ]);

        return [
            'liked' => true,
            'likesCount' => $likesCount,
            'code' => 200,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function delete(int $postId): array
    {
        $post = $this->em->getRepository(Post::class)->find($postId);

        if (! $post) {
            return [
                'error' => 'Post not found',
                'code' => 404,
            ];
        }

        $this->em->remove($post);
        $this->em->flush();

        return [
            'message' => 'Post deleted',
            'code' => 200,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function show(Post $post): array
    {
        return [
            'id' => $post->getId(),
            'title' => $post->getTitle(),
            'content' => $post->getContent(),
            'media' => explode(',', $post->getMedia() ?? ''),
            'tags' => explode(',', $post->getTags() ?? ''),
            'author' => $post->getUser()->getUsername(),
            'comments' => array_map(
                function ($comment) {
                    return [
                        'id' => $comment->getId(),
                        'content' => $comment->getContent(),
                        'author' => $comment->getUser()->getUsername(),
                        'picture' => $comment->getUser()->getPicture(),
                        'user_id' => $comment->getUser()->getId(),
                        'createdAt' => $comment->getCreatedAt()
                            ->format('Y-m-d H:i:s'),
                    ];
                },
                $post->getComments()->toArray()
            ),
            'likes' => array_map(
                function ($like) {
                    return [
                        'id' => $like->getId(),
                        'user_id' => $like->getUser()->getId(),
                        'username' => $like->getUser()->getUsername(),
                        'picture' => $like->getUser()->getPicture(),
                    ];
                },
                $post->getLikes()->toArray()
            ),
            'createdAt' => $post->getCreatedAt()->format('Y-m-d H:i:s'),
        ];
    }

    /**
     * @return string[]
     */
    private function extractTags(string $content): array
    {
        preg_match_all('/#(\w+)/', $content, $matches);
        return array_unique($matches[1]);
    }

    /**
     * @return string[]
     */
    private function uploadPostImages(?UploadedFile $file): array
    {
        $paths = [];
        if ($file instanceof UploadedFile) {
            $uploadDir = $this->params->get('post_upload_dir');
            $filename = uniqid() . '.' . $file->guessExtension();
            $file->move($uploadDir, $filename);
            $paths[] = '/images/posts/' . $filename;
        }
        return $paths;
    }
}
