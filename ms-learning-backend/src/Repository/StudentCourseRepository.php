<?php

namespace App\Repository;

use App\Entity\StudentCourse;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<StudentCourse>
 */
class StudentCourseRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, StudentCourse::class);
    }

    public function findCourseTitlesByUserId(int $userId): array
    {
        $qb = $this->createQueryBuilder('sc')
            ->join('sc.curse', 'c')
            ->join('sc.user', 'u')
            ->where('u.id = :userId')
            ->setParameter('userId', $userId)
            ->select('c.id AS id, c.title AS title');

        $results = $qb->getQuery()->getArrayResult();

        $titles = array_column($results, 'title');
        $ids = array_column($results, 'id');

        return [
            'titles' => $titles,
            'ids' => $ids
        ];
    }

    public function findTrendingCourses(int $limit = 6): array
    {
        return $this->createQueryBuilder('sc')
            ->select(
                'c.id, c.title, c.image, c.description, c.price, 
                 COUNT(sc.id) AS enrollCount, 
                 u.username as instructor_username'
            )
            ->join('sc.curse', 'c')
            ->join('c.modules', 'm')
            ->join('m.user', 'u')
            ->groupBy('c.id, u.id')
            ->orderBy('enrollCount', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }

    //    /**
    //     * @return StudentCourse[] Returns an array of StudentCourse objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('s')
    //            ->andWhere('s.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('s.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?StudentCourse
    //    {
    //        return $this->createQueryBuilder('s')
    //            ->andWhere('s.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
