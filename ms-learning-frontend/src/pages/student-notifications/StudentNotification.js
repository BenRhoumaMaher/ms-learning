import React from 'react'
import '../../styles/styles.css'
import HeroSection from './sections/HeroSection'
import UpcomingDeadlinesSection from './sections/UpcomingDeadlinesSection'
import NewCoursesSection from './sections/NewCoursesSection'
import CommunityMessages from './sections/CommunityMessages'
import LiveCourses from './sections/LiveCourses'
import Footer from '../../layouts/Footer'

const StudentDashboard = () => {
  return (
    <section>
      <section className='section-container'>
        <HeroSection />
      </section>
      <section className='section-container'>
        <UpcomingDeadlinesSection />
      </section>
      <section className='section-container'>
        <NewCoursesSection />
      </section>
      <section className='section-container'>
        <CommunityMessages />
      </section>
      <section className='section-container'>
        <LiveCourses />
      </section>
      <Footer />
    </section>
  )
}

export default StudentDashboard
