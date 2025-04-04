import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import { getUserLiveSessions } from '../../../helpers/api'

const UpcomingCourses = () => {
  const { id } = useParams()
  const [sessions, setSessions] = useState([])
  const [visibleCount, setVisibleCount] = useState(3)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const data = await getUserLiveSessions(id)
        setSessions(data || [])
      } catch (error) {
        console.error('Failed to fetch sessions:', error)
      }
    }

    if (id) {
      fetchSessions()
    }
  }, [id])

  const visibleSessions = showAll ? sessions : sessions.slice(0, visibleCount)

  return (
    <Container className='upcoming-section text-center'>
      <h4 className='upcoming-title fw-bold'>Upcoming Live Courses-Sessions</h4>
      <p className='upcoming-subtitle text-success mb-5'>
        Join <strong>{sessions[0]?.instructor || 'the instructor'}</strong> in
        real-time sessions
      </p>

      <Row className='mt-4'>
        {visibleSessions.map((session, index) => (
          <Col lg={4} md={6} sm={12} key={index} className='mb-4'>
            <Card className='upcoming-card'>
              <div className='upcoming-card-image'>
                <img
                  src={`http://localhost:8080/${session.image}`}
                  alt={session.title}
                  style={{
                    height: '120px',
                    width: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>

              <Card.Body>
                <p className='upcoming-card-title'>
                  <strong>Course Title:</strong> {session.title}
                </p>
                <p className='upcoming-card-date'>
                  <strong>Start Date & Time:</strong> {session.date} at{' '}
                  {session.startTime}
                </p>
                <p className='upcoming-card-duration'>
                  <strong>Duration:</strong> {session.duration}
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

      {sessions.length > 3 && (
        <Button
          variant='success'
          className='upcoming-calendar-btn mt-3'
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? 'Show Less' : 'Show More'}
        </Button>
      )}
    </Container>
  )
}

export default UpcomingCourses
