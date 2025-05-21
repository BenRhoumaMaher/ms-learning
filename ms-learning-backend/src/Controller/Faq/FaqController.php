<?php

/**
 * This file defines the FaqController which handles
 * FAQ (Frequently Asked Questions) operations for the MS-LEARNING application.
 * It provides access to FAQ entries in the system.
 *
 * @category Controllers
 * @package  App\Controller\Faq
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 * @project  MS-Learning (PFE Project)
 */

namespace App\Controller\Faq;

use App\Repository\FaqRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * Handles retrieval of FAQ entries from the database.
 * Returns FAQs sorted by creation date in descending order.
 *
 * @category Controllers
 * @package  App\Controller\Faq
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 */
class FaqController extends AbstractController
{
    /**
     * Get all FAQs
     *
     * Retrieves all FAQ entries sorted by creation date (newest first).
     * Returns an array of FAQ items with id, question, answer and creation date.
     *
     * @param FaqRepository $faqRepository Repository for FAQ entities
     *
     * @return JsonResponse Array of FAQ items in format:
     * [
     *     {
     *         'id': int,
     *         'question': string,
     *         'answer': string,
     *         'createdAt': string (Y-m-d H:i:s format)
     *     },
     *     ...
     * ]
     */
    public function index(
        FaqRepository $faqRepository
    ): JsonResponse {
        $faqs = $faqRepository->findBy(
            [],
            [
                'createdAt' => 'DESC',
            ]
        );

        $data = [];
        foreach ($faqs as $faq) {
            $data[] = [
                'id' => $faq->getId(),
                'question' => $faq->getQuestion(),
                'answer' => $faq->getAnswer(),
                'createdAt' => $faq->getCreatedAt()->format('Y-m-d H:i:s'),
            ];
        }

        return $this->json($data);
    }
}
