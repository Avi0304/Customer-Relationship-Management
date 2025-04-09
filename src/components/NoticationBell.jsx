import React, { useState, useContext, useEffect } from "react";
import { FiBell } from "react-icons/fi";
import {
  Badge,
  Popover,
  Typography,
  Box,
  List,
  ListItem,
  IconButton,
  Collapse,
  Paper,
  Avatar,
  Button
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  FiUsers,
  FiCalendar,
  FiBarChart2,
  FiTool,
  FiDollarSign,
  FiCheckCircle,
  FiClock,
  FiMapPin,
} from "react-icons/fi";
import { BiSupport } from "react-icons/bi";
import { FaRegBell } from "react-icons/fa";
import { ThemeContext } from "../context/ThemeContext";
import axios from "axios";
import { io } from "socket.io-client";
import { formatDistanceToNow } from "date-fns";

// Styled Notification Container
const NotificationBox = styled(Paper)(({ theme }) => ({
  width: 410,
  maxHeight: 480,
  overflow: "hidden",
  backgroundColor: theme.palette.mode === "dark" ? "#1B222D" : "#ffffff",
  backdropFilter: "blur(30px) saturate(180%)",
  WebkitBackdropFilter: "blur(30px) saturate(180%)",
  border: theme.palette.mode === "dark"
    ? "1px solid rgba(255, 255, 255, 0.08)"
    : "1px solid rgba(0, 0, 0, 0.05)",
  boxShadow: theme.palette.mode === "dark"
    ? "0 8px 32px rgba(0, 0, 0, 0.6)"
    : "0 8px 24px rgba(0, 0, 0, 0.2)",
}));

const swipeOutStyle = {
  transform: "translateX(100%)",
  opacity: 0,
  transition: "transform 300ms ease, opacity 300ms ease"
};

const getNotificationColor = (type) => {
  const colors = {
    lead: "bg-blue-200 text-blue-600",         // Soft blue bg, sharp text
    meeting: "bg-orange-200 text-orange-500",  // Light orange bg
    status: "bg-green-200 text-green-600",     // Light green bg
    support: "bg-emerald-200 text-emerald-600",
    sale: "bg-indigo-200 text-indigo-600",
    task: "bg-yellow-200 text-yellow-600",
    appointment: "bg-red-200 text-red-600",
    customer: "bg-cyan-100 text-cyan-600"
  };
  return colors[type] || "bg-gray-100 text-gray-600";
};



const getNotificationIcon = (type = "") => {
  const normalizedType = type.toLowerCase();

  const iconColorMap = {
    lead: "text-blue-600",
    meeting: "text-orange-500",
    status: "text-green-600",
    support: "text-emerald-600",
    sale: "text-indigo-600",
    task: "text-yellow-600",
    appointment: "text-red-600",
    customer: "text-cyan-600"
  };

  const iconMap = {
    lead: <FiUsers />,
    meeting: <FiCalendar />,
    status: <FiBarChart2 />,
    support: <BiSupport />,
    sale: <FiDollarSign />,
    task: <FiCheckCircle />,
    appointment: <FiClock />,
    customer: <FiUsers />
  };

  const Icon = iconMap[normalizedType] || <FiMapPin />;
  const colorClass = iconColorMap[normalizedType] || "text-gray-600";

  return <span className={colorClass}>{Icon}</span>;
};


