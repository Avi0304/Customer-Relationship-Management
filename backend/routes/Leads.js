const express = require("express");
const router = express.Router();
const {
  createLead,
  getAllLeads,
  getLeadById,
  updateLead,
  deleteLead,
} = require("../controllers/LeadsController");

router.post("/add", createLead);
router.get("/all", getAllLeads);
router.get("/getlead/:id", getLeadById);
router.put("/update/:id", updateLead);
router.delete("/delete/:id", deleteLead);

module.exports = router;
