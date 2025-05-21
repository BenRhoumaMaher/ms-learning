<?php

namespace App\Repository;

use App\Entity\Courses;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Courses>
 */
class CoursesRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Courses::class);
    }

    /**
     * Find Course IDs by Instructor
     *
     * Retrieves an array of course IDs taught by a specific instructor.
     *
     * @param int $instructorId The ID of the instructor
     *
     * @return array Array of course IDs
     */
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

    /**
     * Find Course Titles by Instructor
     *
     * Retrieves an array of course titles taught by a specific instructor.
     *
     * @param int $instructorId The ID of the instructor
     *
     * @return array Array of course titles
     */
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
