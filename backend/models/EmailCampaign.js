const mongoose = require("mongoose");

const emailCampaignSchema = new mongoose.Schema({
  caption: {
    type: String,
    required: true,
  },
  callToAction: {
    type: String,
    required: true,
    enum: ["Shop Now", "Learn More", "Sign Up"],
  },
  link: {
    type: String,
    required: false,
  },
  budget: {
    type: Number,
    required: true,
    min: 1,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  mediaUrl: {
    type: String,
  },
  audienceName: {
    type: String,
    required: true,
    trim: true,
  },
  audienceDescription: {
    type: String,
    required: true,
    trim: true,
  },
  emailSubject: {
    type: String,
    required: true,
    trim: true,
  },
  emailBody: {
    type: String,
    required: true,
    trim: true,
  },
  ageRange: {
    type: String,
    required: true,
    enum: ["18-25", "26-35", "36-50", "50+"],
  },
  location: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ["Male", "Female", "All"],
  },
  interests: {
    type: [String],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const EmailCampaign = mongoose.model("EmailCampaign", emailCampaignSchema);
module.exports = EmailCampaign;
