import React, { useEffect, useRef, useState } from 'react'
import '../../styles/styles.css'
import HeroSection from './sections/heroSection'
import Footer from '../../layouts/Footer'
import CourseForm from './sections/CourseForm'
import { getUserCourses } from '../../helpers/api'

const CreateCourse = () => {
  const [showForm, setShowForm] = useState(false)
  const [userCourses, setUserCourses] = useState([])
  const [userName, setUserName] = useState('')
  const formRef = useRef(null)

  const token = localStorage.getItem('token') || sessionStorage.getItem('token')
  const user = token ? JSON.parse(atob(token.split('.')[1])) : null
  const userId = token ? JSON.parse(atob(token.split('.')[1])).user_id : null

  useEffect(() => {
    if (userId) {
      getUserCourses()
        .then(data => {
          setUserCourses(data.courses)
          setUserName(data.username || 'Guest')
        })
        .catch(error => {
          console.error('Error fetching user courses:', error)
        })
    }
  }, [userId])

  const handleShowForm = () => {
    setShowForm(true)
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  return (
    <section>
      <section className='courscatl-hero-section'>
        <HeroSection scrollToForm={handleShowForm} userName={userName} />
      </section>

      {showForm && (
        <section className='catalog-cour-section' ref={formRef}>
          {userCourses.length > 0 ? (
            <CourseForm userCourses={userCourses} userId={userId} />
          ) : (
            <p className='text-center'>You have no courses available.</p>
          )}
        </section>
      )}

      <Footer />
    </section>
  )
}

export default CreateCourse
