const mongoose = require("mongoose");

const SalesSchema = new mongoose.Schema(
  {
    customer: {
      type: String,
      required: true,
    },
    amount: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Completed", "Pending", "Cancelled"],
      default: "Pending",
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      default: null,
      required: false,
    },
  },
  { timestamps: true }
);

const Sale = mongoose.model("Sale", SalesSchema);
module.exports = Sale;
