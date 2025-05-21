<?php

namespace App\Handler\User;

use App\Command\User\AddUserInterestsCommand;
use App\Repository\CategoryRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
class AddUserInterestsHandler
{
    /**
     * @param UserRepository         $userRepository     Repository for user entities
     * @param CategoryRepository     $categoryRepository Repository for category entities
     * @param EntityManagerInterface $entityManager      Doctrine entity manager
     */
    public function __construct(
        private UserRepository $userRepository,
        private CategoryRepository $categoryRepository,
        private EntityManagerInterface $entityManager
    ) {
    }

    /**
     * Handle add user interests command
     *
     * Processes the addition of interest categories to a user by:
     * - Validating user existence
     * - Fetching specified categories
     * - Establishing user-category associations
     * - Persisting changes to database
     *
     * @param AddUserInterestsCommand $command Contains:
     *                                         - userId: int (required) User ID
     *                                         - categoryIds: array<int> (required) Category IDs to associate
     *
     * @throws \InvalidArgumentException When user is not found
     */
    public function __invoke(AddUserInterestsCommand $command): void
    {
        $user = $this->userRepository->find($command->userId);
        if (! $user) {
            throw new \InvalidArgumentException('User not found');
        }

        $categories = $this->categoryRepository
            ->findBy(
                [
                    'id' => $command->categoryIds,
                ]
            );
        foreach ($categories as $category) {
            $user->addInterest($category);
        }

        $this->entityManager->persist($user);
        $this->entityManager->flush();
    }
}
