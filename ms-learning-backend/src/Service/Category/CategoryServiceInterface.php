<?php

namespace App\Service\Category;

use App\Entity\Category;

interface CategoryServiceInterface
{
    public function getAllCategories(): array;

    public function getCategoryById(int $id): Category;

    public function createCategory(string $name): Category;

    public function updateCategory(Category $category, string $name): Category;

    public function deleteCategory(Category $category): void;
}
