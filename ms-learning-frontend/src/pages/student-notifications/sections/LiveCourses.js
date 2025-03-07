import React from 'react'

const LiveCourses = () => {
  return (
    <section className='section-container'>
      <div className='container text-start'>
        <h3 className='fw-bold'>Your Live Courses Reminders</h3>
        <p className='text-primary'>Don't miss your upcoming live sessions</p>

        <div className='live-courses-container gap-5'>
          <div className='nav-hand text-info'>
            <i className='bi bi-hand-index-thumb-fill'></i>
          </div>

          <div className='course-card'>
            <h4 className='fw-bold'>Course Title</h4>
            <p className='text-primary'>Instructor Name</p>
            <p>Start Date & Time</p>
            <p className='text-danger'>Countdown Timer</p>
            <button className='btn btn-info'>Join Live</button>
          </div>

          <div className='course-card'>
            <h4 className='fw-bold'>Course Title</h4>
            <p className='text-primary'>Instructor Name</p>
            <p>Start Date & Time</p>
            <p className='text-danger'>Countdown Timer</p>
            <button className='btn btn-info'>Join Live</button>
          </div>

          <div className='nav-hand text-info'>
            <i className='bi bi-hand-index-thumb-fill'></i>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LiveCourses
