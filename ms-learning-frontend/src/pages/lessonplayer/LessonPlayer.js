import React from 'react'
import '../../styles/styles.css'
import HeroSection from './sections/HeroSection'
import AssignmentsSection from './sections/AssignmentsSection'
import YourProgress from './sections/YourProgress'
import KeepLearning from './sections/KeepLearning'
import Footer from '../../layouts/Footer'
const LessonPlayer = () => {
  return (
    <section>
      <section className='section-container'>
        <HeroSection />
      </section>
      <section className='section-container'>
        <AssignmentsSection />
      </section>
      <section className='section-container'>
        <YourProgress />
      </section>
      <section className='section-container'>
        <KeepLearning />
      </section>
      <Footer />
    </section>
  )
}

export default LessonPlayer
