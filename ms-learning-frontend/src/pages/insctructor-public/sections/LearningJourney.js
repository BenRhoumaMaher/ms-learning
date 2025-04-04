import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Button, Card } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import { getInstructorCourses } from '../../../helpers/api'

const LearningJourney = () => {
  const { id } = useParams()
  const [courses, setCourses] = useState([])
  const [username, setUsername] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [categories, setCategories] = useState(['All'])

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getInstructorCourses(id)
        setCourses(data.courses || [])
        setUsername(data.username || '')

        const dynamicCategories = [
          'All',
          ...new Set(
            data.courses.map(course => course.category).filter(Boolean)
          )
        ]
        setCategories(dynamicCategories)
      } catch (error) {
        console.error('Failed to fetch instructor courses:', error)
      }
    }

    if (id) {
      fetchCourses()
    }
  }, [id])

  return (
    <Container className='learning-section'>
      <h4 className='fw-bold text-center'>
        Explore the <span className='learning-title'>Learning Journey</span>
      </h4>
      <p className='text-success text-center'>
        Get into a world of knowledge with courses taught by{' '}
        <strong>{username}</strong>
      </p>

      <div className='text-center my-3'>
        <span className='category-label'>Jump To</span>
        {categories.map((category, index) => (
          <Button
            key={index}
            variant={
              selectedCategory === category ? 'primary' : 'outline-primary'
            }
            className='mx-2 category-btn'
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      <Row className='mt-4'>
        {courses
          .filter(
            course =>
              selectedCategory === 'All' || course.category === selectedCategory
          )
          .map((course, index) => (
            <Col md={3} key={index}>
              <Card className='course-card'>
                <Card.Body>
                  <Card.Title className='course-title'>
                    {course.title}
                  </Card.Title>
                  <Card.Text className='course-description'>
                    {course.description}
                  </Card.Text>
                  <div className='rating'>
                    <span className='stars'>⭐⭐⭐⭐⭐</span> 4.9/5
                  </div>
                  <p className='enrollments'>+350 enrollments</p>
                  <Button variant='info' className='enroll-btn'>
                    Enroll
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
      </Row>

      <div className='mt-4'>
        <Button variant='primary' className='lshow-more-btn'>
          Show more
        </Button>
      </div>
    </Container>
  )
}

export default LearningJourney
