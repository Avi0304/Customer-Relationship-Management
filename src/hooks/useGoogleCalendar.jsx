import { useEffect, useState } from "react";
import { gapi } from "gapi-script";

const CLIENT_ID =
    "147226171626-paikqrlke6klt0qv9knh21hkmnf8dmph.apps.googleusercontent.com";
const API_KEY = "AIzaSyDhCX4zzrbsMr-c3Ot92ywLNv-IhUDBLsY";
const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

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

  const signIn = () => gapi.auth2.getAuthInstance().signIn();
  const signOut = () => gapi.auth2.getAuthInstance().signOut();

 const listEvents = () => {
  gapi.client.calendar.events
    .list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      showDeleted: false,
      singleEvents: true,
      maxResults: 10,
      orderBy: "startTime",
    })
    .then((res) => {
      const items = res.result.items || [];

      // Convert UTC to local time
      const convertedEvents = items.map(event => ({
        ...event,
        start: {
          ...event.start,
          dateTime: event.start.dateTime ? new Date(event.start.dateTime).toLocaleString() : event.start.date
        },
        end: {
          ...event.end,
          dateTime: event.end.dateTime ? new Date(event.end.dateTime).toLocaleString() : event.end.date
        }
      }));

      setEvents(convertedEvents);
      console.log("Fetched events:", convertedEvents);
    })
    .catch((err) => {
      console.error("Error fetching events", err);
    });
};

  
  

  return { signIn, signOut, isSignedIn, events };
};
