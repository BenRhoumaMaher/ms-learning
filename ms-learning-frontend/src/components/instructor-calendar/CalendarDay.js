import React from 'react'

const CalendarDay = ({
  day,
  hasSession,
  isSelected,
  onClick,
  onMouseEnter,
  onMouseLeave
}) => {
  return (
    <div
      className={`calendar-day ${hasSession ? 'has-live-session' : ''} ${
        isSelected ? 'selected' : ''
      }`}
      onClick={() => onClick(day)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {day}
    </div>
  )
}

export default CalendarDay
