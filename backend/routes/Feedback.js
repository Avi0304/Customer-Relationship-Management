const express = require("express");
const router = express.Router();
const { submitFeedback } = require("../controllers/FeedbackController");

router.post("/submit", submitFeedback);

module.exports = router;
