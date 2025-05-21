<?php

/**
 * This file handles all category-related operations for the MS-LEARNING application.
 * It manages CRUD operations for course categories
 * including creation, reading, updating, and deletion.
 *
 * @category Controllers
 * @package  App\Controller\Category
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 * @project  MS-Learning (PFE Project)
 */

namespace App\Controller\Category;

use App\Service\Category\CategoryServiceInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Validator\Validator\ValidatorInterface;

/**
 * Handles all category management operations including:
 * - Listing all categories
 * - Displaying single category details
 * - Creating new categories
 * - Updating existing categories
 * - Deleting categories
 *
 * @category Controllers
 * @package  App\Controller\Category
 * @author   Maher Ben Rhouma <maherbenrhoumaaa@gmail.com>
 * @license  No license (Personal project)
 * @link     https://github.com/BenRhoumaMaher/ms-learning
 */
class CategoryController extends AbstractController
{
    /**
     * @param CategoryServiceInterface $categoryService The category
     *                                                  service implementation
     */
    public function __construct(
        private readonly CategoryServiceInterface $categoryService
    ) {
    }

    /**
     * Lists all categories
     *
     * Retrieves and returns a JSON representation of all categories in the system
     *
     * @return JsonResponse List of categories with 'category:read'
     *                      serialization group
     */
    public function index(): JsonResponse
    {
        $categories = $this->categoryService->getAllCategories();
        return $this->json(
            $categories,
            200,
            [],
            [
                'groups' => 'category:read',
            ]
        );
    }

    /**
     * Displays a single category
     *
     * Retrieves and returns details of a specific category by its ID
     *
     * @param int $id The ID of the category to retrieve
     *
     * @return JsonResponse Category details with 'category:read' serialization group
     */
    public function show(int $id): JsonResponse
    {
        $category = $this->categoryService->getCategoryById($id);
        return $this->json(
            $category,
            200,
            [],
            [
                'groups' => 'category:read',
            ]
        );
    }

    /**
     * Creates a new category
     *
     * Processes category creation requests and validates required fields
     *
     * @param Request            $request   The HTTP request containing category data
     * @param ValidatorInterface $validator The validator service
     *
     * @return JsonResponse The created category or validation errors
     *
     * @throws \InvalidArgumentException If required name field is missing
     */
    public function create(
        Request $request,
        ValidatorInterface $validator
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);
        if (! isset($data['name'])) {
            return new JsonResponse(
                [
                    'error' => 'Category name is required',
                ],
                400
            );
        }

        $category = $this->categoryService->createCategory($data['name']);

        return $this->json(
            $category,
            200
        );
    }

    /**
     * Updates an existing category
     *
     * Processes category update requests and validates required fields
     *
     * @param int     $id      The ID of the
     *                         category to update
     * @param Request $request The HTTP request containing updated category data
     *
     * @return JsonResponse The updated category or validation errors
     *
     * @throws \InvalidArgumentException If required name field is missing
     */
    public function update(
        int $id,
        Request $request
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);
        if (! isset($data['name'])) {
            return new JsonResponse(
                [
                    'error' => 'Category name is required',
                ],
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

    /**
     * Deletes a category
     *
     * Processes category deletion requests
     *
     * @param int $id The ID of the category to delete
     *
     * @return JsonResponse Success message with HTTP 204 status
     */
    public function delete(
        int $id
    ): JsonResponse {
        $category = $this->categoryService->getCategoryById($id);
        $this->categoryService->deleteCategory($category);

        return new JsonResponse(
            [
                'message' => 'Category deleted successfully',
            ],
            204
        );
    }
}
