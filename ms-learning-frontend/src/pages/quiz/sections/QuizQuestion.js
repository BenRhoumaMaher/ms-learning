import React from "react";
import { Container, Row, Col, ProgressBar, Button } from "react-bootstrap";


const QuizQuestion = () => {
  return (
    <Container className="quiz-container py-4">
      <h3 className="fw-bold mb-3">Answer the questions and show what you know</h3>

      <div className="question-box d-flex align-items-center justify-content-between">
        <span className="question-number">03</span>
        <span className="question-text">Question</span>
      </div>

      <Row className="align-items-center mt-4">
        <Col md={4}>
          <ProgressBar now={33} label="33%" className="progress-bar-custom h-50" />
        </Col>

        <Col md={4} className="text-center">
          <i className="fas fa-clock timer-icon"></i>
          <span className="hints-text"> <span className="text-danger fw-bold">2 left Hints</span></span>
        </Col>

        <Col md={4} className="text-end">
          <Button variant="info" className="next-btn">Next</Button>
        </Col>
      </Row>
    </Container>
  );
};

export default QuizQuestion;
