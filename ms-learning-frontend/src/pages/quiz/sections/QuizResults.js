import React from "react";
import { Container, Row, Col } from "react-bootstrap";


const questions = [
  { id: 1, text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", correct: false },
  { id: 2, text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", correct: true },
  { id: 3, text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", correct: true },
  { id: 4, text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", correct: true },
  { id: 5, text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", correct: false },
  { id: 6, text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", correct: true },
];

const QuizResults = () => {
  return (
    <Container className="quiz-results py-4">
      <h3 className="fw-bold">Your Results</h3>
      <p className="congrats-message mb-5">Congratulations, you’ve completed the quiz</p>

      <div className="text-center">
      <p className="final-score">
        <strong>Final Score:</strong> <span className="score-text">8/10 – Great job</span>
      </p>

      <p className="badges-unlocked">
        <span className="text-success">Badges Unlocked</span> : Congrats! You earned the 
        <span className="expert-badge"> Expert’ badge</span>
      </p>
      </div>
      <Row>
        {questions.map((q) => (
          <Col md={6} key={q.id} className="mb-3">
            <div className={`question-box ${q.correct ? "correct" : "incorrect"}`}>
              <span className="question-number">{q.id}</span>
              <p className="question-text">{q.text}</p>
              <a href="/" className="view-details">View Details</a>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default QuizResults;
