<?php

/**
 * This file defines the PaymentController which handles all payment-related operations
 * including course enrollments, subscriptions, and payment history for the MS-LEARNING platform.
 *
 * @category Controllers
 * @package  App\Controller\Payment
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 * @project  MS-Learning (PFE Project)
 */

namespace App\Controller\Payment;

use App\Entity\Payment;
use App\Entity\StudentCourse;
use App\Entity\User;
use App\Entity\UserSubscription;
use App\Repository\CoursesRepository;
use App\Repository\PaymentRepository;
use App\Repository\SubscriptionPlanRepository;
use App\Repository\UserRepository;
use App\Service\MailService\MailService;
use App\Service\Payment\StripePayment;
use DateTime;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

/**
 * Handles all payment operations including:
 * - Course enrollment payments
 * - Subscription management
 * - Payment history tracking
 * - Integration with Stripe payment gateway
 *
 * @category Controllers
 * @package  App\Controller\Payment
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 */
class PaymentController extends AbstractController
{
    /**
     * @param StripePayment          $stripePayment     Stripe payment service
     * @param EntityManagerInterface $entityManager     Doctrine entity manager
     * @param CoursesRepository      $coursesRepository Courses repository
     * @param UserRepository         $userRepository    Users repository
     * @param MailService            $mailService       Email notification service
     */
    public function __construct(
        private readonly StripePayment $stripePayment,
        private readonly EntityManagerInterface $entityManager,
        private readonly CoursesRepository $coursesRepository,
        private readonly UserRepository $userRepository,
        private readonly MailService $mailService,
    ) {
    }

    /**
     * Enroll in a course
     *
     * Creates a Stripe checkout session for course enrollment
     *
     * @param Request $request HTTP request containing JSON:
     *                         {
     *                         "courseId": int,
     *                         "userId": int
     *                         }
     *
     * @return JsonResponse {
     *
     *          Stripe checkout URL
     *          (optional) Error message
     *         }
     *
     * @throws \Exception On Stripe integration failure (500)
     */
    public function enroll(Request $request): Response
    {
        $data = json_decode($request->getContent(), true);
        $courseId = $data['courseId'] ?? null;
        $userId = $data['userId'] ?? null;

        // Validation
        if (! $courseId || ! $userId) {
            return $this->json(
                [
                    'error' => 'Course ID and User ID are required',
                ],
                400
            );
        }

        $course = $this->coursesRepository->find($courseId);
        $user = $this->entityManager->getRepository(User::class)->find($userId);

        if (! $course) {
            return $this->json(
                [
                    'error' => 'Course not found',
                ],
                400
            );
        }

        if (! $user) {
            return $this->json(
                [
                    'error' => 'User not found',
                ],
                400
            );
        }

        try {
            // Prepare course data
            $courseData = [
                'title' => $course->getTitle(),
                'description' => $course->getDescription(),
                'price' => (float) $course->getPrice(),
                'discount' => $course->getDiscount() !== null ? (float) $course->getDiscount() : 0.0,
                'image' => $course->getImage(),
            ];

            // Create Stripe session
            $successUrl = $this->generateUrl(
                'app_payment_success',
                [
                    'courseId' => $courseId,
                    'userId' => $userId,
                ],
                UrlGeneratorInterface::ABSOLUTE_URL
            );
            $cancelUrl = $this->generateUrl(
                'app_payment_cancel',
                [
                    'courseId' => $courseId,
                ],
                UrlGeneratorInterface::ABSOLUTE_URL
            );

            $this->stripePayment->createCourseCheckoutSession(
                $courseData,
                $successUrl,
                $cancelUrl,
                [
                    'course_id' => $courseId,
                    'user_id' => $userId,
                ]
            );

            // Create payment record (without status or session ID)
            $payment = new Payment();
            $payment->setUser($user);
            $payment->setCourse($course);
            $payment->setAmount(
                (string) $this->stripePayment->calculateFinalPrice($courseData)
            );
            $payment->setPaymentDate(new DateTime());
            $payment->setCreatedAt(new DateTimeImmutable());

            $this->entityManager->persist($payment);
            $this->entityManager->flush();

            return $this->json(
                [
                    'paymentUrl' => $this->stripePayment->getRedirectUrl(),
                ]
            );

        } catch (\Exception $e) {
            return $this->json(
                [
                    'error' => $e->getMessage(),
                ],
                500
            );
        }
    }

