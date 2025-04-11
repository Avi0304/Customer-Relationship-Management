const Feedback = require("../models/Feedback");

exports.submitFeedback = async (req, res) => {
  try {
    const { name, email, rating, message } = req.body;

    if (!name || !email || !rating || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const feedback = new Feedback({ name, email, rating, message });
    await feedback.save();

    res.status(201).json({ message: "Feedback submitted successfully" });
  } catch (error) {
    console.error("Feedback error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
