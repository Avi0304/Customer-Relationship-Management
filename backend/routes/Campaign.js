const express = require("express");
const {
  createCampaign,
  getCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
} = require("../controllers/CampaignController");

const router = express.Router();

router.post("/add", createCampaign);
router.get("/all", getCampaigns);
router.get("/add/:id", getCampaignById);
router.put("/update/:id", updateCampaign);
router.delete("/delete/:id", deleteCampaign);

module.exports = router;
