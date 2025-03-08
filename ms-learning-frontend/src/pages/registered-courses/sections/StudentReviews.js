import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { FaStar } from "react-icons/fa";

const reviews = [
  { name: "Student Name", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", bg: "primary" },
  { name: "Student Name", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", bg: "secondary" },
  { name: "Student Name", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", bg: "info" },
  { name: "Student Name", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", bg: "success" }
];

const StudentReviews = () => {
  return (
    <Container className="student-reviews text-center py-5">
      <h2 className="fw-bold">What Students Are Saying</h2>
      <p className="text-muted">Hear from learners who’ve taken this course</p>

      <Row className="justify-content-center">
        {reviews.map((review, index) => (
          <Col key={index} md={3} className="d-flex justify-content-center">
            <Card className={`review-card text-white bg-${review.bg} p-3`}>
              <div className="review-icon mx-auto mb-3 rounded">
                <i className="fas fa-image fa-5x text-info"></i>
              </div>
              <Card.Body>
                <Card.Title className="fw-bold">{review.name}</Card.Title>
                <Card.Text className="text-light">{review.text}</Card.Text>
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-warning" />
                  ))}
                </div>
                <Button variant="danger" className="mt-3 px-4">Answer</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Button variant="outline-danger" className="mt-4 px-5 py-2 review-btn">Add Review</Button>
    </Container>
  );
};

export default StudentReviews;
