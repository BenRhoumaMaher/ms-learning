<?php

/**
 * This file defines the PlanController which handles all subscription
 * plan operations
 * including plan listing, subscription management, and current subscription status
 * for the MS-LEARNING platform.
 *
 * @category Controllers
 * @package  App\Controller\Plan
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 * @project  MS-Learning (PFE Project)
 */

namespace App\Controller\Plan;

use App\Entity\UserSubscription;
use App\Repository\SubscriptionPlanRepository;
use App\Repository\UserRepository;
use App\Repository\UserSubscriptionRepository;
use DateTime;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

/**
 * Handles all subscription plan operations including:
 * - Listing available subscription plans
 * - Subscribing users to plans
 * - Retrieving current user subscriptions
 *
 * @category Controllers
 * @package  App\Controller\Plan
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 */
class PlanController extends AbstractController
{
    /**
     * @param SubscriptionPlanRepository $subPlanRepo    Subscription plans
     *                                                   repository
     * @param EntityManagerInterface     $em             Doctrine entity manager
     * @param UserRepository             $userRepository Users repository
     * @param UserSubscriptionRepository $userSubRepo    User subscriptions
     *                                                   repository
     */
    public function __construct(
        private readonly SubscriptionPlanRepository $subPlanRepo,
        private readonly EntityManagerInterface $em,
        private readonly UserRepository $userRepository,
        private readonly UserSubscriptionRepository $userSubRepo
    ) {
    }

    /**
     * Get all active subscription plans
     *
     * Retrieves a list of all active subscription plans with their details
     *
     * @return JsonResponse Array of plan objects containing:
     *     - id
     *     - name
     *     - price
     *     - duration (in days)
     *     - features array
     */
    public function getPlans(
    ): JsonResponse {
        $plans = $this->subPlanRepo->findBy(
            [
                'isActive' => true,
            ]
        );

        $data = [];
        foreach ($plans as $plan) {
            $data[] = [
                'id' => $plan->getId(),
                'name' => $plan->getName(),
                'price' => $plan->getPrice(),
                'duration' => $plan->getDuration(),
                'features' => $plan->getFeatures(),
            ];
        }

        return $this->json($data);
    }

    /**
     * Subscribe a user to a plan.
     *
     * @param Request $request HTTP request containing JSON:
     *                         {
     *                         "planId": int,
     *                         "userId": int
     *                         }
     *
     * @return JsonResponse Returns JSON with keys:
     *                      - success: bool Whether subscription was successful
     *                      - subscriptionId: int ID of created subscription
     *                      - error: string (optional) Error message
     *
     * @throws \InvalidArgumentException If required parameters are missing (400)
     * @throws \InvalidArgumentException If plan or user not found (404)
     */
    public function subscribe(
        Request $request,
    ): JsonResponse {
        $data = json_decode(
            $request->getContent(),
            true
        );
        $planId = $data['planId'] ?? null;
        $userId = $data['userId'] ?? null;

        if (! $planId || ! $userId) {
            return $this->json(
                [
                    'error' => 'Missing required parameters',
                ],
                400
            );
        }

        $plan = $this->subPlanRepo->find($planId);
        $user = $this->userRepository->find($userId);

        if (! $plan || ! $user) {
            return $this->json(
                [
                    'error' => 'Invalid plan or user',
                ],
                404
            );
        }

        $subscription = new UserSubscription();
        $subscription->setUser($user);
        $subscription->setPlan($plan);
        $subscription->setStartDate(new DateTime());
        $duration = $plan->getDuration() ?: 365;
        $endDate = (new DateTime())->modify("+{$duration} days");
        $subscription->setEndDate($endDate);
        $subscription->setCreatedAt(new DateTimeImmutable());

        $subscription->setStatus('active');
        $subscription->setPaymentStatus($plan->getPrice() > 0 ? 'pending' : 'free');

        $this->em->persist($subscription);
        $this->em->flush();

        return $this->json(
            [
                'success' => true,
                'subscriptionId' => $subscription->getId(),
            ]
        );
    }

    /**
     * Get user's current subscription.
     *
     * @param int $userId User ID to check
     *
     * @return JsonResponse Returns JSON with keys:
     *                      - plan: string Plan name
     *                      - price: float Plan price
     *                      - endDate: string Subscription end date (m/d/Y format)
     *                      - status: string Subscription status
     *                      - features: array Plan features
     *                      - message: string (optional) Information message
     *                      - error: string (optional) Error message
     *
     * @throws \InvalidArgumentException If user not found (404)
     */
    public function getCurrentSubscription(
        int $userId
    ): JsonResponse {
        $user = $this->userRepository->find($userId);

        if (! $user) {
            return new JsonResponse(
                [
                    'error' => 'User not found',
                ],
                404
            );
        }

        $subscription = $this
            ->userSubRepo->findCurrentSubscription($user);

        if (! $subscription) {
            return new JsonResponse(
                [
                    'message' => 'No active subscription found',
                ],
                404
            );
        }

        return $this->json(
            [
                'plan' => $subscription->getPlan() ? $subscription
                    ->getPlan()->getName() : null,
                'price' => $subscription->getPlan() ? $subscription
                    ->getPlan()->getPrice() : null,
                'endDate' => $subscription->getEndDate() ? $subscription
                    ->getEndDate()->format('m/d/Y') : null,
                'status' => $subscription->getStatus(),
                'features' => $subscription->getPlan() ? $subscription
                    ->getPlan()->getFeatures() : null,
            ]
        );
    }
}
