import React from 'react'
import '../../styles/styles.css'
import HeroSection from './sections/HeroSection'
import AssignmentsSection from './sections/AssignmentsSection'
import YourProgress from './sections/YourProgress'
import KeepLearning from './sections/KeepLearning'
import Footer from '../../layouts/Footer'
import { useParams } from 'react-router-dom'
const LessonPlayer = () => {
  const { id } = useParams()
  return (
    <section>
      <section className='section-container'>
        <HeroSection lessonId={id} />
      </section>
      <section className='section-container'>
        <AssignmentsSection />
      </section>
      <section className='section-container'>
        <YourProgress />
      </section>
      <section className='section-container'>
        <KeepLearning lessonId={id} />
      </section>
      <Footer />
    </section>
  )
}

export default LessonPlayer
