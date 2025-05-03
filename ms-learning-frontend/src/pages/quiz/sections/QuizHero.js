import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useQuiz } from './QuizContext';
import { getQuizQuestions, getLessonInfo } from '../../../helpers/api';

const QuizHero = ({ lessonId }) => {
  const [loading, setLoading] = useState(false);
  const [quizInfo, setQuizInfo] = useState(null);
  const { startQuiz } = useQuiz();

  useEffect(() => {
    const fetchLessonInfo = async () => {
      try {
        const lessonData = await getLessonInfo(lessonId);
        setQuizInfo(lessonData.course.quiz);
      } catch (error) {
        console.error('Error fetching lesson info:', error);
      }
    };

    fetchLessonInfo();
  }, [lessonId]);

  const handleStartQuiz = async () => {
    setLoading(true);
    try {
      const response = await getQuizQuestions(lessonId);

      if (!response.questions || !Array.isArray(response.questions)) {
        throw new Error('Invalid questions data format');
      }

      const formattedQuestions = response.questions.map(question => ({
        id: question.id,
        text: question.text,
        position: question.position,
        answers: question.answers.map(answer => ({
          id: answer.id,
          text: answer.text,
          isCorrect: answer.isCorrect
        })),
        correctAnswer: question.answers.findIndex(answer => answer.isCorrect),
        quizId: quizInfo.id
      }));

      startQuiz({
        questions: formattedQuestions,
        timeLimit: quizInfo.time_limit,
        passingScore: quizInfo.passing_score
      });
    } catch (error) {
      console.error('Error starting quiz:', error);
      alert('Failed to load quiz questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className='quiz-hero py-5'>
      <Row className='align-items-center justify-content-between'>
        <Col md={5}>
          <h2 className='fw-bold'>Ready to Test Your Knowledge?</h2>
          {quizInfo ? (
            <>
              <p className='text-primary fw-bold'>
                This quiz contains <span className='text-dark'>{quizInfo.questions} questions</span>
              </p>
              <p className='text-success fw-bold'>
                You have <span className='text-dark'>{quizInfo.time_limit} minutes</span> to complete it
              </p>
              <p className='text-danger fw-bold'>
                You cannot go back after answering a question
              </p>
              <p className='text-muted'>
                Passing score: <span className='text-dark'>{quizInfo.passing_score}%</span>
              </p>
            </>
          ) : (
            <p>Loading quiz information...</p>
          )}
        </Col>

        <Col md={5} className='text-end'>
          <i className='fas fa-images quiz-icon'></i>
          <div>
            <Button
              variant='success'
              className='mt-3 quiz-btn'
              onClick={handleStartQuiz}
              disabled={loading || !quizInfo}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Loading Questions...
                </>
              ) : (
                "I'm Ready"
              )}
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default QuizHero;