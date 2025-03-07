import React, { useState } from "react";

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(3);
  const [currentYear, setCurrentYear] = useState(2025);
  const [selectedDate, setSelectedDate] = useState(null);

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
    setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1));
    if (currentMonth === 0) setCurrentYear((prev) => prev - 1);
    setSelectedDate(null);
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1));
    if (currentMonth === 11) setCurrentYear((prev) => prev + 1);
    setSelectedDate(null);
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const startDay = getStartDay(currentMonth, currentYear);

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button className="nav-btn" onClick={handlePrevMonth}>❮</button>
        <h2>{months[currentMonth]} {currentYear}</h2>
        <button className="nav-btn" onClick={handleNextMonth}>❯</button>
      </div>

      <div className="calendar-weekdays">
        {daysOfWeek.map((day, index) => (
          <div key={index} className="weekday">{day}</div>
        ))}
      </div>

      <div className="calendar-grid">
        {Array.from({ length: startDay }).map((_, index) => (
          <div key={`empty-${index}`} className="calendar-empty"></div>
        ))}
        {Array.from({ length: daysInMonth }, (_, index) => {
          const day = index + 1;
          return (
            <div
              key={day}
              className={`calendar-day ${selectedDate === day ? "selected" : ""}`}
              onClick={() => setSelectedDate(day)}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
