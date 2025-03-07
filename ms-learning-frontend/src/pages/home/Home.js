import React from 'react'
import '../../styles/styles.css'
import FeaturesSection from './home-sections/FeaturesSection'
import CoursesSection from './home-sections/CoursesSection'
import ConnectArea from './home-sections/ConnectArea'
import TestimonialsSection from './home-sections/TestimonialsSection'
import RegisterSection from './home-sections/RegisterSection'
import FAQSection from './home-sections/FAQSection'
import Footer from '../../layouts/Footer'
import HeroSection from './home-sections/HeroSection'

const Home = () => {
  return (
    <div className='home-container'>
      <HeroSection />
      <FeaturesSection />
      <section className='section-container'>
        <CoursesSection />
      </section>
      <section className='section-container'>
        <ConnectArea />
      </section>
      <section className='section-container'>
        <TestimonialsSection />
      </section>
      <section className='section-container'>
        <RegisterSection />
      </section>
      <section className='section-container'>
        <FAQSection />
      </section>
      <Footer />
    </div>
  )
}

export default Home
