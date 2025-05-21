<?php

namespace App\Repository;

use App\Entity\Post;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Post>
 */
class PostRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Post::class);
    }

    /**
     * Find Posts By User Or Courses
     *
     * Retrieves posts that mention either:
     * - The specified user's username (in title, content, or tags)
     * - Any of the provided course titles (in title, content, or tags)
     *
     * @param User               $user         The user to search mentions for
     * @param array<int, string> $courseTitles Array of course titles to search for
     *
     * @return array<int, Post> Array of matching Post entities
     */
    public function findPostsByUserOrCourses(User $user, array $courseTitles): array
     {
        $qb = $this->createQueryBuilder('p');
        $qb->where(
            'p.title LIKE :username 
            OR p.content LIKE :username OR p.tags LIKE :username'
        )
            ->setParameter('username', '%' . $user->getUsername() . '%');

        foreach ($courseTitles as $i => $title) {
            $qb->orWhere(
                "p.title LIKE :courseTitle{$i} 
                OR p.content LIKE :courseTitle{$i} OR p.tags LIKE :courseTitle{$i}"
            )
                ->setParameter("courseTitle{$i}", '%' . $title . '%');
        }

        return $qb->getQuery()->getResult();
    }

    //    /**
    //     * @return Post[] Returns an array of Post objects
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

    //    public function findOneBySomeField($value): ?Post
    //    {
    //        return $this->createQueryBuilder('p')
    //            ->andWhere('p.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
