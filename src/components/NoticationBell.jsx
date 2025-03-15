import React, { useState, useContext } from "react";
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
  Divider,
  Avatar,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { blue, orange, green } from "@mui/material/colors";
import { ThemeContext } from "../context/ThemeContext";

const NotificationBox = styled(Paper)(({ theme }) => ({
  width: 380,
  maxHeight: 480,
  overflow: "hidden",
//   borderRadius: 16,
  backgroundColor: theme.palette.mode === "dark" ? "#1B222D" : "#ffffff",
  backdropFilter: "blur(30px) saturate(180%)",
  WebkitBackdropFilter: "blur(30px) saturate(180%)",
  border:
    theme.palette.mode === "dark"
      ? "1px solid rgba(255, 255, 255, 0.08)"
      : "1px solid rgba(0, 0, 0, 0.05)",
  boxShadow:
    theme.palette.mode === "dark"
      ? "0 8px 32px rgba(0, 0, 0, 0.6)"
      : "0 8px 24px rgba(0, 0, 0, 0.2)",
}));

const getNotificationColor = (type) => {
  switch (type) {
    case "lead":
      return blue[600];
    case "meeting":
      return orange[600];
    case "support":
      return green[600];
    default:
      return blue[600];
  }
};

const getNotificationIcon = (type) => {
  switch (type) {
    case "lead":
      return "👥";
    case "meeting":
      return "📅";
    case "status":
      return "📊";
    default:
      return "📌";
  }
};

const NotificationBell = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const { mode } = useContext(ThemeContext);

  const groupedNotifications = [
    {
      id: 1,
      title: "New Leads Assigned",
      message:
        "You have been assigned new leads: Rajesh Kumar, Neha Gupta, Rohan Singh",
      timestamp: new Date().toISOString(),
      type: "lead",
    },
    {
      id: 2,
      title: "Meeting Reminders",
      message:
        "Upcoming client meetings:\n- Priya Sharma at 10:00 PM today\n- Meera Nair at 10:00 PM today",
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      type: "meeting",
    },
    {
      id: 3,
      title: "Status Updates",
      message: "Status converted for: Amit Verma, Sandeep Joshi",
      timestamp: new Date(Date.now() - 1200000).toISOString(),
      type: "status",
    },
  ];

  const [notifications, setNotifications] = useState(groupedNotifications);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setExpandedId(null);
  };

  const handleItemClick = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const open = Boolean(anchorEl);
  const unreadCount = notifications.length; // Number of unread notifications

  return (
    <div className="relative flex items-center gap-2 ">
      <IconButton
        onClick={handleClick}
        sx={{
          color: (theme) =>
            theme.palette.mode === "dark" ? "gray.300" : "gray.600",
          "&:hover": {
            backgroundColor: (theme) =>
              theme.palette.mode === "dark" ? "#1B222D" : "rgb(255, 255, 255)",
          },
        }}
      >
        <Badge
          badgeContent={unreadCount}
          color="error"
          invisible={unreadCount === 0} // Hide badge if no notifications
        >
          <FiBell size={24} className="text-gray-700 dark:text-gray-300"/>
        </Badge>
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        className="mt-2"
      >
        <NotificationBox>
          <Box
            className={`p-4 border-b ${
              mode === "dark"
                ? "border-gray-700/50 bg-gradient-to-r from-purple-900/10 to-blue-900/10"
                : "border-gray-100 bg-gradient-to-r from-blue-50/10 to-indigo-50/10"
            }`}
          >
            <Typography
              variant="h6"
              className={`font-semibold tracking-tight ${
                mode === "dark" ? "text-gray-100" : "text-gray-800"
              }`}
            >
              Notifications
            </Typography>
          </Box>
          <List>
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <React.Fragment key={notification.id}>
                  <ListItem
                    onClick={() => handleItemClick(notification.id)}
                    sx={{
                      cursor: "pointer",
                      transition: "background-color 0.3s",
                      "&:hover": {
                        backgroundColor: (theme) =>
                          theme.palette.mode === "dark" ? "#2D3748" : "#F3F4F6",
                      },
                    }}
                  >
                    <Box className="flex w-full gap-4 items-start">
                      <Avatar
                        sx={{
                          bgcolor: getNotificationColor(notification.type),
                          width: 44,
                          height: 44,
                          fontSize: "1.3rem",
                        }}
                      >
                        {getNotificationIcon(notification.type)}
                      </Avatar>
                      <Box className="flex-1">
                        <Typography
                          variant="subtitle1"
                          className={`font-semibold mb-1 ${
                            mode === "dark" ? "text-gray-100" : "text-gray-800"
                          }`}
                        >
                          {notification.title}
                        </Typography>
                        <Collapse in={expandedId === notification.id}>
                          <Typography
                            variant="body2"
                            className={
                              mode === "dark"
                                ? "text-gray-300"
                                : "text-gray-600"
                            }
                          >
                            {notification.message}
                          </Typography>
                        </Collapse>
                      </Box>
                    </Box>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))
            ) : (
              <Box className="p-8 text-center">
                <Typography
                  className={
                    mode === "dark" ? "text-gray-400" : "text-gray-500"
                  }
                >
                  No new notifications
                </Typography>
              </Box>
            )}
          </List>
        </NotificationBox>
      </Popover>
    </div>
  );
};

export default NotificationBell;
