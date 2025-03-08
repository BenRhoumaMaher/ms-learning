import React from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'

const InstructorSection = () => {
  return (
    <Container className='instructor-section text-center py-5'>
      <h2 className='fw-bold'>Meet Your Instructor</h2>
      <p className='text-muted'>
        Learn from Instructor Name, an expert in field
      </p>

      <div className='instructor-image mb-3 m-auto'>
        <i className='fas fa-image fa-5x text-info'></i>
      </div>

      <Row className='justify-content-center'>
        <Col md={8} className='bg-light p-4 rounded w-100'>
          <h4 className='fw-bold'>NAME</h4>
          <p className='text-muted'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>

          <div className='social-icons mb-3'>
            <a href='/' className='me-4 text-reset'>
              <i className='bi bi-linkedin text-primary'></i>
            </a>
            <a href='*' className='me-4 text-reset'>
              <i className='bi bi-twitter text-info'></i>
            </a>
            <a href='*' className='me-4 text-reset'>
              <i className='bi bi-instagram text-danger'></i>
            </a>
          </div>

          <Button variant='outline-primary' className='px-4'>
            View Full Profile
          </Button>
        </Col>
      </Row>
    </Container>
  )
}

export default InstructorSection
