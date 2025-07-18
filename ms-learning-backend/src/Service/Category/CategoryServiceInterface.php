<?php

namespace App\Service\Category;

use App\Entity\Category;

interface CategoryServiceInterface
{
    /**
     * Retrieve all categories
     *
     * @return array<int, Category>
     */
    public function getAllCategories(): array;

    /**
     * Get a category by its ID
     */
    public function getCategoryById(int $id): Category;

    /**
     * Create a new category
     */
    public function createCategory(string $name): Category;

    /**
     * Update an existing category
     */
    public function updateCategory(Category $category, string $name): Category;

    /**
     * Delete a category
     */
    public function deleteCategory(Category $category): void;
}
