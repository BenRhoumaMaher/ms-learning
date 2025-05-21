<?php

namespace App\Repository;

use App\Entity\ForumPost;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<ForumPost>
 */
class ForumPostRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ForumPost::class);
    }

    /**
     * Find Forum Posts by Instructor ID
     *
     * Retrieves forum posts created by a specific instructor,
     * ordered by creation date (newest first).
     *
     * @param int $userId The ID of the instructor/user
     *
     * @return ForumPost[] Array of ForumPost entities
     */
    public function findByInstructorId(int $userId): array
    {
        return $this->createQueryBuilder('fp')
            ->andWhere('fp.user = :userId')
            ->setParameter('userId', $userId)
            ->orderBy('fp.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    //    /**
    //     * @return ForumPost[] Returns an array of ForumPost objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('f')
    //            ->andWhere('f.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('f.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?ForumPost
    //    {
    //        return $this->createQueryBuilder('f')
    //            ->andWhere('f.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
