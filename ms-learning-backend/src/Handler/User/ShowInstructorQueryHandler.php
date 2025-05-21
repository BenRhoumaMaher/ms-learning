<?php

namespace App\Handler\User;

use App\Query\User\ShowInstructorQuery;
use App\Repository\UserRepository;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
class ShowInstructorQueryHandler
{
    /**
     * @param UserRepository $userRepository Repository for user entities
     */
    public function __construct(
        private UserRepository $userRepository
    ) {
    }

    /**
     * Handle the ShowInstructorQuery
     *
     * Fetches instructor profile data including course count and expertise.
     * Throws a 404 if the user is not found or not an instructor.
     *
     * @param ShowInstructorQuery $query Contains:
     *                                   - instructorId: int (required) ID of the instructor
     *
     * @return array{
     *     id: int,
     *     name: string,
     *     firstName: string,
     *     expertise: ?string,
     *     courseCount: int,
     *     occupation: ?string,
     *     specializations: array<int, string>|null,
     *     picture: ?string
     * }
     *
     * @throws NotFoundHttpException When instructor is not found or has invalid role
     */
    public function __invoke(ShowInstructorQuery $query): array
    {
        $instructor = $this->userRepository->find($query->instructorId);

        if (! $instructor || ! in_array('ROLE_INSTRUCTOR', $instructor->getRoles())) {
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
