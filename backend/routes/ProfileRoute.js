const express = require("express");
const {
    getprofile,
    updateProfile,
    updateContact,
    updateProfessional,
    uploadPhoto,
} = require("../controllers/ProfileController");
const multer = require("multer");
const path = require("path");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

// 🔹 Set up Multer Storage Configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "..", "uploads")); // Ensures correct path
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname); // Unique filename
    },
});

// 🔹 File Filter (Allow only images)
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type. Only images allowed."), false);
    }
};

const upload = multer({ storage, fileFilter });

//  Routes
router.get("/get-profile", getprofile);
router.put("/update-profile", verifyToken,updateProfile);
router.put("/update-contact", verifyToken,updateContact);
router.put("/update-professional", verifyToken,updateProfessional);
router.put("/update-photo", upload.single("photo"), uploadPhoto);

module.exports = router;
