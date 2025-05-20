<?php

namespace App\Repository;

use App\Entity\User;
use App\Entity\UserSubscription;
use DateTime;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<UserSubscription>
 */
class UserSubscriptionRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, UserSubscription::class);
    }

    public function findCurrentSubscription(User $user): ?UserSubscription
    {
        return $this->createQueryBuilder('us')
            ->andWhere('us.user = :user')
            ->andWhere('us.endDate >= :now OR us.status = :activeStatus')
            ->setParameter('user', $user)
            ->setParameter('now', new DateTime())
            ->setParameter('activeStatus', 'active')
            ->orderBy('us.endDate', 'DESC')
            ->setMaxResults(1)
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function findActivePlanByUserId(int $userId): ?UserSubscription
    {
        return $this->createQueryBuilder('us')
            ->join('us.user', 'u')
            ->join('us.plan', 'p')
            ->where('u.id = :userId')
            ->andWhere('us.status = :status')
            ->andWhere('us.endDate > :now')
            ->setParameter('userId', $userId)
            ->setParameter('status', 'active')
            ->setParameter('now', new DateTime())
            ->orderBy('us.endDate', 'DESC')
            ->setMaxResults(1)
            ->getQuery()
            ->getOneOrNullResult();
    }

    //    /**
    //     * @return UserSubscription[] Returns an array of UserSubscription objects
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

    //    public function findOneBySomeField($value): ?UserSubscription
    //    {
    //        return $this->createQueryBuilder('u')
    //            ->andWhere('u.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