    /**
     * Successful payment callback
     *
     * Handles successful course payment and creates enrollment
     *
     * @param string  $courseId Course ID
     * @param Request $request  HTTP   request containing userId query parameter
     *
     * @return Response Redirect to frontend with success status
     */
    public function success(string $courseId, Request $request): Response
    {
        $course = $this->coursesRepository->find($courseId);
        $userId = $request->query->get('userId');
        $user = $this->userRepository->find($userId);

        if (! $user instanceof User || ! $course) {
            return $this->redirect('http://localhost:3000');
        }

        try {
            $studentCourse = new StudentCourse();
            $studentCourse->setUser($user);
            $studentCourse->setCurse($course);
            $studentCourse->setStatus('active');
            $studentCourse->setProgress('0.00');
            $studentCourse->setStartDate(new DateTime());
            $studentCourse->setEndDate((new DateTime())->modify('+1 year'));
            $studentCourse->setCreatedAt(new DateTimeImmutable());

            $this->entityManager->persist($studentCourse);
            $this->entityManager->flush();

            $this->mailService->sendEmail(
                $user->getEmail(),
                $user->getUsername(),
                'Course Purchase Confirmation',
                'PurchaseCourse.html',
                [
                    'username' => $user->getUsername(),
                ]
            );

        } catch (\Exception $e) {
            error_log('Enrollment creation error: ' . $e->getMessage());
        }

        return $this->redirect('http://localhost:3000/registered-courses/' . $courseId);
    }

    /**
     * Cancelled payment callback
     *
     * Handles cancelled payment and redirects with status
     *
     * @param string $courseId Course ID
     *
     * @return Response Redirect to frontend with cancelled status
     */
    public function cancel(string $courseId): Response
    {
        return $this->redirect(
            'http://localhost:3000/courses/' . $courseId . '?payment=cancelled'
        );
    }

    /**
     * Get user's purchased courses
     *
     * Retrieves all courses purchased by a user
     *
     * @param int               $userId            User ID
     * @param PaymentRepository $paymentRepository Payments repository
     *
     * @return JsonResponse Array of purchased courses with:
     *     - id
     *     - title
     *     - price
     *     - paymentDate
     *     - image
     */
    public function getUserPurchasedCourses(
        int $userId,
        PaymentRepository $paymentRepository
    ): JsonResponse {
        $payments = $paymentRepository->findCoursePurchasesByUser($userId);

        $courses = array_map(
            function ($payment) {
                $course = $payment->getCourse();
                return [
                    'id' => $course->getId(),
                    'title' => $course->getTitle(),
                    'price' => $payment->getAmount(),
                    'paymentDate' => $payment->getPaymentDate()
                        ->format('Y-m-d H:i:s'),
                    'image' => $course->getImage(),
                ];
            },
            $payments
        );

        return $this->json($courses);
    }

    /**
     * Get user's payment history
     *
     * Retrieves complete payment history including courses and subscriptions
     *
     * @param int               $userId            User ID
     * @param PaymentRepository $paymentRepository Payments repository
     *
     * @return JsonResponse Array of transactions with:
     *     - id
     *     - price
     *     - paymentDate
     *     - type (course/subscription)
     *     - item details
     */
    public function getUserPaymentHistory(
        int $userId,
        PaymentRepository $paymentRepository
    ): JsonResponse {
        $payments = $paymentRepository->findBy(
            [
                'user' => $userId,
            ],
            [
                'paymentDate' => 'DESC',
            ]
        );

        $transactions = array_map(
            function ($payment) {
                $transaction = [
                    'id' => $payment->getId(),
                    'price' => $payment->getAmount(),
                    'paymentDate' => $payment->getPaymentDate()
                        ->format('Y-m-d H:i:s'),
                    'type' => null,
                    'item' => null,
                ];

                if ($payment->getCourse()) {
                    $transaction['type'] = 'course';
                    $transaction['item'] = [
                        'id' => $payment->getCourse()->getId(),
                        'title' => $payment->getCourse()->getTitle(),
                    ];
                } elseif ($payment->getSubscriptionPlan()) {
                    $transaction['type'] = 'subscription';
                    $transaction['item'] = [
                        'id' => $payment->getSubscriptionPlan()->getId(),
                        'title' => $payment->getSubscriptionPlan()->getName(),
                    ];
                }

                return $transaction;
            },
            $payments
        );

        return $this->json($transactions);
    }

