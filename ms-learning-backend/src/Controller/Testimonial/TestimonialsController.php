<?php

/**
 * This file defines the TestimonialsController which handles all testimonial-related operations
 * including creating and retrieving user testimonials for the MS-LEARNING platform.
 *
 * @category Controllers
 * @package  App\Controller\Testimonial
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 * @project  MS-Learning (PFE Project)
 */

namespace App\Controller\Testimonial;

use App\Entity\Testimonial;
use App\Entity\User;
use App\Repository\TestimonialRepository;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

/**
 * Handles all testimonial operations including:
 * - Retrieving testimonials with user information
 * - Creating new testimonials
 *
 * @category Controllers
 * @package  App\Controller\Testimonial
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 */
class TestimonialsController extends AbstractController
{
    /**
     * @param EntityManagerInterface $entityManager         Doctrine entity manager
     * @param TestimonialRepository  $testimonialRepository Testimonials repository
     */
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly TestimonialRepository $testimonialRepository
    ) {
    }

    /**
     * Get all testimonials
     *
     * Retrieves a list of all testimonials sorted by creation date (newest first)
     * including associated user information.
     *
     * @return JsonResponse Array of testimonial objects containing:
     *     - id: Testimonial ID
     *     - content: Testimonial text content
     *     - createdAt: Creation date (Y-m-d H:i:s format)
     *     - user: {
     *         - id: User ID
     *         - name: Username
     *         - image: User profile picture
     *       } or null if user not found
     */
    public function getTestimonials(): JsonResponse
    {
        $testimonials = $this->testimonialRepository->findBy(
            [],
            [
                'createdAt' => 'DESC',
            ]
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
                ] : null,
            ];
        }

        return $this->json($data);
    }

    /**
     * Create a new testimonial
     *
     * Creates and stores a new testimonial with user association
     *
     * @param Request                $request HTTP request containing JSON:
     *                                        {
     *                                        "content": string,
     *                                        "userId": int
     *                                        }
     *
     * @return JsonResponse {
     *     - id: Created testimonial ID
     *     - content: Testimonial content
     *     - createdAt: Creation date (Y-m-d H:i:s format)
     *     - user: {
     *         - id: User ID
     *         - name: Username
     *         - image: User profile picture
     *       }
     *     - error: (optional) Error message
     * }
     *
     * @throws \InvalidArgumentException If content is missing (400)
     * @throws \InvalidArgumentException If user ID is missing (400)
     * @throws \InvalidArgumentException If user not found (404)
     */
    public function createTestimonial(
        Request $request,
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        if (! isset($data['content'])) {
            return $this->json(
                [
                    'error' => 'Content is required',
                ],
                400
            );
        }

        $userId = $data['userId'] ?? null;
        if (! $userId) {
            return $this->json(
                [
                    'error' => 'User ID is required',
                ],
                400
            );
        }

        $user = $this->entityManager->getRepository(User::class)->find($userId);
        if (! $user) {
            return $this->json(
                [
                    'error' => 'User not found',
                ],
                404
            );
        }

        $testimonial = new Testimonial();
        $testimonial->setContent($data['content']);
        $testimonial->setUser($user);
        $testimonial->setCreatedAt(new DateTimeImmutable());

        $this->entityManager->persist($testimonial);
        $this->entityManager->flush();

        return $this->json(
            [
                'id' => $testimonial->getId(),
                'content' => $testimonial->getContent(),
                'createdAt' => $testimonial->getCreatedAt()->format('Y-m-d H:i:s'),
                'user' => [
                    'id' => $user->getId(),
                    'name' => $user->getUsername(),
                    'image' => $user->getPicture(),
                ],
            ],
            201
        );
    }
}
