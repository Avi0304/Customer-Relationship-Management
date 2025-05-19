const express = require("express");
const router = express.Router();
const DataController = require("../controllers/DataController");
const { verifyToken } = require("../middleware/auth");
const multer = require("multer");

const upload = multer({ dest: "uploads/" });

router.get("/export", verifyToken, DataController.exportData);
router.post("/backup", verifyToken, DataController.createBackup);
router.post(
  "/restore",
  verifyToken,
  upload.single("backupFile"),
  DataController.restoreBackup
);
router.delete("/delete", verifyToken, DataController.deleteAccount);

module.exports = router;