const NotificationBell = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const { mode } = useContext(ThemeContext);

  const currentTheme = localStorage.getItem('theme') || 'light';
  const isDark = currentTheme === 'dark';

  // Socket Connection
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const newSocket = io("http://localhost:8080", {
      auth: { token }
    });

    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, []);

  // Handle incoming notifications
  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      if (Notification.permission === "granted") {
        new Notification(notification.title, {
          body: notification.message
        });
      }
    };

    socket.on("new_notification", handleNewNotification);
    return () => socket.off("new_notification", handleNewNotification);
  }, [socket]);

  // Fetch from backend
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get("http://localhost:8080/api/notifications", {
          headers: { Authorization: `Bearer ${token}` }
        });

        setNotifications(res.data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:8080/api/notifications/read/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error("Mark as read error:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        "http://localhost:8080/api/notifications/read-all",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error("Mark all as read error:", err);
    }
  };

  const handleClearAll = async () => {
    try {
      await axios.delete("http://localhost:8080/api/notifications/clear-all");
      setNotifications([]);
    } catch (error) {
      console.error("Failed to clear notifications", error);
    }
  };

  const handleItemClick = (id) => {
    setExpandedId(expandedId === id ? null : id);
    const clicked = notifications.find((n) => n._id === id);
    if (clicked && !clicked.isRead) handleMarkAsRead(id);
  };

  const open = Boolean(anchorEl);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="relative flex items-center gap-2">
      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
        <Badge badgeContent={unreadCount} color="error" invisible={unreadCount === 0}>
          <FiBell size={24} className="text-gray-700 dark:text-gray-300" />
        </Badge>
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => {
          setAnchorEl(null);
          setExpandedId(null);
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <NotificationBox>
          <Box
            className={`p-4 flex justify-between items-center border-b ${mode === "dark"
              ? "border-gray-700 bg-gradient-to-r from-purple-900/10 to-blue-900/10"
              : "border-gray-100 bg-gradient-to-r from-blue-50/10 to-indigo-50/10"
              }`}
          >
            {/* Left side: Notifications + badge */}
            <Box display="flex" alignItems="center">
              <Typography variant="h6" fontWeight={500}>
                Notifications
              </Typography>
              <Box
                sx={{
                  backgroundColor: isDark ? '#424242' : '#f1f3f4',
                  color: isDark ? '#e0e0e0' : '#000',
                  ml: 1,
                  px: 1.2,
                  py: 0.2,
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  minWidth: 24,
                  textAlign: 'center',
                }}
              >
                {notifications.length}
              </Box>
            </Box>

            {/* Right side: Action buttons inline */}
            <Box display="flex" alignItems="center" gap={1}>
              {unreadCount > 0 && (
                <Button
                  size="small"
                  onClick={handleMarkAllAsRead}
                  sx={{
                    textTransform: 'uppercase',
                    fontSize: '0.75rem',
                    p: 0,
                    minWidth: 'auto',
                    color: '#1a73e8',
                    fontWeight: 600
                  }}
                >
                  Mark all as read
                </Button>
              )}
              <Button
                size="small"
                onClick={handleClearAll}
                sx={{
                  textTransform: 'uppercase',
                  fontSize: '0.75rem',
                  p: 0,
                  minWidth: 'auto',
                  color: '#1a73e8',
                  fontWeight: 600
                }}
              >
                Clear all
              </Button>
            </Box>
          </Box>


          {loading ? (
            <Box className="p-8 text-center">
              <Typography>Loading notifications...</Typography>
            </Box>
          ) : (
            <List sx={{ overflow: "auto", maxHeight: 400 }}>
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <ListItem
                    key={n._id}
                    onClick={() => handleItemClick(n._id)}
                    sx={{
                      cursor: "pointer",
                      backgroundColor: n.isRead
                        ? "transparent"
                        : mode === "dark"
                          ? "rgba(59,130,246,0.1)"
                          : "rgba(59,130,246,0.05)",
                      "&:hover": {
                        backgroundColor: mode === "dark" ? "#2D3748" : "#F3F4F6"
                      },
                      ...(n.isClearing && swipeOutStyle)
                    }}
                  >
                    <Box className="flex w-full gap-4 items-start">
                      <div className={`w-11 h-11 rounded-full flex items-center justify-center text-white ${getNotificationColor(n.type)}`}>
                        {getNotificationIcon(n.type)}
                      </div>

                      <Box className="flex-1">
                        <Box className="flex justify-between items-start">
                          <Typography variant="subtitle1" className="font-semibold">
                            {n.title}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {formatDistanceToNow(new Date(n.createdAt), {
                              addSuffix: true
                            })}
                          </Typography>
                        </Box>
                        <Collapse in={expandedId === n._id}>
                          <Typography variant="body2" className="mt-1" style={{ whiteSpace: "pre-line" }}>
                            {n.message}
                          </Typography>
                        </Collapse>
                      </Box>
                    </Box>
                  </ListItem>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-[200px] text-center p-4">
                  <FaRegBell className={`h-10 w-10 mb-2 ${isDark ? 'text-gray-500' : 'text-gray-300'}`} />
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    No new notifications
                  </p>
                </div>
              )}
            </List>
          )}
        </NotificationBox>
      </Popover>
    </div>
  );
};

export default NotificationBell;
