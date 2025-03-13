import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import Calendar from "react-calendar/dist/cjs/Calendar.js";
import "react-calendar/dist/Calendar.css";

const CalendarWidget = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <Card className='col-span-3 bg-white shadow-lg rounded-lg p-6 w-full   bg-white dark:bg-[#1B222D] shadow-lg dark:shadow-md'>
      <CardHeader>
        <h1 className="text-2xl font-bold leading-none tracking-tight mb-3">Calendar</h1>
      </CardHeader>
      <CardContent className='flex items-center justify-center'>
        <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            className='border rounded-lg p-2 shadow-sm'
         /> 
      </CardContent>
    </Card>
  );
};

export default CalendarWidget;
