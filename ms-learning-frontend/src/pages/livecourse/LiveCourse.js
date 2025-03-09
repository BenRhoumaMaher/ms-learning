import React from 'react'
import '../../styles/styles.css'
import HeroSection from './sections/HeroSection'
import LiveSession from './sections/LiveSession'
import LiveEngagement from './sections/LiveEngagement'
import NextLiveClasses from './sections/NextLiveClasses'
import RelatedCourses from './sections/RelatedCourses'
import CommunitySpace from './sections/CommunitySpace'
import Footer from '../../layouts/Footer'

const LiveCourse = () => {
  return (
    <section>
      <section className='section-container'>
        <HeroSection />
      </section>
      <section className='section-container'>
        <LiveSession />
      </section>
      <section className='section-container'>
        <LiveEngagement />
      </section>
      <section className='section-container'>
        <NextLiveClasses />
      </section>
      <section className='section-container'>
        <RelatedCourses />
      </section>
      <section className='section-container'>
        <CommunitySpace />
      </section>
      <Footer />
    </section>
  )
}

export default LiveCourse
