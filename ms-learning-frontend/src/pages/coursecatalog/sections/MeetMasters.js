import React, { useState, useEffect } from 'react'
import { getInstructors } from '../../../helpers/api'
import { useNavigate } from 'react-router-dom'

const MeetMasters = () => {
  const [instructors, setInstructors] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const data = await getInstructors()
        setInstructors(data)
      } catch (error) {
        console.error('Error fetching instructors:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchInstructors()
  }, [])

  const handleViewProfile = () => {
    navigate('/instructor-public/')
  }

  if (loading) {
    return (
      <section className='meetmast-section'>
        <div className='container text-center'>
          <p>Loading instructors...</p>
        </div>
      </section>
    )
  }

  if (instructors.length === 0) {
    return (
      <section className='meetmast-section'>
        <div className='container text-center'>
          <p>No instructors found</p>
        </div>
      </section>
    )
  }

  return (
    <section className='meetmast-section'>
      <div className='container text-center'>
        <h2 className='meetmast-title'>Meet the Masters</h2>
        <p className='meetmast-subtitle'>
          <a href='/' className='meetmast-link'>
            Get inspired by top instructors and explore their courses
          </a>
        </p>

        <div className='row justify-content-center'>
          {instructors.slice(0, 3).map(instructor => (
            <div key={instructor.id} className='col-md-4 mb-4'>
              <div className='meetmast-card h-100'>
                <div className='meetmast-card-header'></div>
                <div className='meetmast-avatar'>
                  {instructor.picture ? (
                    <img
                      src={`http://localhost:8080/${instructor.picture}`}
                      alt={instructor.username}
                      className='rounded-circle'
                      style={{
                        width: '100px',
                        height: '100px',
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    <i
                      className='bi bi-person'
                      style={{ fontSize: '4rem' }}
                    ></i>
                  )}
                </div>
                <div className='meetmast-card-body'>
                  <h5 className='text-dark'>{instructor.firstname} {instructor.lastname}</h5>
                  <p className='text-muted'>
                    {instructor.expertise || 'Expert Instructor'}
                  </p>
                  <button
                    onClick={() => handleViewProfile()}
                    className='btn meetmast-btn'
                  >
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default MeetMasters
