<?php

namespace App\Repository;

use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<User>
 */
class UserRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, User::class);
    }

    /**
     * Add User
     *
     * Persists a user entity to the database with optional immediate flush.
     *
     * @param User $user  The user entity to persist
     * @param bool $flush Whether to immediately flush to database (default: false)
     */
    public function add(User $user, bool $flush = false): void
    {
        $this->getEntityManager()->persist($user);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    /**
     * Find Instructors
     *
     * Retrieves all users with ROLE_INSTRUCTOR role.
     *
     * @return User[] Array of instructor users
     */
    public function findInstructors(): array
    {
        return $this->createQueryBuilder('u')
            ->where('u.roles LIKE :role')
            ->setParameter('role', '%"ROLE_INSTRUCTOR"%')
            ->getQuery()
            ->getResult();
    }

    /**
     * Find By Role
     *
     * Retrieves all users with a specific role.
     *
     * @param string $role The role to search for (e.g., 'ROLE_INSTRUCTOR')
     *
     * @return User[] Array of users with the specified role
     */
    public function findByRole(string $role): array
    {
        return $this->createQueryBuilder('u')
            ->andWhere('u.roles LIKE :role')
            ->setParameter('role', '%"'.$role.'"%')
            ->getQuery()
            ->getResult();
    }

    /**
     * Find Suggested Users
     *
     * Retrieves users to suggest for following, excluding:
     * - The current user
     * - Users already followed by the current user
     *
     * @param User $currentUser The user to get suggestions for
     *
     * @return User[] Array of suggested users to follow
     */
    public function findSuggestedUsers(
        User $currentUser
    ): array {
        $qb = $this->createQueryBuilder('u')
            ->where('u != :current')
            ->setParameter('current', $currentUser);

        $followedIds = $currentUser->getFollowing()
            ->map(fn ($u) => $u->getId())->toArray();

        if (! empty($followedIds)) {
            $qb->andWhere($qb->expr()->notIn('u.id', ':excluded'))
                ->setParameter('excluded', $followedIds);
        }

        return $qb->getQuery()->getResult();
    }

    //    /**
    //     * @return User[] Returns an array of User objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('u')
    //            ->andWhere('u.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('u.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?User
    //    {
    //        return $this->createQueryBuilder('u')
    //            ->andWhere('u.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
