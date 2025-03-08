import React from 'react'
import { Container, Row, Col, Card, Button } from 'react-bootstrap'

const UpcomingCourses = () => {
  const courses = [
    {
      title: 'Course Title',
      date: '30/02/2025',
      time: '12:10:00',
      duration: '2 hours'
    },
    {
      title: 'Course Title',
      date: '30/02/2025',
      time: '12:10:00',
      duration: '2 hours'
    },
    {
      title: 'Course Title',
      date: '30/02/2025',
      time: '12:10:00',
      duration: '2 hours'
    }
  ]

  return (
    <Container className='upcoming-section text-center'>
      <h4 className='upcoming-title fw-bold'>Upcoming Live Courses</h4>
      <p className='upcoming-subtitle text-success mb-5'>
        Join <strong>Teacher Name</strong> in real-time sessions
      </p>

      <Row className='mt-4'>
        {courses.map((course, index) => (
          <Col lg={4} md={6} sm={12} key={index} className='mb-4'>
            <Card className='upcoming-card'>
              <div className='upcoming-card-image'>
                <i className='fas fa-image fa-5x text-light'></i>
              </div>

              <Card.Body>
                <p className='upcoming-card-title'>
                  <strong>Course Title:</strong> {course.title}
                </p>
                <p className='upcoming-card-date'>
                  <strong>Start Date & Time:</strong> {course.date} at{' '}
                  {course.time}
                </p>
                <p className='upcoming-card-duration'>
                  <strong>Duration:</strong> {course.duration}
                </p>
                <Button
                  variant='outline-primary'
                  className='upcoming-card-join-btn'
                >
                  Join
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Button variant='success' className='upcoming-calendar-btn'>
        View Full Calendar
      </Button>
    </Container>
  )
}

export default UpcomingCourses
