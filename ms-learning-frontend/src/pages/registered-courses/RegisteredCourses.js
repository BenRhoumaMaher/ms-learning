import React from 'react'
import '../../styles/styles.css'
import RegisteredCoursesHero from './sections/RegisteredCoursesHero'
import CourseContent from './sections/CourseContent'
import InstructorSection from './sections/InstructorSection'
import StudentReviews from './sections/StudentReviews'
import CourseDiscussions from './sections/CourseDiscussions'
import Footer from '../../layouts/Footer'
import { useParams } from 'react-router-dom'

const RegisteredCourses = () => {
  const { id } = useParams()
  return (
    <section>
      <section className='section-container'>
        <RegisteredCoursesHero courseId={id} />
      </section>
      <section className='section-container'>
        <CourseContent courseId={id} />
      </section>
      <section className='section-container'>
        <InstructorSection courseId={id}  />
      </section>
      <section className='section-container'>
        <StudentReviews courseId={id} />
      </section>
      <section className='section-container'>
        <CourseDiscussions courseId={id} />
      </section>
      <Footer />
    </section>
  )
}

export default RegisteredCourses
