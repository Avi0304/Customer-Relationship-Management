const Support = require("../models/Support");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const { createNotification } = require('../utils/notificationService')

const notifySupportAdded = async (support) => {
  await createNotification({
    title: 'New Support Added',
    message: `New Support added: ${support.customer} - $${support.amount}`,
    type: 'support',
    userId: support.userId,
  });
};

// Update status change notification
const notifySupportStatusUpdated = async (support, previousStatus, newStatus) => {
  await createNotification({
    title: 'Support Status Updated',
    message: `Support status updated from ${previousStatus} to ${newStatus}`,
    type: 'support',
    userId: support.userId,
  });
};


// Get all support requests with search, filter & pagination
exports.getAllSupportRequests = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { status, search } = req.query;

    let filter = {};
    if (status) filter.status = status;
    if (search) filter.subject = { $regex: search, $options: "i" };

    const requests = await Support.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const total = await Support.countDocuments(filter);

    res.status(200).json({ data: requests, total });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch support requests", error });
  }
};

// Get single support request by ID
exports.getSupportRequestById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid request ID format" });
    }

    const support = await Support.findById(req.params.id).lean();
    if (!support)
      return res.status(404).json({ message: "Support request not found" });

    res.status(200).json(support);
  } catch (error) {
    res.status(500).json({ message: "Error fetching support request", error });
  }
};

// Create new support request
exports.createSupportRequest = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { subject, description, status, userId, priority } = req.body;

  try {
    const newRequest = new Support({ subject, description, status, userId });
    await newRequest.save();

    // 🔔 Notify about new support request
    await createNotification({
      title: 'New Support Request',
      message: `A new support request was created: ${subject}`,
      type: 'support',
      userId,
    });

    res.status(201).json(newRequest);
  } catch (error) {
    res.status(500).json({ message: "Failed to create request", error });
  }
};


// Update support request
exports.updateSupportRequest = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { id } = req.params;
  const { subject, description, status, priority } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid request ID format" });
  }

  try {
    const existing = await Support.findById(id);
    if (!existing) return res.status(404).json({ message: "Request not found" });

    const previousStatus = existing.status;
    const priorityStatus = existing.priority;

    const updates = { subject, description, status };
    const updated = await Support.findByIdAndUpdate(id, updates, { new: true });

    // 🔔 Notify if status changed
    if (previousStatus !== status) {
      await createNotification({
        title: 'Support Status Updated',
        message: `Status changed from ${previousStatus} to ${status}`,
        type: 'support',
        userId: existing.userId,
      });
    }

    if (priorityStatus !== priority) {
      await createNotification({
        title: 'Support Priority Updated',
        message: `Priority changed from ${priorityStatus} to ${priority}`,
        type: 'support',
        userId: existing.userId,
      });
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update request", error });
  }
};


// Delete support request
exports.deleteSupportRequest = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid request ID format" });
  }

  try {
    const deleted = await Support.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Request not found" });

    res.status(200).json({ message: "Request deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete request", error });
  }
};
