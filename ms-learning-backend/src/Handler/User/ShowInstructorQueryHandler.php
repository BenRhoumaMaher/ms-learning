<?php

namespace App\Handler\User;

use App\Query\User\ShowInstructorQuery;
use App\Repository\UserRepository;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

#[AsMessageHandler]
class ShowInstructorQueryHandler
{
    public function __construct(private UserRepository $userRepository)
    {
    }

    public function __invoke(ShowInstructorQuery $query): array
    {
        $instructor = $this->userRepository->find($query->instructorId);

        if (!$instructor || !in_array('ROLE_INSTRUCTOR', $instructor->getRoles())) {
            throw new NotFoundHttpException('Instructor not found');
        }

        $courses = $instructor->getCourses();

        return [
            'id' => $instructor->getId(),
            'name' => $instructor->getUsername(),
            'firstName' => $instructor->getFirstname(),
            'expertise' => $instructor->getExpertise(),
            'courseCount' => count($courses),
            'occupation' => $instructor->getOccupation(),
            'specializations' => $instructor->getSpecialization(),
            'picture' => $instructor->getPicture(),
        ];
    }
}
