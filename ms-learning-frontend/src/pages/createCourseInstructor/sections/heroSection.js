import React from 'react'
const HeroSection = ({ scrollToForm, userName }) => {
  const isAuthenticated =
    localStorage.getItem('token') || sessionStorage.getItem('token')
  const user = isAuthenticated
    ? JSON.parse(atob(isAuthenticated.split('.')[1]))
    : null
  return (
    <section className='createCourse-hero-section d-flex align-items-center justify-content-center text-center'>
      <div className='createCourse-hero-content'>
        <h1 className='display-4'>Welcome, {userName}</h1>
        <button className='btn btn-info btn-lg mt-3' onClick={scrollToForm}>
          Start Building Your Legacy
        </button>
      </div>
    </section>
  )
}

export default HeroSection
