import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";


const courses = [
  { id: 1, title: "Lorem ipsum", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", color: "#8C9A9E" },
  { id: 2, title: "Lorem ipsum", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", color: "#1ABC9C" },
  { id: 3, title: "Lorem ipsum", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", color: "#3498DB" },
];

const KeepLearning = () => {
  return (
    <Container className="keep-learning text-center">
      <h3 className="fw-bold text-start">Keep Learning</h3>
      <p className="subtitle text-start mb-5">Expand your knowledge with these recommended courses</p>

      <div className="navigation">
        <button className="nav-btn">
          <FaChevronLeft />
        </button>
        <span className="nav-title">Recommended Courses</span>
        <button className="nav-btn">
          <FaChevronRight />
        </button>
      </div>

      <Row className="justify-content-center mt-4">
        {courses.map((course) => (
          <Col key={course.id} md={4}>
            <Card className="course-cardd">
              <Card.Body>
                <Card.Text className="course-text">{course.description}</Card.Text>
              </Card.Body>
              <Card.Footer style={{ backgroundColor: course.color }}>
                <span className="course-title mb-3">{course.title}</span>
              </Card.Footer>
              <Button variant="primary" className="check-btn mt-3 w-50 mx-auto bg-info">Check</Button>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default KeepLearning;
