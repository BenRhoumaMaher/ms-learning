import React, { useState } from "react";
import { useLiveLessonsByDate } from "../../../hooks/useLiveLessonsByDate";

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(3);
  const [currentYear, setCurrentYear] = useState(2025);
  const [selectedDate, setSelectedDate] = useState(null);
  const { lessonsByDate } = useLiveLessonsByDate();

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysOfWeek = ["M", "Tu", "W", "Th", "F", "Sa", "Su"];

  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

  const getStartDay = (month, year) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const handlePrevMonth = () => {
    setCurrentMonth(prev => (prev === 0 ? 11 : prev - 1));
    if (currentMonth === 0) setCurrentYear(prev => prev - 1);
    setSelectedDate(null);
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => (prev === 11 ? 0 : prev + 1));
    if (currentMonth === 11) setCurrentYear(prev => prev + 1);
    setSelectedDate(null);
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const startDay = getStartDay(currentMonth, currentYear);

  const formatDateKey = (year, month, day) => {
    const m = String(month + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    return `${year}-${m}-${d}`;
  };

  return (
    <div className="stdc-calendar-container">
      <div className="stdc-calendar-header">
        <button className="stdc-nav-btn" onClick={handlePrevMonth}>❮</button>
        <h2>{months[currentMonth]} {currentYear}</h2>
        <button className="stdc-nav-btn" onClick={handleNextMonth}>❯</button>
      </div>

      <div className="stdc-calendar-weekdays">
        {daysOfWeek.map((day, index) => (
          <div key={index} className="stdc-weekday">{day}</div>
        ))}
      </div>

      <div className="stdc-calendar-grid">
        {Array.from({ length: startDay }).map((_, index) => (
          <div key={`empty-${index}`} className="stdc-calendar-empty"></div>
        ))}
        {Array.from({ length: daysInMonth }, (_, index) => {
          const day = index + 1;
          const dateKey = formatDateKey(currentYear, currentMonth, day);
          const lessons = lessonsByDate[dateKey] || [];
          const hasLesson = lessons.length > 0;

          return (
            <div
              key={day}
              className={`stdc-calendar-day ${selectedDate === day ? "stdc-selected" : ""} ${hasLesson ? "stdc-has-lesson" : ""}`}
              onClick={() => setSelectedDate(day)}
            >
              {day}
              {hasLesson && (
                <div className="stdc-tooltip">
                  {lessons.map((lesson, idx) => {
                    const startTime = new Date(lesson.liveStartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    return (
                      <div key={idx} className="stdc-tooltip-item">
                        <strong>{lesson.title}</strong><br />
                        🕒 {startTime} | ⏱ {lesson.duration} min
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
