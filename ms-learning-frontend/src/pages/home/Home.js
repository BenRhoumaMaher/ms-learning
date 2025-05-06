import React, { useRef } from 'react'
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
  const faqRef = useRef(null)
  return (
    <div className='home-container'>
      <HeroSection faqRef={faqRef} />
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
      <section className='section-container' ref={faqRef}>
        <FAQSection />
      </section>
      <Footer />
    </div>
  )
}

export default Home
