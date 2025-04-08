const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const {
  getAllSupportRequests,
  getSupportRequestById,
  createSupportRequest,
  updateSupportRequest,
  deleteSupportRequest,
} = require("../controllers/SupportController");

router.get("/all", getAllSupportRequests);
router.get("/:id", getSupportRequestById);

router.post(
  "/add",
  [
    body("subject").notEmpty().withMessage("Subject is required"),
    body("description").notEmpty().withMessage("Description is required"),
  ],
  createSupportRequest
);

router.put(
  "/update/:id",
  [
    body("subject").notEmpty().withMessage("Subject is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("status")
      .isIn(["Open", "In Progress", "Closed"])
      .withMessage("Invalid status"),
  ],
  updateSupportRequest
);

router.delete("/delete/:id", deleteSupportRequest);

module.exports = router;
