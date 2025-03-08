import React from "react";
import { Container, Row, Col, Button, InputGroup, FormControl } from "react-bootstrap";


const discussions = [
  { count: 13, text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", border: "gray" },
  { count: 56, text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", border: "teal" },
  { count: 11, text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", border: "blue" }
];

const CourseDiscussions = () => {
  return (
    <Container className="course-discussions text-center py-5">
      <h2 className="fw-bold">Course Discussions</h2>
      <p className="text-muted">Ask questions, share insights, and connect with your peers</p>

      <div className="search-bar mx-auto my-4">
        <InputGroup>
          <InputGroup.Text><i className="fas fa-search"></i></InputGroup.Text>
          <FormControl placeholder="Find specific topics or questions" />
          <InputGroup.Text><i className="fas fa-microphone"></i></InputGroup.Text>
        </InputGroup>
      </div>

      <Row className="justify-content-center">
        {discussions.map((item, index) => (
          <Col key={index} md={8} className="my-3">
            <div className={`discussion-item border-${item.border}`}>
              <div className={`discussion-count bg-${item.border}`}>{item.count}</div>
              <span className="discussion-text">{item.text}</span>
              <Button variant="warning" className="discussion-btn">Interact</Button>
            </div>
          </Col>
        ))}
      </Row>

      <Button variant="danger" className="mt-4 px-5 py-2 discussion-start-btn">Start a New Discussion</Button>
    </Container>
  );
};

export default CourseDiscussions;
