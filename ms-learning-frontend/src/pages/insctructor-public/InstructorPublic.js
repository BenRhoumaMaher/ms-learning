import React from 'react'
import { useParams } from 'react-router-dom'
import '../../styles/styles.css'
import HeroSection from './sections/HeroSection'
import BehindExpertise from './sections/BehindExpertise'
import LearningJourney from './sections/LearningJourney'
import UpcomingCourses from './sections/UpcomingCourses'
import ConnectSection from './sections/ConnectSection'
import Footer from '../../layouts/Footer'
const InstructorPublic = () => {
  const { id } = useParams()
  return (
    <section>
      <section className='section-container'>
        <HeroSection id={id} />
      </section>
      <section className='section-container'>
        <BehindExpertise id={id} />
      </section>
      <section className='section-container'>
        <LearningJourney />
      </section>
      <section className='section-container'>
        <UpcomingCourses />
      </section>
      <section className='section-container'>
        <ConnectSection id={id} />
      </section>
      <Footer />
    </section>
  )
}

export default InstructorPublic
