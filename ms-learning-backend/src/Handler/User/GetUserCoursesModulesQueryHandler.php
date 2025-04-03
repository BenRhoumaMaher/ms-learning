<?php

namespace App\Handler\User;

use App\Repository\UserRepository;
use App\Query\User\GetUserCoursesModulesQuery;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;
use Symfony\Component\Messenger\Handler\MessageHandlerInterface;

#[AsMessageHandler]
class GetUserCoursesModulesQueryHandler
{
    public function __construct(
        private UserRepository $userRepository
    ) {
    }

    public function __invoke(GetUserCoursesModulesQuery $query): array
    {
        $user = $this->userRepository->find($query->id);

        if (!$user) {
            throw new \Exception('User not found');
        }

        return $this->formatUserCourses($user);
    }

    private function formatUserCourses($user): array
    {
        $courses = [];

        foreach ($user->getCourses() as $course) {
            $modules = array_map(
                fn ($module) => [
                    'id' => $module->getId(),
                    'title' => $module->getTitle(),
                ],
                $course->getModules()->toArray()
            );

            $courses[] = [
                'id' => $course->getId(),
                'title' => $course->getTitle(),
                'modules' => $modules,
            ];
        }

        return [
            'username' => $user->getFirstname() . ' ' . $user->getLastName(),
            'courses' => $courses,
        ];
    }
}
