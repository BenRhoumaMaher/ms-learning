import React from 'react'
import CalendarDay from './CalendarDay'

const CalendarGrid = ({
  currentMonth,
  currentYear,
  daysOfWeek,
  getDaysInMonth,
  getStartDay,
  hasLiveSession,
  selectedDate,
  onDateClick,
  onDateHover,
  onMouseLeave
}) => {
  const daysInMonth = getDaysInMonth(currentMonth, currentYear)
  const startDay = getStartDay(currentMonth, currentYear)

  return (
    <>
      <div className='calendar-weekdays'>
        {daysOfWeek.map((day, index) => (
          <div key={index} className='weekday'>
            {day}
          </div>
        ))}
      </div>

      <div className='calendar-grid'>
        {Array.from({ length: startDay }).map((_, index) => (
          <div key={`empty-${index}`} className='calendar-empty'></div>
        ))}

        {Array.from({ length: daysInMonth }, (_, index) => {
          const day = index + 1
          return (
            <CalendarDay
              key={day}
              day={day}
              hasSession={hasLiveSession(day)}
              isSelected={selectedDate === day}
              onClick={() => onDateClick(day)}
              onMouseEnter={e => onDateHover(e, day)}
              onMouseLeave={onMouseLeave}
            />
          )
        })}
      </div>
    </>
  )
}

export default CalendarGrid
