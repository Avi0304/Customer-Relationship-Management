const mongoose = require("mongoose");

const DataSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  model: {
    type: String,
    required: true,
    enum: ["appointments", "tasks", "sales", "customers", "support", "leads"], 
  },
  backupData: {
    type: Object,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("DataBackup", DataSchema);
