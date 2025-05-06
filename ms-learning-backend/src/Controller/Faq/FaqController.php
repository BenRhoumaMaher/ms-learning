<?php

namespace App\Controller\Faq;

use App\Repository\FaqRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class FaqController extends AbstractController
{
    public function index(
        FaqRepository $faqRepository
    ): JsonResponse {
        $faqs = $faqRepository->findBy(
            [],
            ['createdAt' => 'DESC']
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
