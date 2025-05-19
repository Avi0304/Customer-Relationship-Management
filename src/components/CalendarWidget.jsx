import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import Calendar from "react-calendar/dist/cjs/Calendar.js";
import "react-calendar/dist/Calendar.css";
import { useGoogleCalendar } from "../hooks/useGoogleCalendar";

const CalendarWidget = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { signIn, signOut, isSignedIn, events } = useGoogleCalendar();
  const [popupEvents, setPopupEvents] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Group events by date
  const eventsByDate = events.reduce((acc, event) => {
    const eventDate = event.start.dateTime
      ? new Date(event.start.dateTime).toLocaleDateString("en-CA")
      : event.start.date;

    console.log("Processing event:", event.summary, "on", eventDate);

    if (!acc[eventDate]) acc[eventDate] = [];
    acc[eventDate].push(event);
    return acc;
  }, {});

  const openPopup = (events) => {
    setPopupEvents(events);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setPopupEvents(null);
  };

  const renderTileContent = ({ date, view }) => {
    if (view === "month") {
      const dateKey = date.toLocaleDateString("en-CA");
      const dayEvents = eventsByDate[dateKey];

      if (dayEvents && dayEvents.length > 0) {
        const hasHoliday = dayEvents.some((event) => event.isHoliday);
        const hasEvent = dayEvents.some((event) => !event.isHoliday);

        let dotColor =
          hasHoliday && hasEvent
            ? "bg-yellow-500"
            : hasHoliday
            ? "bg-red-500"
            : "bg-green-500";

        return (
          <div className="relative flex justify-center">
            <div
              onClick={() => openPopup(dayEvents)}
              className={`mt-1 w-3 h-3 rounded-full cursor-pointer ${dotColor}`}
            />
          </div>
        );
      }
    }
    return null;
  };

  return (
    <Card className="col-span-3 bg-white shadow-lg rounded-lg p-6 w-full dark:bg-[#1B222D] min-h-[450px] relative">
      <CardHeader className="flex justify-between items-center">
        <h1 className="text-2xl font-bold leading-none tracking-tight">
          Calendar
        </h1>
        <button
          onClick={isSignedIn ? signOut : signIn}
          className="bg-blue-500 text-white px-4 py-1.5 rounded-md hover:bg-blue-600 transition shadow-md"
        >
          {isSignedIn ? "Sign Out" : "Sign In"}
        </button>
      </CardHeader>

      <CardContent className="flex flex-col items-center justify-center space-y-4">
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          tileContent={renderTileContent}
          className="border rounded-lg p-2 shadow-sm"
        />
      </CardContent>

      {/* Popup Modal (Appears Above Dashboard) */}
      {isPopupOpen && popupEvents && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 translate-y-8 z-50">
          <div className="bg-white dark:bg-[#1B222D] p-6 rounded-lg shadow-lg w-96 border border-gray-300">
            <h2 className="text-xl font-semibold mb-4">Events</h2>

            <ul className="space-y-2">
              {popupEvents.map((event, index) => {
                const startTime = event.start.dateTime
                  ? new Date(event.start.dateTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })
                  : "All Day";

                return (
                  <li
                    key={index}
                    className={`flex flex-col p-3 rounded-md shadow 
                           ${
                             event.isHoliday
                               ? "bg-red-100 dark:bg-red-800"
                               : "bg-gray-100 dark:bg-gray-800"
                           }`}
                  >
                    <span className="text-md font-semibold text-black dark:text-white">
                      {event.isHoliday ? " Holiday: " : " Appointment: "}
                      {event.summary}
                    </span>

                    <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      🕒 {startTime}
                    </span>
                  </li>
                );
              })}
            </ul>

            <button
              onClick={closePopup}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default CalendarWidget;
