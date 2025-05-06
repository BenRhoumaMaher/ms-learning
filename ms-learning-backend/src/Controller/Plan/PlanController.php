<?php

namespace App\Controller\Plan;

use DateTime;
use DateTimeImmutable;
use App\Entity\UserSubscription;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use App\Repository\SubscriptionPlanRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class PlanController extends AbstractController
{
    public function __construct(
        private SubscriptionPlanRepository $subscriptionPlanRepository,
        private EntityManagerInterface $em,
        private UserRepository $userRepository
    ) {
    }
    public function getPlans(
    ): JsonResponse {
        $plans = $this->subscriptionPlanRepository->findBy(
            ['isActive' => true]
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

        if (!$planId || !$userId) {
            return $this->json(['error' => 'Missing required parameters'], 400);
        }

        $plan = $this->subscriptionPlanRepository->find($planId);
        $user = $this->userRepository->find($userId);

        if (!$plan || !$user) {
            return $this->json(['error' => 'Invalid plan or user'], 404);
        }

        $subscription = new UserSubscription();
        $subscription->setUser($user);
        $subscription->setPlan($plan);
        $subscription->setStartDate(new DateTime());
        $duration = $plan->getDuration() ?: 30;
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
            'subscriptionId' => $subscription->getId()
            ]
        );
    }
}
