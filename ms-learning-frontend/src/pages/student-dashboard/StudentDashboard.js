import React from 'react'
import '../../styles/styles.css'
import HeroSection from './sections/HeroSection'
import LiveUpcomingSession from './sections/LiveUpcomingSession'
import CourseSection from './sections/CourseSection'
import BrainyStatsSection from './sections/BrainyStatsSection'
import QuizzesCertificatesSection from './sections/QuizzesCertificatesSection'
import QuickAccessSection from './sections/QuickAccessSection'
import DontStopNowSection from './sections/DontStopNowSection'
import Footer from '../../layouts/Footer'

const StudentDashboard = () => {
  return (
    <section>
      <section className='section-container'>
        <HeroSection />
      </section>
      <section className='section-container'>
        <LiveUpcomingSession />
      </section>
      <section className='section-container'>
        <CourseSection />
      </section>
      <section className='section-container'>
        <BrainyStatsSection />
      </section>
      <section className='section-container'>
        <QuizzesCertificatesSection />
      </section>
      <section className='section-container'>
        <QuickAccessSection />
      </section>
      <section className='section-container'>
        <DontStopNowSection />
      </section>
      <Footer />
    </section>
  )
}

export default StudentDashboard
