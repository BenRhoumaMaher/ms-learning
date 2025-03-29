import React from 'react'
import '../../styles/styles.css'
import DashboardHero from './sections/DashboardHero'
import InstructorPerformance from './sections/InstructorPerformance'
import UpcomingLiveSessions from './sections/UpcomingLiveSessions'
import EarningsDashboard from './sections/EarningsDashboard'
import InsctructorCourses from './sections/InsctructorCourses'
import InsctructorCommunity from './sections/InstructorCommunity'
import Footer from '../../layouts/Footer'

const InstructorDashboard= () => {
  return (
    <section>
      <section className='section-container'>
        <DashboardHero />
      </section>
      <section className='section-container'>
        <InstructorPerformance />
      </section>
      <section className='section-container'>
        <UpcomingLiveSessions />
      </section>
      <section className='section-container'>
        <EarningsDashboard />
      </section>
      <section className='section-container'>
        <InsctructorCourses />
      </section>
      <section className='section-container'>
        <InsctructorCommunity />
      </section>
      <Footer />
    </section>
  )
}

export default InstructorDashboard
