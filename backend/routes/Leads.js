// src/routes/leadRoutes.js
const express = require("express");
const router = express.Router();
const leadController = require("../controllers/LeadsController");

// Define API routes
router.get("/all", leadController.getAllLeads);
router.post("/add", leadController.createLead);
router.put("/update/:id", leadController.updateLead);
router.delete("/delete/:id", leadController.deleteLead);

module.exports = router;
