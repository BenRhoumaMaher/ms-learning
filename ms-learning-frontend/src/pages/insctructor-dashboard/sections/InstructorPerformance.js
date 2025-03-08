import React from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'

const courses = [
  { id: 1, color: '#B0B0B0' },
  { id: 2, color: '#17B890' },
  { id: 3, color: '#2D8CFF' } 
]

const InstructorPerformance = () => {
  return (
    <Container fluid className='instrc-container'>
      <h2 className='instrc-title'>Your Course Performance</h2>
      <p className='instrc-subtitle mb-5'>
        Track how your courses are performing
      </p>

      <Row className='instrc-cards'>
        {courses.map(course => (
          <Col key={course.id} md={3} className='instrc-card-wrapper'>
            <div
              className='instrc-card'
              style={{ backgroundColor: course.color }}
            >
              <div className='instrc-icon bg-info'>
                <i className='fas fa-book text-light'></i>
              </div>
              <h4 className='instrc-card-title'>Course Title</h4>
              <p className='instrc-text'>Total Enrollments</p>
              <p className='instrc-text'>Rating</p>
              <p className='instrc-text'>Engagement</p>
              <Button className='instrc-btn'>View Details</Button>
            </div>
          </Col>
        ))}
      </Row>

      <div className='instrc-scroll-indicator'>
        <i className='fas fa-arrow-right text-info'></i>
      </div>
    </Container>
  )
}

export default InstructorPerformance
