<?php

namespace App\Service\Category;

use App\Entity\Category;
use App\Repository\CategoryRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class CategoryService implements CategoryServiceInterface
{
    /**
     * @param EntityManagerInterface $entityManager      Doctrine's entity manager
     * @param CategoryRepository     $categoryRepository Repository for category entities
     */
    public function __construct(
        private EntityManagerInterface $entityManager,
        private CategoryRepository $categoryRepository
    ) {
    }

    /**
     * Retrieve all categories
     *
     * @return array<int, Category> List of all category entities
     */
    public function getAllCategories(): array
    {
        return $this->categoryRepository->findAll();
    }

    /**
     * Find a category by ID
     *
     * @param int $id Category ID
     *
     * @return Category The found category
     *
     * @throws NotFoundHttpException When category is not found
     */
    public function getCategoryById(int $id): Category
    {
        $category = $this->categoryRepository->find($id);
        if (! $category) {
            throw new NotFoundHttpException('Category not found');
        }
        return $category;
    }

    /**
     * Create a new category
     *
     * @param string $name Name of the new category
     *
     * @return Category The newly created category
     */
    public function createCategory(string $name): Category
    {
        $category = new Category();
        $category->setName($name);

        $this->entityManager->persist($category);
        $this->entityManager->flush();

        return $category;
    }

    /**
     * Update an existing category
     *
     * @param Category $category The category to update
     * @param string   $name     The new name
     *
     * @return Category The updated category
     */
    public function updateCategory(Category $category, string $name): Category
    {
        $category->setName($name);
        $this->entityManager->flush();

        return $category;
    }

    /**
     * Delete a category
     *
     * @param Category $category The category to delete
     */
    public function deleteCategory(Category $category): void
    {
        $this->entityManager->remove($category);
        $this->entityManager->flush();
    }
}
