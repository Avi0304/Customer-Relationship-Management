const express = require("express");
const {
  createCampaign,
  getCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
  sendWhatsappCampaign,
} = require("../controllers/CampaignController");

const {createAudience, getAudiences, getAudienceById, updateAudience, deleteAudience} = require("../controllers/AudienceController")

const router = express.Router();

router.post("/add", createCampaign);
router.get("/all", getCampaigns);
router.get("/add/:id", getCampaignById);
router.put("/update/:id", updateCampaign);
router.delete("/delete/:id", deleteCampaign);
router.post("/send-whatsapp", sendWhatsappCampaign);

router.post("/audience-add", createAudience);
router.get("/get-audience", getAudiences);
router.get("/:id", getAudienceById);
router.put("/update-audience/:id", updateAudience);
router.delete("/delete-audience/:id", deleteAudience);

module.exports = router;
