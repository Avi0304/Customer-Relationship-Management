const express = require("express");
const { DashboardStats } = require("../controllers/DashboardStats");

const router = express.Router();

router.get("/stats", DashboardStats);

module.exports = router;
