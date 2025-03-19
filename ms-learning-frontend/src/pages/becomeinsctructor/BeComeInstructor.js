import React, { useRef } from 'react'
import '../../styles/styles.css'
import BecomeInstructorHero from './sections/BecomeInstructorHero'
import WhyTeachWithUs from './sections/WhyTeachWithUs'
import HowToBecomeInstructor from './sections/HowToBecomeInstructor'
import InstructorSuccessStories from './sections/InstructorSuccessStories'
import FaqSection from './sections/FaqSection'
import JoinFamily from './sections/JoinFamily'
import Footer from '../../layouts/Footer'

const BecomeInstructor = () => {
  const joinFamilyRef = useRef(null);

  const scrollToJoinFamily = () => {
    if (joinFamilyRef.current) {
      joinFamilyRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section>
      <section className='section-container'>
        <BecomeInstructorHero scrollToJoinFamily={scrollToJoinFamily} />
      </section>
      <section className='section-container'>
        <WhyTeachWithUs scrollToJoinFamily={scrollToJoinFamily} />
      </section>
      <section className='section-container'>
        <HowToBecomeInstructor />
      </section>
      <section className='section-container'>
        <InstructorSuccessStories />
      </section>
      <section className='section-container'>
        <FaqSection />
      </section>
      <section className='section-container' ref={joinFamilyRef}>
        <JoinFamily />
      </section>
      <Footer />
    </section>
  )
}

export default BecomeInstructor
