import React from "react";
import { Container, Button } from "react-bootstrap";


const ConnectSection = () => {
  return (
    <Container className="connect-section text-center">
      <h4 className="connect-title fw-bold">Let’s Connect</h4>

      <p className="connect-subtitle text-success">
        Have questions or want to collaborate? Connect with <strong>Instructor Name</strong> on <strong>MS-CONNECT</strong>
      </p>

      <Button variant="info" className="connect-button">
        Message me
      </Button>
    </Container>
  );
};

export default ConnectSection;
