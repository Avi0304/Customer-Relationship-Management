const Support = require("../models/Support");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

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

  const { subject, description, status } = req.body;

  try {
    const newRequest = new Support({ subject, description, status });
    await newRequest.save();
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
  const { subject, description, status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid request ID format" });
  }

  try {
    const updates = { subject, description, status };

    const updated = await Support.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Request not found" });
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
