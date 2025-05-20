<?php

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

class PlanController extends AbstractController
{
    public function __construct(
        private SubscriptionPlanRepository $subscriptionPlanRepository,
        private EntityManagerInterface $em,
        private UserRepository $userRepository,
        private UserSubscriptionRepository $userSubscriptionRepository
    ) {
    }

    public function getPlans(
    ): JsonResponse {
        $plans = $this->subscriptionPlanRepository->findBy(
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
            return $this->json([
                'error' => 'Missing required parameters',
            ], 400);
        }

        $plan = $this->subscriptionPlanRepository->find($planId);
        $user = $this->userRepository->find($userId);

        if (! $plan || ! $user) {
            return $this->json([
                'error' => 'Invalid plan or user',
            ], 404);
        }

        $subscription = new UserSubscription();
        $subscription->setUser($user);
        $subscription->setPlan($plan);
        $subscription->setStartDate(new DateTime());
        $duration = $plan->getDuration() ?: 365;
        $endDate = (new DateTime())->modify("+{$duration} days");
        $subscription->setEndDate($endDate);
        $subscription->setCreatedAt(new DateTimeImmutable());

        if ($plan->getPrice() > 0) {
            $subscription->setStatus('active');
            $subscription->setPaymentStatus('pending');
        } else {
            $subscription->setStatus('active');
            $subscription->setPaymentStatus('free');
        }

        $this->em->persist($subscription);
        $this->em->flush();

        return $this->json(
            [
                'success' => true,
                'subscriptionId' => $subscription->getId(),
            ]
        );
    }

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
            ->userSubscriptionRepository->findCurrentSubscription($user);

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
