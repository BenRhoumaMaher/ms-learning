<?php

namespace App\Repository;

use App\Entity\Payment;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Payment>
 */
class PaymentRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Payment::class);
    }

    /**
     * Find Course Purchases By User
     *
     * Retrieves all course purchases (non-subscription) for a specific user,
     * ordered by payment date (newest first).
     *
     * @param int $userId The user ID
     *
     * @return Payment[] Array of payment entities for course purchases
     */
    public function findCoursePurchasesByUser(int $userId)
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.user = :userId')
            ->andWhere('p.SubscriptionPlan IS NULL')
            ->andWhere('p.course IS NOT NULL')
            ->setParameter('userId', $userId)
            ->orderBy('p.paymentDate', 'DESC')
            ->getQuery()
            ->getResult();
    }

    //    /**
    //     * @return Payment[] Returns an array of Payment objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('p')
    //            ->andWhere('p.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('p.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Payment
    //    {
    //        return $this->createQueryBuilder('p')
    //            ->andWhere('p.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
