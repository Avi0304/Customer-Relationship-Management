const express = require("express");
const router = express.Router();
const {
  createLead,
  getAllLeads,
  getLeadById,
  updateLead,
  deleteLead,
} = require("../controllers/LeadsController");

router.post("/add", createLead); // Create a new lead (linked to a customer)
router.get("/all", getAllLeads); // Get all leads with customer details
router.get("/getlead/:id", getLeadById); // Get a single lead with customer details
router.put("/update/:id", updateLead); // Update lead status and sync with customer
router.delete("/delete/:id", deleteLead); // Delete a lead

module.exports = router;
