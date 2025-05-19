const express = require("express");
const router = express.Router();
const {
  submitFeedback,
  getAllFeedback,
} = require("../controllers/FeedbackController");

router.post("/submit", submitFeedback);
router.get("/feedback-all", getAllFeedback);

module.exports = router;
