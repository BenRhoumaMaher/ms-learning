<?php

namespace App\Repository;

use App\Entity\User;
use App\Entity\Courses;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;

/**
 * @extends ServiceEntityRepository<Courses>
 */
class CoursesRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Courses::class);
    }

    public function findCourseIdsByInstructor(int $instructorId): array
    {
        return $this->createQueryBuilder('c')
            ->select('c.id')
            ->join('c.enrollments', 'u')
            ->where('u.id = :instructorId')
            ->setParameter('instructorId', $instructorId)
            ->getQuery()
            ->getSingleColumnResult();
    }

    public function findCourseTitlesByInstructor(int $instructorId): array
    {
        return $this->createQueryBuilder('c')
            ->select('c.title')
            ->join('c.enrollments', 'u')
            ->where('u.id = :instructorId')
            ->setParameter('instructorId', $instructorId)
            ->getQuery()
            ->getSingleColumnResult();
    }

    //    /**
    //     * @return Courses[] Returns an array of Courses objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('c')
    //            ->andWhere('c.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('c.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }



    //    public function findOneBySomeField($value): ?Courses
    //    {
    //        return $this->createQueryBuilder('c')
    //            ->andWhere('c.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
