const Message = require("../models/Message");
const { getIo } = require("../socket");

// Get all messages for a ticket
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ ticketId: req.params.ticketId }).sort(
      { timestamp: 1 }
    );
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch messages", error });
  }
};

const createMessage = async (req, res) => {
  try {
    const { ticketId, senderId, senderRole, message } = req.body;

    const newMessage = await Message.create({
      ticketId,
      senderId,
      senderRole,
      message,
    });

    // Emit message to the corresponding ticket room
    const io = getIo();
    io.to(ticketId).emit("receiveMessage", {
      ticketId,
      senderId,
      senderRole,
      message,
      timestamp: new Date(),
    });

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: "Failed to send message", error });
  }
};

module.exports = { getMessages, createMessage };
