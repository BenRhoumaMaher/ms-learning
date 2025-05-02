import React from "react";
import { Container, Row, Col, ProgressBar, Button } from "react-bootstrap";
import { useQuiz } from "./QuizContext";

const QuizQuestion = () => {
  const {
    currentQuestionIndex,
    questions,
    submitAnswer,
    finishQuiz,
    timeLeft,
    formatTime,
    setCurrentQuestionIndex,
    answers
  } = useQuiz();

  if (questions.length === 0) return null;

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const userAnswer = answers[currentQuestionIndex];

  const handleAnswer = (answerValue) => {
    submitAnswer(answerValue);
  };

  const handleNext = () => {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const trueFalseOptions = [
    { text: "True", value: true },
    { text: "False", value: false }
  ];

  const correctAnswer = currentQuestion.answers[0]?.isCorrect;

  return (
    <Container className="quiz-container py-4">
      <Row className="justify-content-between mb-3">
        <Col>
          <h3 className="fw-bold">Answer the questions and show what you know</h3>
        </Col>
        <Col xs="auto">
          <div className="timer-box bg-light p-2 rounded">
            <strong>Time remaining:</strong> {formatTime(timeLeft)}
          </div>
        </Col>
      </Row>

      <div className="question-box d-flex align-items-center justify-content-between mb-4 p-3 bg-light rounded">
        <span className="question-number bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
          style={{ width: '40px', height: '40px' }}>
          {currentQuestionIndex + 1}
        </span>
        <span className="question-text ms-3 flex-grow-1">
          {currentQuestion.text}
        </span>
      </div>

      <div className="options-container mt-4">
        {trueFalseOptions.map((option, index) => {
          const isSelected = userAnswer === option.value;
          const isCorrect = option.value === correctAnswer;
          let optionClass = "option-box mb-3 p-3 rounded";

          if (isSelected) {
            optionClass += isCorrect ? " bg-success text-white" : " bg-danger text-white";
          } else {
            optionClass += " bg-light";
          }

          return (
            <div
              key={index}
              className={optionClass}
              onClick={() => handleAnswer(option.value)}
              style={{ cursor: 'pointer' }}
            >
              {option.text}
            </div>
          );
        })}
      </div>

      <Row className="align-items-center mt-4">
        <Col md={4}>
          <ProgressBar
            now={progress}
            label={`${Math.round(progress)}%`}
            className="progress-bar-custom h-50"
          />
        </Col>
        <Col md={{ span: 4, offset: 4 }} className="text-end">
          {isLastQuestion ? (
            <Button
              variant="success"
              onClick={finishQuiz}
              disabled={userAnswer === undefined}
            >
              Finish Quiz
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleNext}
              disabled={userAnswer === undefined}
            >
              Next Question
            </Button>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default QuizQuestion;