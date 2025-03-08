import React from 'react'
import '../../styles/styles.css'
import QuizHero from './sections/QuizHero'
import QuizQuestion from './sections/QuizQuestion'
import QuizResults from './sections/QuizResults'
import CompareResults from './sections/CompareResults'
import KeepLearning from './sections/KeepLearning'
import Footer from '../../layouts/Footer'
const Quiz = () => {
  return (
    <section>
      <section className='section-container'>
        <QuizHero />
      </section>
      <section className='section-container'>
        <QuizQuestion />
      </section>
      <section className='section-container'>
        <QuizResults />
      </section>
      <section className='section-container'>
        <CompareResults />
      </section>
      <section className='section-container'>
        <KeepLearning />
      </section>
      <Footer />
    </section>
  )
}

export default Quiz
