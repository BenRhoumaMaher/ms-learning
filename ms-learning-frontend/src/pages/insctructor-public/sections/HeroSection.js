import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";


const HeroSection = () => {
  return (
    <Container className="hero-section">
      <Row className="align-items-center">
        <Col md={7} className="text-center">
          <h5 className="fw-bold">
            Teacher name – <span className="specialist">Full-Stack Developer & AI Specialist</span>
          </h5>

          <h5 className="mt-3">
            <strong>Meet <span className="teacher-name">Teacher name</span></strong>
          </h5>
          <h5 className="text-success">Your guide to mastering Python</h5>

          <p className="mt-3 description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>

          <p className="course-info">
            <a href="/" className="course-link">10 Courses</a> | <span className="students">50,000+ Students</span>
          </p>

          <Button className="follow-btn">Follow</Button>
        </Col>

        <Col md={5} className="text-center">
          <div className="teacher-image">
            <i className='fas fa-image fa-5x text-light'></i>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default HeroSection;
