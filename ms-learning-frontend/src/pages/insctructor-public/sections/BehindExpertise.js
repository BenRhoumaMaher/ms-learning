import React, { useState } from "react";
import { Container, Row, Col, ListGroup, Card } from "react-bootstrap";


const BehindExpertise = () => {
  const [selectedSection, setSelectedSection] = useState("Bio");

  const content = {
    Bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    Achievements: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    Publications: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    "Fun Facts": "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  };

  return (
    <Container className="expertise-section">
      <h4 className="fw-bold text-center ">Behind the <span className="expertise-title">Expertise</span></h4>
      <p className="text-success text-center mb-5">
        Discover the journey and achievements of <strong>Teacher Name</strong>
      </p>

      <Row className="mt-5">
        <Col md={4}>
          <ListGroup className="list-group">
            <ListGroup.Item className="list-title">Teacher name</ListGroup.Item>
            {Object.keys(content).map((item, index) => (
              <ListGroup.Item
                key={index}
                action
                active={selectedSection === item}
                onClick={() => setSelectedSection(item)}
                className="list-item"
              >
                {item}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>

        <Col md={8}>
          <Card className="content-card">
            <Card.Body>
              <Card.Text className="content-text">
                {content[selectedSection]}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default BehindExpertise;
