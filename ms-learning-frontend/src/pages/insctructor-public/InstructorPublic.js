import React from 'react'
import '../../styles/styles.css'
import HeroSection from './sections/HeroSection'
import BehindExpertise from './sections/BehindExpertise'
import LearningJourney from './sections/LearningJourney'
import UpcomingCourses from './sections/UpcomingCourses'
import ConnectSection from './sections/ConnectSection'
import Footer from '../../layouts/Footer'
const Quiz = () => {
  return (
    <section>
      <section className='section-container'>
        <HeroSection />
      </section>
      <section className='section-container'>
        <BehindExpertise />
      </section>
      <section className='section-container'>
        <LearningJourney />
      </section>
      <section className='section-container'>
        <UpcomingCourses />
      </section>
      <section className='section-container'>
        <ConnectSection />
      </section>
      <Footer />
    </section>
  )
}

export default Quiz
