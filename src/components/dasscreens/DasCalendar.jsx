import React, { useState } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
} from "date-fns";

const DasCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [milestoneDates, setMilestoneDates] = useState([]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const toggleMilestone = (day) => {
    const exists = milestoneDates.some((d) => isSameDay(d, day));
    if (exists) {
      setMilestoneDates((prev) => prev.filter((d) => !isSameDay(d, day)));
    } else {
      setMilestoneDates((prev) => [...prev, day]);
    }
  };

  const handleDateSelect = (day) => {
    setSelectedDate(day);
    toggleMilestone(day);
  };

  return (
<div className="space-y-4 bg-[#F5F5F5] rounded-md p-3 h-[433px]">
      <div className="text-[#441410] rounded-md px-4 py-1 font-semibold text-center">
        List of Projects & Timeline
      </div>

      <div className="text-sm text-[#1f1f1f] font-semibold flex justify-between px-1">
        <p>Project : <span className="font-semibold">3</span></p>
        <p>Timeline : <span className="font-semibold">3 years</span></p>
      </div>

      <div className="text-[#441410] rounded-md px-4 py-1 font-semibold text-center">
        Start Date
      </div>

      <div className="bg-white border border-gray-300 rounded-md p-4 h-[17rem]">
        <div className="flex justify-between items-center mb-2">
          <button onClick={prevMonth} className="text-[#1f1f1f] text-sm font-medium">
            &lt; Prev
          </button>
          <p className="text-sm font-semibold text-[#1f1f1f]">
            {format(currentMonth, "MMMM yyyy")}
          </p>
          <button onClick={nextMonth} className="text-[#1f1f1f] text-sm font-medium">
            Next &gt;
          </button>
        </div>

        <div className="grid grid-cols-7 gap-[1rem] text-xs text-[#1f1f1f]">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
            <div key={d} className="font-semibold text-center py-1">{d}</div>
          ))}

          {Array.from({ length: monthStart.getDay() }).map((_, i) => (
            <div key={`empty-${i}`} className="py-1" />
          ))}

          {daysInMonth.map((day, i) => {
            const isSelected = isSameDay(day, selectedDate);
            const isMilestone = milestoneDates.some((d) => isSameDay(d, day));

            return (
              <div
                key={i}
                onClick={() => handleDateSelect(day)}
                className={`py-1 text-center rounded-md cursor-pointer
                  hover:bg-[#F3E8E7]
                  ${isSelected ? "bg-[#4B1916] text-white font-bold" : ""}
                  ${isMilestone && !isSelected ? "bg-[#DBB8B5]" : ""}`}
              >
                {format(day, "d")}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DasCalendar;