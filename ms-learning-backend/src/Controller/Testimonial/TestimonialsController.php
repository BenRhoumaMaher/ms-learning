<?php

namespace App\Controller\Testimonial;

use App\Entity\User;
use App\Entity\Testimonial;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\TestimonialRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class TestimonialsController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private TestimonialRepository $testimonialRepository
    ) {
    }

    public function getTestimonials(): JsonResponse
    {
        $testimonials = $this->testimonialRepository->findBy(
            [],
            ['createdAt' => 'DESC']
        );

        $data = [];
        foreach ($testimonials as $testimonial) {
            $user = $testimonial->getUser();
            $data[] = [
                'id' => $testimonial->getId(),
                'content' => $testimonial->getContent(),
                'createdAt' => $testimonial->getCreatedAt()->format('Y-m-d H:i:s'),
                'user' => $user ? [
                    'id' => $user->getId(),
                    'name' => $user->getUsername(),
                    'image' => $user->getPicture(),
                ] : null
            ];
        }

        return $this->json($data);
    }

    public function createTestimonial(
        Request $request,
        EntityManagerInterface $em
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['content'])) {
            return $this->json(['error' => 'Content is required'], 400);
        }

        $userId = $data['userId'] ?? null;
        if (!$userId) {
            return $this->json(['error' => 'User ID is required'], 400);
        }

        $user = $em->getRepository(User::class)->find($userId);
        if (!$user) {
            return $this->json(['error' => 'User not found'], 404);
        }

        $testimonial = new Testimonial();
        $testimonial->setContent($data['content']);
        $testimonial->setUser($user);
        $testimonial->setCreatedAt(new DateTimeImmutable());

        $em->persist($testimonial);
        $em->flush();

        return $this->json(
            [
            'id' => $testimonial->getId(),
            'content' => $testimonial->getContent(),
            'createdAt' => $testimonial->getCreatedAt()->format('Y-m-d H:i:s'),
            'user' => [
                'id' => $user->getId(),
                'name' => $user->getUsername(),
                'image' => $user->getPicture(),
            ]
            ],
            201
        );
    }
}
