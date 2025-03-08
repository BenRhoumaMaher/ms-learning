import React from "react";
import { Form, Button, Container, Row, Col, InputGroup } from "react-bootstrap";


const ProfileUpdate = () => {
  return (
    <section className="profile-update mt-5">
      <Container>
        <Row className="justify-content-center">
          <Col md={6}>
              <div className="text-center">
              <h2 className="profile-title">Your Profile</h2>
              <p className="profile-subtitle">
                Keep your information up to date, it’s how we personalize your experience
              </p>
              </div>

            <div className="profile-box">
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>User Name</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="fas fa-user"></i>
                    </InputGroup.Text>
                    <Form.Control type="text" placeholder="Enter your username" />
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="fas fa-envelope"></i>
                    </InputGroup.Text>
                    <Form.Control type="email" placeholder="Enter your email" />
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Bio</Form.Label>
                  <Form.Control as="textarea" rows={3} placeholder="Tell us about yourself" />
                </Form.Group>

                <div className="social-links">
                  <p>Add Social Media Links</p>
                  <div className="social-icons">
                    <i className="fab fa-facebook-square"></i>
                    <i className="fab fa-linkedin"></i>
                    <i className="fab fa-twitter"></i>
                    <i className="fab fa-instagram"></i>
                  </div>
                </div>

                <div className="text-center">
                  <Button className="save-btn mt-2">Save Changes</Button>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ProfileUpdate;
