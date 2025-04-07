import React from 'react'

const RegisteredCoursesHero = () => {
  return (
    <div className='registered-hero gap-5'>
      <div className='course-section'>
        <div className='certificate-icon'>
          <i className='fas fa-image fa-5x text-info'></i>
        </div>
        <h3 className='course-title'>
          Mastering React.js From Beginner to Pro
        </h3>
        <p className='course-author'>
          By Maher Bnr | <span className='star'>⭐</span> 4.8 (2,000+ Reviews)
        </p>
      </div>

      <div className='welcome-section'>
        <h4>Welcome</h4>
        <h5>Student Name</h5>
      </div>

      <div className='session-section'>
        <video className='video-player w-100' controls>
          <source src='/videos/sample-video.mp4' type='video/mp4' />
          Your browser does not support the video tag.
        </video>
        <div className='session-info-container'>
          <p className='session-info'>Upcoming Live Session in 2 days</p>
        </div>
      </div>
    </div>
  )
}

export default RegisteredCoursesHero
