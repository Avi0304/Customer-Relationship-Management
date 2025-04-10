const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const {
  getAllSupportRequests,
  getSupportRequestById,
  createSupportRequest,
  updateSupportRequest,
  deleteSupportRequest,
  updateSupportStatus,
  withdrawSupportRequest,
  addRelatedResource,
  getRelatedResources,
  updateRelatedResource,
  deleteRelatedResource
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

router.put("/:id/status", updateSupportStatus);
router.put("/:id/Withdrawstatus", withdrawSupportRequest);


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


router.post("/resource/add/:id", addRelatedResource);

router.get("/resource/:id", getRelatedResources);

router.put("/:ticketId/resource/update/:resourceId", updateRelatedResource)

router.delete('/resource/delete/:id/:resourceId', deleteRelatedResource);



module.exports = router;
