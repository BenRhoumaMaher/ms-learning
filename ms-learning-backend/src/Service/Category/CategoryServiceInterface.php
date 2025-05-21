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
     *
     * @param int $id
     * 
     * @return Category
     */
    public function getCategoryById(int $id): Category;

    /**
     * Create a new category
     *
     * @param string $name
     * 
     * @return Category
     */
    public function createCategory(string $name): Category;

    /**
     * Update an existing category
     *
     * @param Category $category
     * @param string   $name
     * 
     * @return Category
     */
    public function updateCategory(Category $category, string $name): Category;

    /**
     * Delete a category
     *
     * @param Category $category
     * 
     * @return void
     */
    public function deleteCategory(Category $category): void;
}
