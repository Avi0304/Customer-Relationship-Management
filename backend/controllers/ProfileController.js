const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dayjs = require("dayjs");
require("dotenv").config();
const moment = require("moment");
const fs = require("fs");
const path = require("path");

// 🔹 Get User Profile
const getprofile = async (req, res) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Access Denied. No Token Provided" });
    }

    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("✅ Decoded Token:", decoded);
    } catch (error) {
      return res.status(401).json({ message: "Invalid or Expired Token" });
    }

    const userId = decoded.userId || decoded.id; // Ensure correct field
    console.log("🔹 Extracted User ID:", userId);

    if (!userId) return res.status(401).json({ message: "Invalid Token Data" });

    const user = await User.findById(userId).select("-password -resettoken");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      ...user.toObject(),
      dob: user.DOB ? moment(user.DOB).format("DD-MM-YYYY") : null,
      is2FAEnabled: user.is2FAEnabled,
    });
  } catch (error) {
    console.error("🔥 Error in getProfile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 🔹 Update User Profile
const updateProfile = async (req, res) => {
  try {
    const userId = verifyAndGetUserId(req, res);
    if (!userId) return;

    let { name, bio, DOB } = req.body;

    if (!name && !bio && !DOB) {
      return res
        .status(400)
        .json({ message: "No valid fields provided for update." });
    }

    if (DOB && !dayjs(DOB, "YYYY-MM-DD", true).isValid()) {
      return res
        .status(400)
        .json({ message: "Invalid DOB format. Use YYYY-MM-DD." });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, bio, DOB },
      { new: true }
    );

    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        ...updatedUser.toObject(),
        DOB: updatedUser.DOB
          ? dayjs(updatedUser.DOB).format("DD/MM/YYYY")
          : null,
      },
    });
  } catch (error) {
    console.error("🔥 Error updating profile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 🔹 Update Contact Information
const updateContact = async (req, res) => {
  try {
    const userId = verifyAndGetUserId(req, res);
    if (!userId) return;

    const { email, phone, address } = req.body;

    if (!email && !phone && !address) {
      return res.status(400).json({
        message:
          "Provide at least one field to update (email, phone, or address).",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { email, phone, address },
      { new: true }
    );

    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("🔥 Error updating contact:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 🔹 Update Professional Information
const updateProfessional = async (req, res) => {
  try {
    const userId = verifyAndGetUserId(req, res);
    if (!userId) return;

    const { organization, skills, occupation } = req.body;

    if (!organization && !skills && !occupation) {
      return res.status(400).json({
        message:
          "Provide at least one field (organization, skills, or occupation).",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { organization, skills, occupation },
      { new: true }
    );

    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("🔥 Error updating professional details:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 🔹 Upload Profile Photo
const uploadPhoto = async (req, res) => {
  try {
    const userId = verifyAndGetUserId(req, res);
    if (!userId) return;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const uploadPath = path.join(__dirname, "..", "uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    const photoUrl = `/uploads/${req.file.filename}`;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { photo: photoUrl },
      { new: true }
    );

    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      message: "Profile photo updated successfully",
      profilePhoto: updatedUser.photo,
    });
  } catch (error) {
    console.error("🔥 Error uploading photo:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 🔹 Utility Function to Verify JWT and Get User ID
const verifyAndGetUserId = (req, res) => {
  const authHeader = req.header("Authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ message: "Access Denied. No Token Provided" });
    return null;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.id; // Ensure this matches JWT payload
  } catch (error) {
    res.status(401).json({ message: "Invalid or Expired Token" });
    return null;
  }
};

// 🔹 Export Controllers
module.exports = {
  getprofile,
  updateProfile,
  updateContact,
  updateProfessional,
  uploadPhoto,
};
