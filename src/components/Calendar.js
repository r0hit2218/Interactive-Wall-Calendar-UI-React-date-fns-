import React, { useState } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  format,
  isSameDay,
  isWithinInterval,
  isSameMonth,
  isToday,
} from "date-fns";
import "./Calendar.css";
import Notes from "./Notes";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [hoverDate, setHoverDate] = useState(null);
  const [notes, setNotes] = useState({});
  const [isFlipping, setIsFlipping] = useState(false);

  // 🔥 THEMES
  const themes = {
    0: { primary: "#1976d2", range: "#e3f2fd" },
    1: { primary: "#2e7d32", range: "#e8f5e9" },
    2: { primary: "#d32f2f", range: "#ffebee" },
  };

  const monthTheme = themes[currentDate.getMonth() % 3];

  // 🔥 HOLIDAYS
  const holidays = {
    "2026-04-14": "Ambedkar Jayanti",
    "2026-04-18": "Good Friday",
  };

  // DATE CLICK
  const handleDateClick = (day) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(day);
      setEndDate(null);
    } else {
      if (day < startDate) {
        setEndDate(startDate);
        setStartDate(day);
      } else {
        setEndDate(day);
      }
    }
  };

  // CLEAR
  const clearSelection = () => {
    setStartDate(null);
    setEndDate(null);
  };

  // 🔥 MONTH NAV WITH FLIP
  const nextMonth = () => {
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentDate(
        new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
      );
      setIsFlipping(false);
    }, 300);
  };

  const prevMonth = () => {
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentDate(
        new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
      );
      setIsFlipping(false);
    }, 300);
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDateWeek = startOfWeek(monthStart);
    const endDateWeek = endOfWeek(monthEnd);

    const rows = [];
    let day = startDateWeek;

    while (day <= endDateWeek) {
      const days = [];

      for (let i = 0; i < 7; i++) {
        const cloneDay = new Date(day);

        let className = "cell";

        if (!isSameMonth(cloneDay, monthStart)) {
          className += " disabled";
        }

        if (isToday(cloneDay)) {
          className += " today";
        }

        const rangeEnd = endDate || hoverDate;

        if (
          startDate &&
          rangeEnd &&
          isWithinInterval(cloneDay, {
            start: startDate < rangeEnd ? startDate : rangeEnd,
            end: startDate > rangeEnd ? startDate : rangeEnd,
          })
        ) {
          className += " in-range";
        }

        if (startDate && isSameDay(cloneDay, startDate)) {
          className += " start";
        }

        if (endDate && isSameDay(cloneDay, endDate)) {
          className += " end";
        }

        // 🔥 HOLIDAY CHECK
        const dateKey = format(cloneDay, "yyyy-MM-dd");
        const isHoliday = holidays[dateKey];

        days.push(
          <div
            className={className}
            key={cloneDay.toISOString()}
            onClick={() => handleDateClick(cloneDay)}
            onMouseEnter={() => setHoverDate(cloneDay)}
            onMouseLeave={() => setHoverDate(null)}
            onDoubleClick={clearSelection} // 🔥 BONUS
            title={isHoliday || ""}
          >
            {format(cloneDay, "d")}

            {isHoliday && <span className="dot"></span>}
          </div>
        );

        day = addDays(day, 1);
      }

      rows.push(
        <div className="row" key={day.toISOString()}>
          {days}
        </div>
      );
    }

    return <div>{rows}</div>;
  };

  return (
    <div
      className="calendar-wrapper"
      style={{
        "--primary": monthTheme.primary,
        "--range": monthTheme.range,
      }}
    >
      {/* HANGER */}
      <div className="hanger">
        <div className="ring"></div>
      </div>

      {/* IMAGE */}
      <div className="top-image">
        <img
          src="https://images.unsplash.com/photo-1501785888041-af3ef285b470"
          alt="calendar"
        />

        <div className="month-overlay">
          <h2>{format(currentDate, "yyyy")}</h2>
          <h1>{format(currentDate, "MMMM")}</h1>
        </div>
      </div>

      {/* BODY */}
      <div className="bottom-section">
        <div className="notes-section">
          <Notes
            notes={notes}
            setNotes={setNotes}
            startDate={startDate}
            endDate={endDate}
          />
        </div>

        <div className={`calendar-section ${isFlipping ? "flip" : ""}`}>
          {/* NAV */}
          <div className="nav">
            <button onClick={prevMonth}>←</button>
            <span>{format(currentDate, "MMMM yyyy")}</span>
            <button onClick={nextMonth}>→</button>
          </div>

          {/* CLEAR */}
          {(startDate || endDate) && (
            <div style={{ textAlign: "right", marginBottom: "6px" }}>
              <button className="clear-btn" onClick={clearSelection}>
                Clear
              </button>
            </div>
          )}

          {/* DAYS */}
          <div className="days">
            {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>

          {renderCells()}
        </div>
      </div>
    </div>
  );
};

export default Calendar;