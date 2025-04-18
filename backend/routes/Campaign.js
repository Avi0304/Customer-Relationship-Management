const express = require("express");
const {
  createCampaign,
  getCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
  sendWhatsappCampaign,
} = require("../controllers/CampaignController");

const router = express.Router();

router.post("/add", createCampaign);
router.get("/all", getCampaigns);
router.get("/add/:id", getCampaignById);
router.put("/update/:id", updateCampaign);
router.delete("/delete/:id", deleteCampaign);
router.post("/send-whatsapp", sendWhatsappCampaign);

module.exports = router;
