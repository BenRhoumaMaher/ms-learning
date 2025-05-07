<?php

namespace App\Service\Payment;

use Stripe\Stripe;
use Stripe\Checkout\Session;

class StripePayment
{
    private string $redirectUrl;

    public function __construct(string $stripeSecret)
    {
        Stripe::setApiKey($stripeSecret);
        Stripe::setApiVersion('2024-06-20');
    }

    public function createCourseCheckoutSession(
        array $courseData,
        string $successUrl,
        string $cancelUrl,
        array $metadata = []
    ): string {
        // Ensure image URL is properly formatted
        $imageUrl = $courseData['image'] ?
            'http://localhost:8080/' . ltrim($courseData['image'], '/') :
            null;

        $session = Session::create(
            [
            'line_items' => [
                [
                    'quantity' => 1,
                    'price_data' => [
                        'currency' => 'USD',
                        'product_data' => [
                            'name' => $courseData['title'],
                            'description' => $courseData['description'] ?? 'Online Course',
                        ],
                        'unit_amount' => $this->calculateFinalPrice($courseData) * 100,
                    ],
                ]
            ],
            'mode' => 'payment',
            'success_url' => $successUrl . '?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => $cancelUrl,
            'customer_email' => $metadata['user_email'] ?? null,
            'metadata' => $metadata,
            ]
        );

        $this->redirectUrl = $session->url;
        return $session->id;
    }

    public function calculateFinalPrice(array $courseData): float
    {
        $price = (float) $courseData['price'];

        if (isset($courseData['discount']) && $courseData['discount'] > 0) {
            $price = $price * (1 - ($courseData['discount'] / 100));
        }

        return $price;
    }

    public function getRedirectUrl(): string
    {
        return $this->redirectUrl;
    }

    public function createSubscriptionCheckoutSession(
        array $planData,
        string $successUrl,
        string $cancelUrl,
        array $metadata
    ): void {
        $session = Session::create(
            [
            'payment_method_types' => ['card'],
            'line_items' => [[
                'price_data' => [
                    'currency' => 'EUR',
                    'product_data' => [
                        'name' => $planData['name'],
                    ],
                    'unit_amount' => $planData['price'] * 100,
                ],
                'quantity' => 1,
            ]],
            'mode' => 'payment',
            'success_url' => $successUrl,
            'cancel_url' => $cancelUrl,
            'payment_intent_data' => [
                'metadata' => $metadata,
            ],
            ]
        );

        $this->redirectUrl = $session->url;
    }

}
