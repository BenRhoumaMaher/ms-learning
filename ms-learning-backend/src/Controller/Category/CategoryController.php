<?php

namespace App\Controller\Category;

use Symfony\Component\HttpFoundation\Request;
use App\Service\Category\CategoryServiceInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class CategoryController extends AbstractController
{
    public function __construct(
        private CategoryServiceInterface $categoryService
    ) {
    }

    public function index(): JsonResponse
    {
        $categories = $this->categoryService->getAllCategories();
        return $this->json(
            $categories,
            200,
            [],
            ['groups' => 'category:read']
        );
    }

    public function show(int $id): JsonResponse
    {
        $category = $this->categoryService->getCategoryById($id);
        return $this->json(
            $category,
            200,
            [],
            ['groups' => 'category:read']
        );
    }

    public function create(
        Request $request,
        ValidatorInterface $validator
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);
        if (!isset($data['name'])) {
            return new JsonResponse(
                ['error' => 'Category name is required'],
                400
            );
        }

        $category = $this->categoryService->createCategory($data['name']);

        return $this->json(
            $category,
            200
        );
    }

    public function update(
        int $id,
        Request $request
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);
        if (!isset($data['name'])) {
            return new JsonResponse(
                ['error' => 'Category name is required'],
                400
            );
        }

        $category = $this->categoryService->getCategoryById($id);
        $updatedCategory = $this->categoryService->updateCategory($category, $data['name']);

        return $this->json(
            $updatedCategory,
            200
        );
    }

    public function delete(
        int $id
    ): JsonResponse {
        $category = $this->categoryService->getCategoryById($id);
        $this->categoryService->deleteCategory($category);

        return new JsonResponse(
            ['message' => 'Category deleted successfully'],
            204
        );
    }
}
