<?php

namespace App\Handler\Course;

use App\Repository\UserRepository;
use App\Query\Course\GetRecommendedCoursesQuery;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

#[AsMessageHandler]
class GetRecommendedCoursesHandler
{
    public function __construct(private UserRepository $userRepository)
    {
    }

    public function __invoke(GetRecommendedCoursesQuery $query): array
    {
        $user = $this->userRepository->find($query->userId);
        if (!$user) {
            throw new NotFoundHttpException('User not found');
        }

        $interests = $user->getInterests();
        if ($interests->isEmpty()) {
            return [];
        }

        $courses = [];
        foreach ($interests as $category) {
            $courses = array_merge($courses, $category->getCourses()->toArray());
        }

        $unique = [];
        $ids = [];
        foreach ($courses as $course) {
            if (!in_array($course->getId(), $ids)) {
                $unique[] = $course;
                $ids[] = $course->getId();
            }
        }

        usort($unique, fn ($a, $b) => $b->getCreatedAt() <=> $a->getCreatedAt());

        return array_slice($unique, 0, 6);
    }
}
