const Notification = require('../models/Notification');
let io = null;

// Initialize socket.io instance
const initializeSocketIO = (socketIO) => {
  io = socketIO;
};

// Send notification to specific user
const sendNotificationToUser = async (userId, notification) => {
  if (!io) {
    console.error('Socket.io not initialized');
    return;
  }
  io.to(userId.toString()).emit('new_notification', notification);
};

// Create and save notification
const createNotification = async ({ title, message, type, userId }) => {
  try {
    const notification = new Notification({
      title,
      message,
      type,
      timestamp: new Date(),
    });

    await notification.save();

    if (userId) {
      await sendNotificationToUser(userId, {
        _id: notification._id,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        createdAt: notification.createdAt,
        isRead: notification.isRead,
      });
    }

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

module.exports = {
  initializeSocketIO,
  sendNotificationToUser,
  createNotification,
};