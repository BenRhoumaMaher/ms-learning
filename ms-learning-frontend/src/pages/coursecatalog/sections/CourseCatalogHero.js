import React, { useState, useEffect } from 'react'
import {
  getCourses,
  getCategories,
  updateUserInterests
} from '../../../helpers/api'
import { Link, useNavigate } from 'react-router-dom'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

const CourscatlHero = () => {
  const [courses, setCourses] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [fade, setFade] = useState(true)
  const [showInterestForm, setShowInterestForm] = useState(false)
  const [categories, setCategories] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getCourses()
        setCourses(data)
      } catch (error) {
        console.error('Error fetching courses:', error)
      }
    }
    fetchCourses()
  }, [])

  useEffect(() => {
    if (courses.length > 0) {
      const interval = setInterval(() => {
        setFade(false)
        setTimeout(() => {
          setCurrentIndex(prevIndex => (prevIndex + 1) % courses.length)
          setFade(true)
        }, 500)
      }, 10000)

      return () => clearInterval(interval)
    }
  }, [courses])

  const handleImageClick = () => {
    navigate('/registered-courses')
  }

  const handleShowInterestForm = async () => {
    try {
      const data = await getCategories()
      setCategories(data)
      setShowInterestForm(true)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleCloseInterestForm = () => {
    setShowInterestForm(false)
    setSelectedCategories([])
  }

  const handleCategoryChange = e => {
    const categoryId = parseInt(e.target.value)
    if (e.target.checked) {
      setSelectedCategories([...selectedCategories, categoryId])
    } else {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId))
    }
  }

  const handleSubmit = async () => {
    if (selectedCategories.length === 0) return

    setIsSubmitting(true)
    try {
      await updateUserInterests(selectedCategories)
      handleCloseInterestForm()
    } catch (error) {
      console.error('Error updating interests:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isAuthenticated =
    localStorage.getItem('token') || sessionStorage.getItem('token')
  const user = isAuthenticated
    ? JSON.parse(atob(isAuthenticated.split('.')[1]))
    : null

  return (
    <div className='container courscatl-hero'>
      <div className='row align-items-center'>
        <div className='col-md-6'>
          <h4 className='courscatl-title'>
            Welcome,{' '}
            <span className='courscatl-username text-info'>
              {user?.username}
            </span>{' '}
            Ready to continue learning?
          </h4>
          <p className='courscatl-link'>
            <button
              className='courscatl-add-interests btn btn-link btn-danger p-0'
              onClick={handleShowInterestForm}
            >
              Add interests for future recommendations
            </button>
          </p>

          {showInterestForm && (
            <div className="interest-form-container mt-3 p-3 border rounded">
              <h5>Select Your Interests</h5>
              <Form>
                <div className="row">
                  {categories.map(category => (
                    <div key={category.id} className="col-md-6 mb-2">
                      <Form.Check
                        type='checkbox'
                        id={`category-${category.id}`}
                        label={category.name}
                        value={category.id}
                        checked={selectedCategories.includes(category.id)}
                        onChange={handleCategoryChange}
                      />
                    </div>
                  ))}
                </div>
              </Form>
              <div className="d-flex justify-content-end mt-3">
                <Button
                  variant='secondary'
                  onClick={handleCloseInterestForm}
                  className="me-2"
                >
                  Cancel
                </Button>
                <Button
                  variant='primary'
                  onClick={handleSubmit}
                  disabled={isSubmitting || selectedCategories.length === 0}
                >
                  {isSubmitting ? 'Saving...' : 'Save Interests'}
                </Button>
              </div>
            </div>
          )}

          <Link to='/student-payment' className='btn courscatl-btn btn-warning ms-2 mt-3'>
            Change your Plan
          </Link>
        </div>

        <div className='col-md-6 d-flex justify-content-center'>
          {courses.length > 0 ? (
            <img
              key={currentIndex}
              src={`http://localhost:8080/${courses[currentIndex].image}`}
              alt={`Course ${currentIndex + 1}`}
              className={`courscatl-image-placeholder ${fade ? 'fade-in' : 'fade-out'
                }`}
              style={{
                width: '100%',
                height: 'auto',
                objectFit: 'cover'
              }}
              onClick={handleImageClick}
            />
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>

      <style>
        {`
          .fade-in {
            opacity: 1;
            transition: opacity 0.8s ease-in-out;
          }
          .fade-out {
            opacity: 0;
            transition: opacity 0.5s ease-in-out;
          }
          .interest-form-container {
            background-color: #f8f9fa;
          }
        `}
      </style>
    </div>
  )
}

export default CourscatlHero