    /**
     * Subscribe to a plan
     *
     * Creates a Stripe checkout session for subscription
     *
     * @param Request                    $request        HTTP request containing JSON:
     *                                                   {
     *                                                   "planId": int,
     *                                                   "userId": int
     *                                                   }
     * @param SubscriptionPlanRepository $planRepository Subscription plans repository
     *
     * @return JsonResponse Returns a JSON response containing:
     *                      - paymentUrl: string (Stripe checkout URL)
     *                      - error: string (optional error message)
     *
     * @throws \Exception On Stripe integration failure (500)
     */
    public function subscribe(
        Request $request,
        SubscriptionPlanRepository $planRepository
    ): Response {
        $data = json_decode($request->getContent(), true);
        $planId = $data['planId'] ?? null;
        $userId = $data['userId'] ?? null;

        if (! $planId || ! $userId) {
            return $this->json(
                [
                    'error' => 'Plan ID and User ID are required',
                ],
                400
            );
        }

        $plan = $planRepository->find($planId);
        $user = $this->userRepository->find($userId);

        if (! $plan || ! $user) {
            return $this->json(
                [
                    'error' => 'Invalid user or plan',
                ],
                400
            );
        }

        try {
            $planData = [
                'name' => $plan->getName(),
                'price' => (float) $plan->getPrice(),
            ];

            $successUrl = $this->generateUrl(
                'app_subscription_success',
                [
                    'planId' => $planId,
                    'userId' => $userId,
                ],
                UrlGeneratorInterface::ABSOLUTE_URL
            );

            $cancelUrl = $this->generateUrl(
                'app_subscription_cancel',
                [
                    'planId' => $planId,
                ],
                UrlGeneratorInterface::ABSOLUTE_URL
            );

            $this->stripePayment->createSubscriptionCheckoutSession(
                $planData,
                $successUrl,
                $cancelUrl,
                [
                    'plan_id' => $planId,
                    'user_id' => $userId,
                ]
            );

            $payment = new Payment();
            $payment->setUser($user);
            $payment->setAmount($plan->getPrice());
            $payment->setSubscriptionPlan($plan);
            $payment->setPaymentDate(new DateTime());
            $payment->setCreatedAt(new DateTimeImmutable());

            $this->entityManager->persist($payment);
            $this->entityManager->flush();

            return $this->json(
                [
                    'paymentUrl' => $this->stripePayment->getRedirectUrl(),
                ]
            );

        } catch (\Exception $e) {
            return $this->json(
                [
                    'error' => $e->getMessage(),
                ],
                500
            );
        }
    }

    /**
     * Successful subscription callback
     *
     * Handles successful subscription payment and activates plan
     *
     * @param string                     $planId         Subscription plan ID
     * @param Request                    $request        HTTP request containing userId query parameter
     * @param SubscriptionPlanRepository $planRepository Subscription plans repository
     *
     * @return Response Redirect to frontend with success status
     */
    public function subscriptionSuccess(string $planId, Request $request, SubscriptionPlanRepository $planRepository): Response
    {
        $userId = $request->query->get('userId');
        $user = $this->userRepository->find($userId);
        $plan = $planRepository->find($planId);

        if (! $user || ! $plan) {
            return $this->redirect('http://localhost:3000');
        }

        try {
            $subscription = new UserSubscription();
            $subscription->setUser($user);
            $subscription->setPlan($plan);
            $subscription->setStatus('active');
            $subscription->setPaymentStatus('paid');
            $subscription->setStartDate(new DateTime());
            $subscription->setEndDate((new DateTime())->modify("+{$plan->getDuration()} days"));
            $subscription->setCreatedAt(new DateTimeImmutable());

            $this->entityManager->persist($subscription);
            $this->entityManager->flush();

            $this->mailService->sendEmail(
                $user->getEmail(),
                $user->getUsername(),
                'Subscription Activated',
                'SubscriptionConfirmation.html',
                [
                    'username' => $user->getUsername(),
                ]
            );
        } catch (\Exception $e) {
            error_log('Subscription error: ' . $e->getMessage());
        }

        return $this->redirect('http://localhost:3000');
    }

    /**
     * Cancelled subscription callback
     *
     * Handles cancelled subscription and redirects with status
     *
     * @param string $planId Subscription plan ID
     *
     * @return Response Redirect to frontend with cancelled status
     */
    public function subscriptionCancel(string $planId): Response
    {
        return $this->redirect(
            'http://localhost:3000/plans/' . $planId . '?payment=cancelled'
        );
    }
}
