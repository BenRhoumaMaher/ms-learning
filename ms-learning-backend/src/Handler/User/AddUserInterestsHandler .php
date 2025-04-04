<?php

namespace App\Handler\User;

use App\Message\Command\AddUserInterestsCommand;
use App\Repository\UserRepository;
use App\Repository\CategoryRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
class AddUserInterestsHandler
{
    public function __construct(
        private UserRepository $userRepository,
        private CategoryRepository $categoryRepository,
        private EntityManagerInterface $entityManager
    ) {
    }

    public function __invoke(AddUserInterestsCommand $command): void
    {
        $user = $this->userRepository->find($command->userId);
        if (!$user) {
            throw new \InvalidArgumentException('User not found');
        }

        $categories = $this->categoryRepository
            ->findBy(['id' => $command->categoryIds]);
        foreach ($categories as $category) {
            $user->addInterest($category);
        }

        $this->entityManager->persist($user);
        $this->entityManager->flush();
    }
}
