const express = require("express");
const {
  createAudience,
  getAudiences,
  getAudienceById,
  updateAudience,
  deleteAudience,
} = require("../controllers/AudienceController");

const router = express.Router();

router.post("/audience-add", createAudience);
router.get("/get-audience", getAudiences);
router.get("/:id", getAudienceById);
router.put("/update-audience/:id", updateAudience);
router.delete("/delete-audience/:id", deleteAudience);

module.exports = router;
