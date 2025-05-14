import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { getInstructorCourses } from '../../../helpers/api'

const InstructorPerformance = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(0)
  const navigate = useNavigate()

  const courseColors = ['#B0B0B0', '#17B890', '#2D8CFF', '#FF6B6B', '#4ECDC4', '#FFCC00']

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token')
        if (!token) throw new Error('No authentication token found')

        const user = JSON.parse(atob(token.split('.')[1]))
        const userId = user?.user_id

        if (!userId) throw new Error('User ID not found in token')

        const data = await getInstructorCourses(userId)
        setCourses(data.courses || [])
        setLoading(false)
      } catch (err) {
        console.error('Failed to fetch courses:', err)
        setError(err.message)
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  const getPaginatedCourses = () => {
    const startIndex = currentPage * 3
    return courses.slice(startIndex, startIndex + 3)
  }

  const handleNextPage = () => {
    if ((currentPage + 1) * 3 < courses.length) {
      setCurrentPage(currentPage + 1)
    } else {
      setCurrentPage(0)
    }
  }

  const handleViewDetails = (courseId) => {
    navigate(`/registered-courses/${courseId}`)
  }

  if (loading) return (
    <Container fluid className='instrc-container'>
      <div className="text-center py-5">Loading course data...</div>
    </Container>
  )

  if (error) return (
    <Container fluid className='instrc-container'>
      <div className="text-center py-5 text-danger">
        Error loading courses: {error}
        <div className="mt-3">
          <Button variant="primary" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    </Container>
  )

  if (courses.length === 0) return (
    <Container fluid className='instrc-container'>
      <div className="text-center py-5">
        No courses found. Create your first course to get started!
      </div>
    </Container>
  )

  return (
    <Container fluid className='instrc-container'>
      <h2 className='instrc-title'>Your Course Performance</h2>
      <p className='instrc-subtitle mb-5'>
        Track how your courses are performing
      </p>

      <Row className='instrc-cards'>
        {getPaginatedCourses().map((course, index) => (
          <Col key={course.id} md={4} className='instrc-card-wrapper'>
            <div
              className='instrc-card'
              style={{ backgroundColor: courseColors[(currentPage * 3 + index) % courseColors.length] }}
            >
              <div className='instrc-icon bg-info'>
                <i className='fas fa-book text-light'></i>
              </div>
              <h4 className='instrc-card-title'>{course.title}</h4>
              <p className='instrc-text'>
                {course.students?.length || 0} Enrollments
              </p>
              <Button
                className='instrc-btn'
                onClick={() => handleViewDetails(course.id)}
              >
                View Details
              </Button>
            </div>
          </Col>
        ))}
      </Row>

      {courses.length > 3 && (
        <div
          className='instrc-scroll-indicator'
          onClick={handleNextPage}
          style={{ cursor: 'pointer' }}
        >
          <i className='fas fa-arrow-right text-info'></i>
        </div>
      )}
    </Container>
  )
}

export default InstructorPerformance