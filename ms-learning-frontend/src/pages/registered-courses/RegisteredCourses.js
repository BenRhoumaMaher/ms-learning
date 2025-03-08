import React from 'react'
import '../../styles/styles.css'
import RegisteredCoursesHero from './sections/RegisteredCoursesHero'
import CourseContent from './sections/CourseContent'
import InstructorSection from './sections/InstructorSection'
import StudentReviews from './sections/StudentReviews'
import CourseDiscussions from './sections/CourseDiscussions'
import Footer from '../../layouts/Footer'

const RegisteredCourses = () => {
  return (
    <section>
      <section className='section-container'>
        <RegisteredCoursesHero />
      </section>
      <section className='section-container'>
        <CourseContent />
      </section>
      <section className='section-container'>
        <InstructorSection />
      </section>
      <section className='section-container'>
        <StudentReviews />
      </section>
      <section className='section-container'>
        <CourseDiscussions />
      </section>
      <Footer />
    </section>
  )
}

export default RegisteredCourses
