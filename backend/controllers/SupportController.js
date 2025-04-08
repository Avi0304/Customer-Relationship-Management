const Support = require("../models/Support");
const { validationResult } = require("express-validator");

// Get all support requests with optional pagination
exports.getAllSupportRequests = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const requests = await Support.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const total = await Support.countDocuments();

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

// Update support request (status only for safety)
exports.updateSupportRequest = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["Open", "In Progress", "Closed"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    const updated = await Support.findByIdAndUpdate(
      id,
      { status },
      {
        new: true,
      }
    );

    if (!updated) return res.status(404).json({ message: "Request not found" });

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update request", error });
  }
};

// Delete support request
exports.deleteSupportRequest = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Support.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Request not found" });

    res.status(200).json({ message: "Request deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete request", error });
  }
};
