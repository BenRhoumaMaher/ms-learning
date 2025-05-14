import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { getCourses } from "../../../helpers/api";

const KeepLearning = () => {
  const [allCourses, setAllCourses] = useState([]);
  const [displayedCourses, setDisplayedCourses] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const courses = await getCourses();
        const shuffled = [...courses].sort(() => 0.5 - Math.random());
        setAllCourses(shuffled);
        setDisplayedCourses(shuffled.slice(0, 3));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const updateDisplayedCourses = (newIndex) => {
    const nextIndex = newIndex >= allCourses.length ? 0 : newIndex < 0 ? allCourses.length - 3 : newIndex;
    setCurrentIndex(nextIndex);
    setDisplayedCourses(allCourses.slice(nextIndex, nextIndex + 3));
  };

  const handleNext = () => {
    updateDisplayedCourses(currentIndex + 3);
  };

  const handlePrev = () => {
    updateDisplayedCourses(currentIndex - 3);
  };

  if (loading) {
    return (
      <Container className="keep-learning text-center">
        <h3 className="fw-bold text-start">Keep Learning</h3>
        <p className="subtitle text-start mb-5">Loading recommended courses...</p>
      </Container>
    );
  }

  return (
    <Container className="keep-learning text-center">
      <h3 className="fw-bold text-start">Keep Learning</h3>
      <p className="subtitle text-start mb-5">Expand your knowledge with these recommended courses</p>

      <div className="navigation d-flex justify-content-center align-items-center mb-4">
        <button className="nav-btn me-3" onClick={handlePrev}>
          <FaChevronLeft size={20} />
        </button>
        <span className="nav-title mx-3">Recommended Courses</span>
        <button className="nav-btn ms-3" onClick={handleNext}>
          <FaChevronRight size={20} />
        </button>
      </div>

      <Row className="justify-content-center mt-4">
        {displayedCourses.map((course) => (
          <Col key={course.id} md={4} className="mb-4">
            <Card className="course-cardd h-100 shadow-sm">
              <Card.Img
                variant="top"
                src={`http://localhost:8080/${course.image}`}
                alt={course.title}
                style={{ height: '150px', objectFit: 'cover' }}
              />
              <Card.Body>
                <Card.Title className="text-primary">{course.title}</Card.Title>
                <Card.Text className="text-start">
                  <Badge bg="info" className="me-2 mb-2">
                    <i className="bi bi-clock"></i> {course.duration}
                  </Badge>
                  <Badge bg={course.price === "0.00" ? "success" : "warning"} className="me-2 mb-2">
                    {course.price === "0.00" ? "Free" : `$${course.price}`}
                  </Badge>
                  <div className="mt-2">
                    <small className="text-muted">
                      <i className="bi bi-person-fill text-secondary"></i> Instructor:{" "}
                      <span className="text-dark fw-semibold">{course.instructor.name}</span>
                    </small>
                  </div>
                </Card.Text>
              </Card.Body>
              <Card.Footer className="bg-white border-0">
                <Button
                  variant="info"
                  className="check-btn mt-3 w-100 mx-auto text-white fw-bold"
                  href={`/registered-courses/${course.id}`}
                >
                  View Course
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default KeepLearning;