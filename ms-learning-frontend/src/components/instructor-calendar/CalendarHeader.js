import React from 'react'

const CalendarHeader = ({ months, currentMonth, currentYear, onNavigate }) => {
  return (
    <div className='calendar-header'>
      <button className='nav-btn' onClick={() => onNavigate('prev')}>
        ❮
      </button>
      <h2>
        {months[currentMonth]} {currentYear}
      </h2>
      <button className='nav-btn' onClick={() => onNavigate('next')}>
        ❯
      </button>
    </div>
  )
}

export default CalendarHeader
