import React from 'react'

const LessonCountdown = ({ title, timeRemaining, children }) => {
  return (
    <div className='hero-countdown'>
      <h3 className='hero-title'>
        <strong>{title}</strong>
      </h3>
      {timeRemaining && <p className='hero-alert'>{timeRemaining}</p>}
      {children}
    </div>
  )
}

export default LessonCountdown
