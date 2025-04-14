const Feedback = require("../models/Feedback");
const User = require("../models/User"); 

exports.submitFeedback = async (req, res) => {
  try {
    const { userId, name, email, rating, message, img } = req.body;

    if (!userId || !name || !email || !rating || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { occupation, organization, photo } = user;

    const feedbackImg = img || photo || "";

    const feedback = new Feedback({
      userId,
      name,
      email,
      rating,
      message,
      occupation,
      organization,
      img: feedbackImg,
    });

    await feedback.save();

    res.status(201).json({ message: "Feedback submitted successfully" });
  } catch (error) {
    console.error("Feedback error:", error);
    res.status(500).json({ message: "Server error" });
  }
};



exports.getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 }); 

    if (feedbacks.length === 0) {
      return res.status(404).json({ message: "No feedback found" });
    }

    res.status(200).json(feedbacks);
  } catch (error) {
    console.error("Error fetching feedback:", error);
    res.status(500).json({ message: "Server error" });
  }
};