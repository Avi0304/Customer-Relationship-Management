const express = require("express");
const {
  createEmailCampaign,
  getAllEmailCampaigns,
  getEmailCampaignById,
  updateEmailCampaign,
  deleteEmailCampaign,
} = require("../controllers/EmailCampaignController");

const router = express.Router();

router.post("/add", createEmailCampaign);
router.get("/all", getAllEmailCampaigns);
router.get("/add/:id", getEmailCampaignById);
router.put("/update/:id", updateEmailCampaign);
router.delete("/delete/:id", deleteEmailCampaign);

module.exports = router;
