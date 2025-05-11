<?php

namespace App\Handler\User;

use App\Repository\UserRepository;
use App\Query\User\GetUserCoursesQuery;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
class GetUserCoursesQueryHandler
{
    public function __construct(
        private UserRepository $userRepository
    ) {
    }

    public function __invoke(GetUserCoursesQuery $query)
    {
        $user = $this->userRepository->find($query->id);

        if (!$user) {
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
                'students' => [],
                'quiz' => null
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
                    'questions' => []
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
                    'quizScores' => []
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

                if (!isset($allStudents[$student->getId()])) {
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
