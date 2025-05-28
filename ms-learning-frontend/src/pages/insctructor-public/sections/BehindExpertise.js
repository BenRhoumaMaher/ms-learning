import React, { useEffect, useState } from 'react'
import { Container, Row, Col, ListGroup, Card } from 'react-bootstrap'
import { getInstructorById } from '../../../helpers/api'

const BehindExpertise = ({ id }) => {
  const [selectedSection, setSelectedSection] = useState('Bio')
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

  const content = {
    Bio: instructor.expertise,
    Specialization: instructor.specializations.join(', '),
    Publications: instructor.forumpoststitles.join(', '),
  }

  return (
    <Container className='expertise-section'>
      <h4 className='fw-bold text-center '>
        Behind the <span className='expertise-title'>Expertise</span>
      </h4>
      <p className='text-success text-center mb-5'>
        Discover the journey and achievements of{' '}
        <strong>{instructor.name}</strong>
      </p>

      <Row className='mt-5'>
        <Col md={4}>
          <ListGroup className='list-group'>
            <ListGroup.Item className='list-title'>
              {instructor.name}
            </ListGroup.Item>
            {Object.keys(content).map((item, index) => (
              <ListGroup.Item
                key={index}
                action
                active={selectedSection === item}
                onClick={() => setSelectedSection(item)}
                className='list-item'
              >
                {item}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>

        <Col md={8}>
          <Card className='content-card'>
            <Card.Body>
              <Card.Text className='content-text'>
                {content[selectedSection]}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default BehindExpertise
