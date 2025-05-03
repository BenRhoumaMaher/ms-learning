<?php

namespace App\Repository;

use App\Entity\QuizScore;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<QuizScore>
 */
class QuizScoreRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, QuizScore::class);
    }

    public function saveScore(QuizScore $score): void
    {
        $this->getEntityManager()->persist($score);
        $this->getEntityManager()->flush();
    }

    public function getQuizStatistics(int $quizId): array
    {
        return $this->createQueryBuilder('s')
            ->select(
                [
                'AVG(s.score) as averageScore',
                'MAX(s.score) as highestScore',
                'COUNT(s.id) as totalAttempts'
                ]
            )
            ->where('s.quiz = :quizId')
            ->setParameter('quizId', $quizId)
            ->getQuery()
            ->getSingleResult();
    }

    public function getUserRanking(int $quizId, int $userId, int $score): array
    {
        $conn = $this->getEntityManager()->getConnection();

        $sql = '
        SELECT 
            (SELECT COUNT(*) + 1 
             FROM quiz_score 
             WHERE quiz_id = :quizId AND score > :score) as position,
            (SELECT COUNT(*) 
             FROM quiz_score 
             WHERE quiz_id = :quizId) as total
    ';

        $stmt = $conn->prepare($sql);
        $result = $stmt->executeQuery(
            [
            'quizId' => $quizId,
            'score' => $score
            ]
        );

        return $result->fetchAssociative();
    }


    //    /**
    //     * @return QuizScore[] Returns an array of QuizScore objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('q')
    //            ->andWhere('q.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('q.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?QuizScore
    //    {
    //        return $this->createQueryBuilder('q')
    //            ->andWhere('q.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
