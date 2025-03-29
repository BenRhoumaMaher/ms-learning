import React from 'react'
import '../../styles/styles.css'
import HeroSection from './sections/HeroSection'
import Calendar from './sections/Calendar'
import Footer from '../../layouts/Footer'

const StudentCalendar = () => {
  return (
    <section>
      <section className='section-container'>
        <HeroSection />
      </section>
      <section className='section-container'>
        <Calendar />
      </section>
      <Footer />
    </section>
  )
}

export default StudentCalendar
