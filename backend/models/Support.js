const mongoose = require("mongoose");

const relatedResourceSchema = new mongoose.Schema({
  label: String,
  url: String
});


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
      enum: ["Open", "In Progress", "Closed","Withdrawn"],
      default: "Open",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Low",
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String }, 
    relatedResources: [relatedResourceSchema]
  },
  { timestamps: true } // Adds createdAt & updatedAt
);

module.exports = mongoose.model("Support", SupportSchema);
