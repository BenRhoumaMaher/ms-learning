import React, { useState, useEffect } from 'react'
import { getRecommendedCourses } from '../../../helpers/api'
import { useNavigate } from 'react-router-dom'

const JustForYou = () => {
  const [courses, setCourses] = useState([])
  const [visibleCount, setVisibleCount] = useState(3)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const getUserId = () => {
    const token =
      localStorage.getItem('token') || sessionStorage.getItem('token')
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload.user_id
    }
    return null
  }

  useEffect(() => {
    const fetchRecommendedCourses = async () => {
      const userId = getUserId()
      if (!userId) {
        setLoading(false)
        return
      }

      try {
        const data = await getRecommendedCourses(userId)
        setCourses(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Error fetching recommended courses:', error)
        setCourses([])
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendedCourses()
  }, [])

  const handleShowMore = () => {
    setVisibleCount(prev => prev + 3)
  }

  const handleShowLess = () => {
    setVisibleCount(3)
  }

  const handleCourseClick = courseId => {
    navigate(`/course/${courseId}`)
  }

  if (loading) {
    return (
      <div className='container my-5 mt-5'>
        <p>Loading recommended courses...</p>
      </div>
    )
  }

  if (courses.length === 0) {
    return (
      <div className='container my-5 mt-5'>
        <h3 className='text-danger fw-bold'>Just for You</h3>
        <p className='text-success'>
          Courses handpicked to match your interests
        </p>
        <p>No recommended courses found based on your interests.</p>
      </div>
    )
  }

  return (
    <div className='container my-5 mt-5'>
      <h3 className='text-danger fw-bold'>Just for You</h3>
      <p className='text-success'>Courses handpicked to match your interests</p>

      <div className='row'>
        {courses.slice(0, visibleCount).map(course => (
          <div key={course.id} className='col-md-4 mb-4'>
            <div
              className='justforyou-card h-100'
              onClick={() => handleCourseClick(course.id)}
              style={{ cursor: 'pointer' }}
            >
              <div className=''>
                {course.image && (
                  <img
                    src={`http://localhost:8080/${course.image}`}
                    alt={course.name}
                    className='img-fluid'
                    style={{
                      height: '200px',
                      width: '100%',
                      objectFit: 'cover'
                    }}
                  />
                )}
              </div>
              <div className='justforyou-content p-3'>
                <h5 className='text-danger'>{course.name}</h5>
                <p className='text-secondary'>
                  {course.description || 'No description available'}
                </p>
                <p className='text-success'>
                  Instructor: {course.instructor?.username || 'Unknown'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className='text-center mt-3'>
        {courses.length > visibleCount ? (
          <button
            className='btn justforyou-showmore-btn mb-5'
            onClick={handleShowMore}
          >
            Show more
          </button>
        ) : (
          visibleCount > 3 && (
            <button
              className='btn justforyou-showless-btn mb-5'
              onClick={handleShowLess}
            >
              Show less
            </button>
          )
        )}
      </div>
    </div>
  )
}

export default JustForYou
