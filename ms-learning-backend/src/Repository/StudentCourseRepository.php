<?php

namespace App\Repository;

use App\Entity\Lesson;
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
        // Get course information as before
        $qb = $this->createQueryBuilder('sc')
            ->join('sc.curse', 'c')
            ->join('sc.user', 'u')
            ->where('u.id = :userId')
            ->setParameter('userId', $userId)
            ->select(
                'sc.id AS enrollmentId, c.id AS id, 
            c.title AS title, c.image AS image'
            );

        $results = $qb->getQuery()->getArrayResult();

        $titles = array_column($results, 'title');
        $courseImages = array_column($results, 'image');
        $ids = array_column($results, 'id');
        $enrollmentIds = array_column($results, 'enrollmentId');

        // Get live lessons for these courses
        $liveLessons = [];
        if (! empty($ids)) {
            $em = $this->getEntityManager();
            $lessonRepo = $em->getRepository(Lesson::class);

            $liveLessons = $lessonRepo->createQueryBuilder('l')
                ->where('l.course IN (:courseIds)')
                ->andWhere('l.type = :type')
                ->setParameter('courseIds', $ids)
                ->setParameter('type', 'live')
                ->select(
                    'l.id',
                    'l.title',
                    'l.content',
                    'l.type',
                    'l.videoUrl',
                    'l.liveStartTime',
                    'l.liveEndTime',
                    'l.duration',
                    'l.position',
                    'IDENTITY(l.course) AS course_id'
                )
                ->getQuery()
                ->getArrayResult();
        }

        return [
            'titles' => $titles,
            'ids' => $ids,
            'enrollmentIds' => $enrollmentIds,
            'courseImages' => $courseImages,
            'liveLessons' => $liveLessons,
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
