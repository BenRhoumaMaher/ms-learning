<?php

namespace App\Repository;

use App\Entity\Lesson;
use DateTime;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Lesson>
 */
class LessonRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Lesson::class);
    }

    /**
     * Find Latest Live Lesson For User
     *
     * Retrieves the next upcoming live lesson for a specific user.
     *
     * @param int $id The user ID
     *
     * @return Lesson|null The upcoming live lesson or null if none found
     */
    public function findLatestLiveLessonForUser(int $id): ?Lesson
    {
        return $this->createQueryBuilder('l')
            ->where('l.user = :id')
            ->andWhere('l.liveStartTime > :now OR l.liveEndTime > :now')
            ->setParameter('now', new DateTime())
            ->setParameter('id', $id)
            ->orderBy('l.liveStartTime', 'ASC')
            ->setMaxResults(1)
            ->getQuery()
            ->getOneOrNullResult();
    }

    /**
     * Find Latest Live Lessons
     *
     * Retrieves a list of upcoming live lessons, ordered by start time.
     *
     * @param int $maxResults Maximum number of results to return (default: 5)
     *
     * @return Lesson[] Array of upcoming live lessons
     */
    public function findLatestLiveLessons(int $maxResults = 5): array
    {
        return $this->createQueryBuilder('l')
            ->where('l.liveStartTime > :now OR l.liveEndTime > :now')
            ->setParameter('now', new DateTime())
            ->orderBy('l.liveStartTime', 'DESC')
            ->setMaxResults($maxResults)
            ->getQuery()
            ->getResult();
    }

    /**
     * Find User Live Sessions
     *
     * Retrieves all upcoming live sessions for a specific user.
     *
     * @param int $userId The user ID
     *
     * @return Lesson[] Array of upcoming live lessons
     */
    public function findUserLiveSessions(int $userId): array
    {
        return $this->createQueryBuilder('l')
            ->where('l.user = :userId')
            ->andWhere('l.type = :type')
            ->andWhere('l.liveStartTime > :now')
            ->setParameter('userId', $userId)
            ->setParameter('type', 'live')
            ->setParameter('now', new DateTime())
            ->orderBy('l.liveStartTime', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Find User Lessons Without Resources
     *
     * Retrieves lessons belonging to a user that have no resources attached.
     *
     * @param int $userId The user ID
     *
     * @return Lesson[] Array of lessons without resources
     */
    public function findUserLessonsNoRessources(int $userId): array
    {
        return $this->createQueryBuilder('l')
            ->where('l.user = :userId')
            ->andWhere('l.ressources IS NULL OR l.ressources = :empty')
            ->setParameter('userId', $userId)
            ->setParameter('empty', '')
            ->getQuery()
            ->getResult();
    }

    //    /**
    //     * @return Lesson[] Returns an array of Lesson objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('l')
    //            ->andWhere('l.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('l.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Lesson
    //    {
    //        return $this->createQueryBuilder('l')
    //            ->andWhere('l.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
