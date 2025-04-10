const mongoose = require("mongoose");

const SupportSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Closed"],
      default: "Open",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Low",
    },
  },
  { timestamps: true } // Adds createdAt & updatedAt
);

module.exports = mongoose.model("Support", SupportSchema);
