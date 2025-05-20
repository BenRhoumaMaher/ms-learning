<?php

namespace App\Service\ForumPostService;

use App\Entity\ForumPost;
use App\Entity\User;
use App\Repository\CategoryRepository;
use App\Repository\ForumPostRepository;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\Request;

class ForumPostService
{
    public function __construct(
        private ForumPostRepository $forumPostRepository,
        private EntityManagerInterface $em,
        private CategoryRepository $categoryRepo,
        private ParameterBagInterface $params
    ) {
    }

    public function getAllPosts(): array
    {
        $posts = $this->forumPostRepository->findBy(
            [],
            [
                'createdAt' => 'DESC',
            ]
        );

        return array_map(
            function ($post) {
                return [
                    'id' => $post->getId(),
                    'title' => $post->getTitle(),
                    'content' => $post->getContent(),
                    'image' => $post->getImage(),
                    'views' => $post->getViews(),
                    'createdAt' => $post->getCreatedAt()?->format('Y-m-d H:i:s'),
                    'user' => $post->getUser() ? [
                        'id' => $post->getUser()->getId(),
                        'username' => $post->getUser()->getUsername(),
                        'picture' => $post->getUser()->getPicture(),
                    ] : null,
                    'category' => array_map(
                        fn ($cat) => $cat->getName(),
                        $post->getCategory()->toArray()
                    ),
                ];
            },
            $posts
        );
    }

    public function createPost(Request $request): ForumPost
    {
        $jsonData = $request->request->get('data');
        $decoded = json_decode($jsonData, true);

        $title = $decoded['title'] ?? null;
        $content = $decoded['content'] ?? '';
        $userId = $decoded['user_id'] ?? null;
        $categoryIds = $decoded['categories'] ?? [];

        if (! $userId) {
            throw new \InvalidArgumentException('User ID is required');
        }

        $user = $this->em->getRepository(User::class)->find($userId);
        if (! $user) {
            throw new \InvalidArgumentException('Invalid user ID');
        }

        if (! in_array('ROLE_INSTRUCTOR', $user->getRoles(), true)) {
            throw new \RuntimeException('Access denied. Instructor role required.');
        }

        $file = $request->files->get('file');
        $image = $this->uploadForumPostImage($file);
        $tags = $this->extractTags($content);

        $post = new ForumPost();
        $post->setUser($user);
        $post->setTitle($title);
        $post->setContent($content);
        $post->setImage(implode(',', $image));
        $post->setTags(implode(',', $tags));
        $post->setCreatedAt(new DateTimeImmutable());

        foreach ($categoryIds as $categoryId) {
            $category = $this->categoryRepo->find($categoryId);
            if ($category) {
                $post->addCategory($category);
            }
        }

        $this->em->persist($post);
        $this->em->flush();

        return $post;
    }

    public function getPostDetailsAndIncrementViews(int $id): array
    {
        $post = $this->forumPostRepository->find($id);

        if (! $post) {
            throw new \InvalidArgumentException('Post not found');
        }

        $post->incrementViews();
        $this->em->flush();

        return [
            'id' => $post->getId(),
            'title' => $post->getTitle(),
            'content' => $post->getContent(),
            'createdAt' => $post->getCreatedAt()->format('Y-m-d H:i:s'),
            'tags' => $post->getTags(),
            'image' => $post->getImage(),
            'views' => $post->getViews(),
            'categories' => array_map(
                fn ($c) => $c->getName(),
                $post->getCategory()->toArray()
            ),
        ];
    }

    public function getSiblingPosts(int $id): array
    {
        $posts = $this->forumPostRepository->findBy(
            [],
            [
                'createdAt' => 'ASC',
            ]
        );
        $postIds = array_map(fn ($p) => $p->getId(), $posts);
        $index = array_search($id, $postIds);

        if ($index === false) {
            throw new \InvalidArgumentException('Post not found in ordered list');
        }

        return [
            'previous' => $index > 0 ? $posts[$index - 1]->getId() : null,
            'next' => $index < count(
                $posts
            ) - 1 ? $posts[$index + 1]->getId() : null,
            'previoustitle' => $index > 0 ? $posts[$index - 1]->getTitle() : null,
            'nexttitle' => $index < count(
                $posts
            ) - 1 ? $posts[$index + 1]->getTitle() : null,
        ];
    }

    private function extractTags(string $content): array
    {
        preg_match_all('/#(\w+)/', $content, $matches);
        return array_unique($matches[1]);
    }

    private function uploadForumPostImage(?UploadedFile $file): array
    {
        $uploadedPaths = [];

        if ($file instanceof UploadedFile) {
            $filename = uniqid() . '.' . $file->guessExtension();
            $uploadDir = $this->params->get('forum_upload_dir');
            $file->move($uploadDir, $filename);
            $uploadedPaths[] = '/images/forum/' . $filename;
        }

        return $uploadedPaths;
    }
}
