import React, {
  createContext,
  useState,
  useEffect,
  useRef,
  useContext,
} from "react";
import axios from "axios";
import { io } from "socket.io-client";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const shownNotificationIds = useRef(new Set());

  // Initialize pushEnabled state from localStorage
  const [isPushEnabled, setIsPushEnabled] = useState(() => {
    const saved = localStorage.getItem("pushEnabled");
    return saved === "true"; // Fallback to false if not set
  });

  const playNotificationSound = () => {
    const audio = new Audio("/sounds/notification.mp3");
    audio.volume = 1.0; // Max valid volume
    audio
      .play()
      .then(() => {
        console.log("🔊 Notification sound played!");
      })
      .catch((err) => {
        console.error("🔇 Audio play error:", err);
      });
  };

  // Fetch unseen + initial notifications
  const fetchNotifications = async () => {
    try {
      const isAdmin = localStorage.getItem("isAdmin") === "true";
      if (!isAdmin) return;

      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get("http://localhost:8080/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const newData = res.data;

      // Avoid duplicates
      setNotifications((prev) => {
        const existingIds = new Set(prev.map((n) => n._id));
        const fresh = newData.filter((n) => !existingIds.has(n._id));

        if (fresh.length > 0) {
          console.log("📥 New notifications from DB fetch:", fresh);

          playNotificationSound();

          // Show push notification only if permission is granted and push is enabled
          if (
            Notification.permission === "granted" &&
            localStorage.getItem("pushEnabled") === "true"
          ) {
            fresh.forEach((notif) => {
              if (!shownNotificationIds.current.has(notif._id)) {
                new Notification(notif.title, {
                  body: notif.message,
                });
                shownNotificationIds.current.add(notif._id);
              }
            });
          }
        }

        return [...fresh, ...prev];
      });
    } catch (error) {
      console.error("❌ Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  // Setup socket connection
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const newSocket = io("http://localhost:8080", {
      auth: { token },
    });

    setSocket(newSocket);

    newSocket.on("new_notification", (notification) => {
      console.log(
        "⚡ Real-time notification received via socket:",
        notification
      );
      setNotifications((prev) => [notification, ...prev]);

      playNotificationSound();

      // Show push notification only if permission is granted and push is enabled
      if (
        Notification.permission === "granted" &&
        localStorage.getItem("pushEnabled") === "true"
      ) {
        new Notification(notification.title, {
          body: notification.message,
        });
      }
    });

    return () => newSocket.disconnect();
  }, []);

  // Fetch once on mount
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Recursive polling every 5 seconds
  useEffect(() => {
    let timeout;

    const poll = async () => {
      await fetchNotifications();
      timeout = setTimeout(poll, 5000);
    };

    poll();

    return () => clearTimeout(timeout);
  }, []);

  // Ask permission for browser notifications
  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  // Function to enable push notifications
  const togglePushNotification = () => {
    const newPushEnabled = !isPushEnabled;
    localStorage.setItem("pushEnabled", newPushEnabled ? "true" : "false");
    setIsPushEnabled(newPushEnabled);
  };

  // Polling for localStorage change every 5 seconds to update `isPushEnabled`
  useEffect(() => {
    const intervalId = setInterval(() => {
      const saved = localStorage.getItem("pushEnabled");
      const updatedPushEnabled = saved === "true";

      // Check if localStorage value differs from current state
      if (updatedPushEnabled !== isPushEnabled) {
        // Update the state only if there's a change
        setIsPushEnabled(updatedPushEnabled);
        console.log(
          "Updated isPushEnabled from localStorage:",
          updatedPushEnabled
        );
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [isPushEnabled]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        setNotifications,
        loading,
        togglePushNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
