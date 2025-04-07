const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
require('dotenv').config();

let io;

const initializeSocket = (server) => {
  io = socketIo(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.userId;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.userId}`);
    socket.join(socket.userId);

    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${socket.userId}`);
    });
  });

  return io;
};

// ✅ Globally accessible after initialization
const getIo = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

const sendNotificationToUser = (userId, notification) => {
  if (!io) {
    console.error('Socket.io not initialized');
    return;
  }
  io.to(userId.toString()).emit('new_notification', notification);
};

module.exports = {
  initializeSocket,
  getIo,
  sendNotificationToUser
};
