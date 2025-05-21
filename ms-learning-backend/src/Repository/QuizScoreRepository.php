<?php

namespace App\Repository;

use App\Entity\QuizScore;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use ECSPrefix202505\array;

/**
 * @extends ServiceEntityRepository<QuizScore>
 */
class QuizScoreRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, QuizScore::class);
    }

    /**
     * Save Score
     *
     * Persists a quiz score entity to the database and flushes immediately.
     *
     * @param QuizScore $score The quiz score entity to persist
     */
    public function saveScore(QuizScore $score): void
    {
        $this->getEntityManager()->persist($score);
        $this->getEntityManager()->flush();
    }

    /**
     * Get Quiz Statistics
     *
     * Retrieves aggregate statistics for a specific quiz including:
     * - Average score across all attempts
     * - Highest score achieved
     * - Total number of attempts
     *
     * @param int $quizId The ID of the quiz
     *
     * @return array{averageScore: float|string|null, highestScore: float|string|null, totalAttempts: int|string}
     */
    public function getQuizStatistics(int $quizId): array
    {
        return $this->createQueryBuilder('s')
            ->select(
                [
                    'AVG(s.score) as averageScore',
                    'MAX(s.score) as highestScore',
                    'COUNT(s.id) as totalAttempts',
                ]
            )
            ->where('s.quiz = :quizId')
            ->setParameter('quizId', $quizId)
            ->getQuery()
            ->getSingleResult();
    }

    /**
     * Get User Ranking
     *
     * Calculates a user's position in the quiz leaderboard and total participants.
     * Uses raw SQL for efficient ranking calculation.
     *
     * @param int $quizId The ID of the quiz
     * @param int $userId The ID of the user
     * @param int $score  The user's score to rank
     *
     * @return array{position: int|string|null, total: int|string|null}
     */
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
                'score' => $score,
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
