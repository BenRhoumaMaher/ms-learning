<?php

namespace App\Controller\Quiz;

use App\Entity\Answer;
use App\Entity\Courses;
use App\Entity\Question;
use App\Entity\Quiz;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Security;   // Security is still useful for general route protection
use Symfony\Component\Validator\Validator\ValidatorInterface;

class QuizController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private ValidatorInterface $validator,
    ) {
    }

    public function createQuiz(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $instructorIdFromPayload = (int) $data['instructorId'];

        $instructor = $this->entityManager->getRepository(
            User::class
        )->find($instructorIdFromPayload);

        if (! $instructor) {
            return $this->json(
                [
                    'message' => "Instructor with ID {$instructorIdFromPayload} 
                    not found.",
                ],
                404
            );
        }

        $course = $this->entityManager->getRepository(
            Courses::class
        )->find($data['courseId']);

        if (! $course) {
            return $this->json(
                [
                    'message' => 'Course not found.',
                ],
                404
            );
        }

        if ($course->getQuiz() !== null) {
            return $this->json(
                [
                    'message' => 'This course already has an associated quiz.',
                ],
                404
            );
        }

        $this->entityManager->beginTransaction();
        try {
            $quiz = new Quiz();
            $quiz->setTitle($data['title']);
            $quiz->setDescription($data['description'] ?? null);
            $quiz->setTimeLimit((int) $data['timeLimit']);
            $quiz->setPassingScore((int) $data['passingScore']);
            $quiz->setCourse($course);
            $quiz->setInstructor($instructor);
            $quiz->setCreatedAt(new \DateTimeImmutable());

            $this->entityManager->persist($quiz);

            foreach ($data['questions'] as $index => $qData) {

                $question = new Question();
                $question->setText($qData['text']);
                $question->setType($qData['type']);
                $question->setPosition($qData['position'] ?? ($index + 1));
                $question->setQuiz($quiz);
                $question->setCreatedAt(new \DateTimeImmutable());

                $this->entityManager->persist($question);

                foreach ($qData['answers'] as $ansData) {
                    if (! isset($ansData['text']) || ! isset($ansData['isCorrect'])) {
                        throw new \InvalidArgumentException(
                            "Invalid answer data for question \"{$qData['text']}\". 
                            Text and isCorrect are required."
                        );
                    }
                    $answer = new Answer();
                    $answer->setText($ansData['text']);
                    $answer->setIsCorrect((bool) $ansData['isCorrect']);
                    $answer->setQuestion($question);

                    $this->entityManager->persist($answer);
                }
            }

            $this->entityManager->flush();
            $this->entityManager->commit();

            return $this->json(
                [
                    'message' => 'Quiz created successfully!',
                    'quizId' => $quiz->getId(),
                ],
                201
            );

        } catch (\InvalidArgumentException $e) {
            $this->entityManager->rollback();
            return $this->json(
                [
                    'message' => $e->getMessage(),
                ],
                400
            );
        } catch (\Exception $e) {
            $this->entityManager->rollback();
            return $this->json(
                [
                    'message' => 'An unexpected error occurred while 
                creating the quiz.', ],
                500
            );
        }
    }
}
