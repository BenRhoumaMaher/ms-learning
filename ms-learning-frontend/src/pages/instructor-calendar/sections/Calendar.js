import React, { useEffect } from 'react'
import { useCalendar } from '../../../hooks/useCalendar'
import CalendarHeader from '../../../components/instructor-calendar/CalendarHeader'
import CalendarGrid from '../../../components/instructor-calendar/CalendarGrid'
import SessionDetailsPopup from '../../../components/instructor-calendar/SessionDetailsPopup'
import LessonFormModal from '../../../components/instructor-calendar/LessonFormModal'

const Calendar = () => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token')
  const user = token ? JSON.parse(atob(token.split('.')[1])) : null
  const userId = token ? user.user_id : null

  const {
    state,
    setState,
    months,
    daysOfWeek,
    fetchUserCourses,
    fetchLiveSessions,
    navigateMonth,
    getDaysInMonth,
    getStartDay,
    hasLiveSession,
    getSessionsForDate,
    handleDateHover,
    handleSaveLesson
  } = useCalendar(userId)

  useEffect(() => {
    if (userId) {
      fetchUserCourses()
      fetchLiveSessions()
    }
  }, [userId, fetchUserCourses, fetchLiveSessions])

  const getModulesForSelectedCourse = () => {
    if (!state.selectedCourse) return []
    const course = state.userCourses.find(
      c => c.id.toString() === state.selectedCourse.toString()
    )
    return course?.modules || []
  }

  if (!userId) {
    return <div>Please log in to view the calendar</div>
  }

  return (
    <div className='calendar-container'>
      <CalendarHeader
        months={months}
        currentMonth={state.currentMonth}
        currentYear={state.currentYear}
        onNavigate={navigateMonth}
      />

      <CalendarGrid
        currentMonth={state.currentMonth}
        currentYear={state.currentYear}
        daysOfWeek={daysOfWeek}
        getDaysInMonth={getDaysInMonth}
        getStartDay={getStartDay}
        hasLiveSession={hasLiveSession}
        selectedDate={state.selectedDate}
        onDateClick={day =>
          setState(prev => ({
            ...prev,
            selectedDate: day,
            showModal: true
          }))
        }
        onDateHover={handleDateHover}
        onMouseLeave={() =>
          setState(prev => ({ ...prev, hoveredSession: null }))
        }
      />

      {state.hoveredSession && (
        <SessionDetailsPopup
          sessions={state.hoveredSession.sessions}
          position={state.popupPosition}
        />
      )}

      <LessonFormModal
        show={state.showModal}
        onHide={() => setState(prev => ({ ...prev, showModal: false }))}
        state={state}
        setState={setState}
        months={months}
        handleSaveLesson={handleSaveLesson}
        getModulesForSelectedCourse={getModulesForSelectedCourse}
      />
    </div>
  )
}

export default Calendar
