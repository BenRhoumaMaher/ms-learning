import React, { useState, useEffect } from 'react'
import { getLatestCourses } from '../../../helpers/api'

const FreshDrops = () => {
  const [courses, setCourses] = useState([])
  const [visibleCount, setVisibleCount] = useState(3)
  const [loading, setLoading] = useState(true)

  const handleShowLess = () => {
    setVisibleCount(3)
  }

  useEffect(() => {
    const fetchLatestCourses = async () => {
      try {
        const data = await getLatestCourses()
        setCourses(data)
      } catch (error) {
        console.error('Error fetching latest courses:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLatestCourses()
  }, [])

  const handleShowMore = () => {
    setVisibleCount(prev => prev + 3)
  }

  if (loading) {
    return <div className='container my-5'>Loading courses...</div>
  }

  if (courses.length === 0) {
    return <div className='container my-5'>No courses available</div>
  }

  return (
    <div className='container my-5'>
      <h3 className='text-dark fw-bold'>
        Fresh Drops : <span className='text-danger'>New & Noteworthy</span>
      </h3>
      <p className='text-success'>Explore the newest courses added</p>

      <div className='row'>
        {courses.slice(0, visibleCount).map((course, index) => (
          <div key={index} className='col-md-4 mb-4'>
            <div className='freshdrops-card h-100'>
              <div className=''>
                {course.image && (
                  <img
                    src={`http://localhost:8080/${course.image}`}
                    alt={course.name}
                    className=''
                    style={{
                      height: '200px',
                      width: '100%',
                      objectFit: 'cover'
                    }}
                  />
                )}
              </div>
              <div className='freshdrops-content p-3'>
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
            className='btn freshdrops-showmore-btn mb-5'
            onClick={handleShowMore}
          >
            Show more
          </button>
        ) : (
          visibleCount > 3 && (
            <button
              className='btn freshdrops-showless-btn mb-5'
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

export default FreshDrops
