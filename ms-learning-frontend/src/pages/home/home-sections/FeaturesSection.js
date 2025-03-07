import React from 'react'

const FeaturesSection = () => {
  return (
    <section className='section-container'>
      <div className='container feature-container'>
        <div className='feature-box'>
          <div className='feature-header'>Chatbot</div>
          <div className='feature-icon'>
            <i className='bi bi-robot'></i>
          </div>
          <p className='feature-text'>
            Get instant help from our virtual assistant
          </p>
        </div>

        <div className='feature-box'>
          <div className='feature-header'>Multilingual Support</div>
          <div className='feature-icon'>
            <i className='bi bi-globe'></i>
          </div>
          <p className='feature-text'>Learn in your preferred language</p>
        </div>

        <div className='feature-box'>
          <div className='feature-header'>Interactive Quizzes</div>
          <div className='feature-icon'>
            <i className='bi bi-puzzle'></i>
          </div>
          <p className='feature-text'>
            Test your knowledge with instant feedback
          </p>
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection
