import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'
import { getInstructorById } from '../../../helpers/api'

const HeroSection = ({ id }) => {
  const [instructor, setInstructor] = useState(null)

  useEffect(() => {
    const fetchInstructor = async () => {
      try {
        const data = await getInstructorById(id)
        setInstructor(data)
      } catch (error) {
        console.error('Failed to load instructor:', error)
      }
    }

    if (id) {
      fetchInstructor()
    }
  }, [id])

  if (!instructor) {
    return <div>Loading instructor...</div>
  }

  return (
    <Container className='hero-section'>
      <Row className='align-items-center'>
        <Col md={7} className='text-center'>
          <h5 className='fw-bold'>
            <span className='text-info'>{instructor.name}</span> –{' '}
            <span className='specialist'>{instructor.occupation}</span>
          </h5>

          <h5 className='mt-5'>
            <strong>
              Meet <span className='teacher-name'>{instructor.firstName}</span>
            </strong>
          </h5>
          <h5 className='text-success'>
            Your guide to mastering {instructor.specializations.join(', ')}
          </h5>

          <p className='mt-3 description'>
            {instructor.expertise.length > 20
              ? `${instructor.expertise.slice(0, 160)}...`
              : instructor.expertise}
          </p>

          <p className='course-info'>
            <span className='course-link'>
              {instructor.courseCount} Courses
            </span>{' '}
            | <span className='students'>50,000+ Students</span>
          </p>

          <Button className='follow-btn'>Follow</Button>
        </Col>

        <Col md={5} className='text-center'>
          <div className='teacher-image'>
            <img className='' src={`http://localhost:8080/${instructor.picture}`} alt='' />
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default HeroSection
