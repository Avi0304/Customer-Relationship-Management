import { useEffect, useState } from "react";
import { gapi } from "gapi-script";

const CLIENT_ID =
    import.meta.env.VITE_GOOGLE_CLIENT_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

const CALENDAR_ID = "primary"; // Your personal calendar
const HOLIDAY_CALENDAR_ID = "en.indian#holiday@group.v.calendar.google.com";

export const useGoogleCalendar = () => {
  const [events, setEvents] = useState([]);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const initClient = () => {
      gapi.client
        .init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: [
            "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
          ],
          scope: SCOPES,
        })
        .then(() => {
          const authInstance = gapi.auth2.getAuthInstance();
          setIsSignedIn(authInstance.isSignedIn.get());
          authInstance.isSignedIn.listen(setIsSignedIn);

          if (authInstance.isSignedIn.get()) {
            listEvents();
          }
        });
    };

    gapi.load("client:auth2", initClient);
  }, []);

  const signIn = () => {
    if (gapi.auth2) {
      gapi.auth2.getAuthInstance().signIn();
    } else {
      console.error("gapi.auth2 not initialized yet");
    }
  };
  
  const signOut = () => gapi.auth2.getAuthInstance().signOut();

  const listEvents = async () => {
    try {
      // Fetch personal events
      const personalEventsResponse = await gapi.client.calendar.events.list({
        calendarId: "primary",
        timeMin: new Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 100, // Increased limit
        orderBy: "startTime",
      });
  
      const personalEvents = personalEventsResponse.result.items || [];
  
      // Fetch holiday events (Replace HOLIDAY_CALENDAR_ID with your country's public holiday calendar ID)
      const HOLIDAY_CALENDAR_ID = "en.indian#holiday@group.v.calendar.google.com"; // Example: Indian Holidays
      const startOfYear = new Date(new Date().getFullYear(), 0, 1).toISOString(); // January 1st
      const endOfYear = new Date(new Date().getFullYear(), 11, 31, 23, 59, 59).toISOString(); // December 31st
  
      const holidayEventsResponse = await gapi.client.calendar.events.list({
        calendarId: HOLIDAY_CALENDAR_ID,
        timeMin: startOfYear,
        timeMax: endOfYear,
        showDeleted: false,
        singleEvents: true,
        maxResults: 100,
        orderBy: "startTime",
      });
  
      const holidayEvents = (holidayEventsResponse.result.items || []).map(event => ({
        ...event,
        isHoliday: true, // Mark holiday events
        start: {
          ...event.start,
          dateTime: event.start.dateTime
            ? new Date(event.start.dateTime).toLocaleString()
            : event.start.date,
        },
      }));
  
      // Combine personal and holiday events
      const allEvents = [...personalEvents, ...holidayEvents];
  
      setEvents(allEvents);
      console.log("Fetched events:", allEvents);
    } catch (err) {
      console.error("Error fetching events", err);
    }
  };
  
  

  return { signIn, signOut, isSignedIn, events };
};
