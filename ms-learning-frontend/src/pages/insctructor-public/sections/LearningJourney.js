import React, { useState } from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";


const LearningJourney = () => {
  const categories = ["All", "Web Development", "Design", "Marketing"];

  const courses = [
    {
      title: "Web Dev Basics",
      category: "Web Development",
      rating: 4.9,
      enrollments: 350,
    },
    {
      title: "UI/UX Design",
      category: "Design",
      rating: 4.7,
      enrollments: 275,
    },
    {
      title: "Social Media Marketing",
      category: "Marketing",
      rating: 4.8,
      enrollments: 300,
    },
  ];

  const [selectedCategory, setSelectedCategory] = useState("All");

  return (
    <Container className="learning-section">
      <h4 className="fw-bold text-center">
        Explore the <span className="learning-title">Learning Journey</span>
      </h4>
      <p className="text-success text-center">
        Get into a world of knowledge with courses taught by <strong>Teacher Name</strong>
      </p>

      <div className="text-center my-3">
        <span className="category-label">Jump To</span>
        {categories.map((category, index) => (
          <Button
            key={index}
            variant={selectedCategory === category ? "primary" : "outline-primary"}
            className="mx-2 category-btn"
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      <Row className="mt-4">
        {courses
          .filter(course => selectedCategory === "All" || course.category === selectedCategory)
          .map((course, index) => (
            <Col md={3} key={index}>
              <Card className="course-card">
                <Card.Body>
                  <Card.Title className="course-title">{course.title}</Card.Title>
                  <Card.Text className="course-description">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.
                  </Card.Text>
                  <div className="rating">
                    <span className="stars">⭐⭐⭐⭐⭐</span> {course.rating}/5
                  </div>
                  <p className="enrollments">+{course.enrollments} enrollments</p>
                  <Button variant="info" className="enroll-btn">Enroll</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
      </Row>

      <div className="mt-4">
        <Button variant="primary" className="lshow-more-btn">Show more</Button>
      </div>
    </Container>
  );
};

export default LearningJourney;
