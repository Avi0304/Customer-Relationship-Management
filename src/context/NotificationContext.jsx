import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { useRef } from "react";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const shownNotificationIds = useRef(new Set());

  // ✅ Fetch unseen + initial notifications
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get("http://localhost:8080/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const newData = res.data;

      // 🧠 Avoid duplicates
      setNotifications((prev) => {
        const existingIds = new Set(prev.map((n) => n._id));
        const fresh = newData.filter((n) => !existingIds.has(n._id));

        if (fresh.length > 0) {
          console.log("📥 New notifications from DB fetch:", fresh);

          if (Notification.permission === "granted") {
            fresh.forEach((notif) => {
              if (!shownNotificationIds.current.has(notif._id)) {
                new Notification(notif.title, {
                  body: notif.message,
                });
                shownNotificationIds.current.add(notif._id); // ✅ Mark as shown
              }
            });
          }
        }

        return [...fresh, ...prev]; // newest on top
      });
    } catch (error) {
      console.error("❌ Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Setup socket connection
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const newSocket = io("http://localhost:8080", {
      auth: { token },
    });

    setSocket(newSocket);

    newSocket.on("new_notification", (notification) => {
      console.log("⚡ Real-time notification received via socket:", notification);
      setNotifications((prev) => [notification, ...prev]);

      // 🔔 Browser push notification
      if (Notification.permission === "granted") {
        new Notification(notification.title, {
          body: notification.message,
        });
      }
    });

    return () => newSocket.disconnect();
  }, []);

  // ✅ Fetch once on mount
  useEffect(() => {
    fetchNotifications();
  }, []);

  // ✅ Recursive polling every 10 seconds
  useEffect(() => {
    let timeout;

    const poll = async () => {
      await fetchNotifications();
      timeout = setTimeout(poll, 5000); 
    };

    poll(); // Start the loop

    return () => clearTimeout(timeout); // Cleanup
  }, []);

  // ✅ Ask permission for browser notifications
  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  

  return (
    <NotificationContext.Provider
      value={{ notifications, setNotifications, loading }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
