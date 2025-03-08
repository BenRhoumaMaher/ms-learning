import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const sessions = [
  { id: 1, color: "#B0B0B0" },
  { id: 2, color: "#17B890" },
  { id: 3, color: "#2D8CFF" },
];

const UpcomingLiveSessions = () => {
  return (
    <Container fluid className="instructlive-container">
      <h2 className="instructlive-title">Upcoming Live Sessions</h2>
      <p className="instructlive-subtitle mb-5">
        Prepare for your next live sessions and keep your students engaged
      </p>

      <div className="instructlive-carousel">
        <button className="instructlive-arrow instructlive-left">
          <FaChevronLeft />
        </button>

        <Row className="instructlive-cards">
          {sessions.map((session) => (
            <Col key={session.id} md={3} className="instructlive-card-wrapper">
              <div
                className="instructlive-card"
                style={{ borderColor: session.color }}
              >
                <div className="instructlive-number" style={{ color: session.color }}>
                  {session.id < 10 ? `0${session.id}` : session.id}
                </div>
                <div
                  className="instructlive-header"
                  style={{ backgroundColor: session.color }}
                >
                  Course Title
                </div>
                <div className="instructlive-body">
                  <p className="instructlive-label">Start Date & Time</p>
                  <p className="instructlive-label">
                    Number of Registered Students
                  </p>
                  <div className="instructlive-buttons">
                    <Button className="instructlive-btn instructlive-start">Start Now</Button>
                    <Button className="instructlive-btn instructlive-modify">Modify</Button>
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>

        <button className="instructlive-arrow instructlive-right">
          <FaChevronRight />
        </button>
      </div>
    </Container>
  );
};

export default UpcomingLiveSessions;
