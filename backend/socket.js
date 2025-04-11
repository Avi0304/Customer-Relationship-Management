const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
require('dotenv').config();

let io;

const initializeSocket = (server) => {
  io = socketIo(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
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
      socket.userRole = decoded.role;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`✅ Connected: ${socket.userId}`);

    // Join ticket chat room
    socket.on('joinTicketRoom', (ticketId) => {
      socket.join(ticketId);
      console.log(`User ${socket.userId} joined ticket ${ticketId}`);
    });

    // Handle sending message
    socket.on('sendMessage', (data) => {
      const { ticketId, senderId, senderRole, message } = data;
      const payload = {
        ticketId,
        senderId,
        senderRole,
        message,
        timestamp: new Date()
      };

      // Emit to users in the same ticket room
      io.to(ticketId).emit('receiveMessage', payload);
    });

    socket.on('disconnect', () => {
      console.log(`❌ Disconnected: ${socket.userId}`);
    });
  });

  return io;
};

const getIo = () => {
  if (!io) throw new Error('Socket.io not initialized');
  return io;
};

const sendNotificationToUser = (userId, notification) => {
  if (!io) return;
  io.to(userId.toString()).emit('new_notification', notification);
};

module.exports = {
  initializeSocket,
  getIo,
  sendNotificationToUser
};
