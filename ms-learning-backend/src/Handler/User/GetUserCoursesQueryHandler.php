<?php

namespace App\Handler\User;

use App\Query\User\GetUserCoursesQuery;
use App\Repository\UserRepository;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
class GetUserCoursesQueryHandler
{
    public function __construct(
        private UserRepository $userRepository
    ) {
    }

    /**
     * @return array{
     *     username: string,
     *     courses: array<int, array{
     *         id: int,
     *         title: string,
     *         description: string,
     *         category: ?string,
     *         created_at: string,
     *         students: array<int, array{
     *             id: int,
     *             name: string,
     *             email: string,
     *             image: string,
     *             quizScores: array<int, array{
     *                 courseId: int,
     *                 courseTitle: string,
     *                 studentId: int,
     *                 studentName: string,
     *                 quizId: int,
     *                 quizTitle: string,
     *                 score: int,
     *                 totalQuestions: int,
     *                 percentage: float,
     *                 completedAt: string
     *             }>
     *         }>,
     *         quiz: ?array{
     *             id: int,
     *             title: string,
     *             description: string,
     *             timeLimit: int,
     *             passingScore: int,
     *             createdAt: string,
     *             questions: array<int, array{
     *                 id: int,
     *                 text: string,
     *                 type: string,
     *                 position: int,
     *                 createdAt: string
     *             }>
     *         }
     *     }>
     * }
     */
    public function __invoke(GetUserCoursesQuery $query): array
    {
        $user = $this->userRepository->find($query->id);

        if (! $user) {
            throw new \Exception('User not found');
        }

        $courses = [];
        $allStudents = [];
        $allQuizScores = [];

        foreach ($user->getCourses() as $course) {
            $courseData = [
                'id' => $course->getId(),
                'title' => $course->getTitle(),
                'description' => $course->getDescription(),
                'category' => $course->getCategory()?->getName(),
                'created_at' => $course->getCreatedAt()->format('Y-m-d H:i:s'),
                'students' => [],
                'quiz' => null,
            ];

            $quiz = $course->getQuiz();
            if ($quiz) {
                $quizData = [
                    'id' => $quiz->getId(),
                    'title' => $quiz->getTitle(),
                    'description' => $quiz->getDescription(),
                    'timeLimit' => $quiz->getTimeLimit(),
                    'passingScore' => $quiz->getPassingScore(),
                    'createdAt' => $quiz->getCreatedAt()->format('Y-m-d H:i:s'),
                    'questions' => [],
                ];

                foreach ($quiz->getQuestions() as $question) {
                    $questionData = [
                        'id' => $question->getId(),
                        'text' => $question->getText(),
                        'type' => $question->getType(),
                        'position' => $question->getPosition(),
                        'createdAt' => $question->getCreatedAt()->format('Y-m-d H:i:s'),
                    ];

                    $quizData['questions'][] = $questionData;
                }

                $courseData['quiz'] = $quizData;
            }

            foreach ($course->getStudentCourses() as $studentCourse) {
                $student = $studentCourse->getUser();
                $studentData = [
                    'id' => $student->getId(),
                    'name' => $student->getFirstname() . ' ' . $student->getLastName(),
                    'email' => $student->getEmail(),
                    'image' => $student->getPicture(),
                    'quizScores' => [],
                ];

                if ($quiz) {
                    foreach ($student->getQuizScores() as $quizScore) {
                        if ($quizScore->getQuiz() === $quiz) {
                            $scoreData = [
                                'courseId' => $course->getId(),
                                'courseTitle' => $course->getTitle(),
                                'studentId' => $student->getId(),
                                'studentName' => $studentData['name'],
                                'quizId' => $quiz->getId(),
                                'quizTitle' => $quiz->getTitle(),
                                'score' => $quizScore->getScore(),
                                'totalQuestions' => $quizScore->getTotalQuestions(),
                                'percentage' => round(($quizScore->getScore() / $quizScore->getTotalQuestions()) * 100, 2),
                                'completedAt' => $quizScore->getCompletedAt()->format('Y-m-d H:i:s'),
                            ];

                            $studentData['quizScores'][] = $scoreData;
                            $allQuizScores[] = $scoreData;
                        }
                    }
                }

                $courseData['students'][] = $studentData;

                if (! isset($allStudents[$student->getId()])) {
                    $allStudents[$student->getId()] = $studentData;
                }
            }

            $courses[] = $courseData;
        }

        return [
            'username' => $user->getFirstname() . ' ' . $user->getLastName(),
            'courses' => $courses,
        ];
    }
}
