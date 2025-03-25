const DataBackup = require("../models/DataModel");
const fs = require("fs");
const path = require("path");
const User = require("../models/User");

// Export Data
exports.exportData = async (req, res) => {
  try {
    console.log("🚀 Export API called!");

    const { format } = req.query;
    console.log("🔹 Requested format:", format);

    const userId = req.user.userId; // Ensure correct field
    console.log("🔹 Fetching data for user:", userId);

    const data = await DataBackup.find({ userId });
    console.log("🔹 Data retrieved from DB:", data);

    if (!data.length) {
      console.log("⚠️ No data found for this user.");
      return res.status(404).json({ message: "No data found." });
    }

    let response;
    if (format === "json") {
      response = JSON.stringify(data, null, 2);
      res.setHeader("Content-Type", "application/json");
    } else if (format === "csv") {
      const csvData = data
        .map((d) => Object.values(d.toObject()).join(","))
        .join("\n");
      response = csvData;
      res.setHeader("Content-Type", "text/csv");
    } else {
      return res.status(400).json({ message: "Invalid format." });
    }

    res.setHeader("Content-Disposition", `attachment; filename=data.${format}`);
    res.send(response);
  } catch (error) {
    console.error("🔥 Error exporting data:", error);
    res.status(500).json({ message: "Error exporting data", error });
  }
};

// Backup Data
exports.createBackup = async (req, res) => {
  try {
    console.log("🔹 Received Backup Request:", req.body);

    if (!req.user || !req.user.userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized. User ID not found." });
    }

    const userId = req.user.userId;

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "No data provided for backup." });
    }

    const backupData = await DataBackup.create({
      userId,
      backupData: req.body.backupData, // 🔹 Store user data
    });

    res
      .status(201)
      .json({ message: "Backup created successfully", backupData });
  } catch (error) {
    console.error("🔥 Error creating backup:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

// Restore Data
exports.restoreBackup = async (req, res) => {
  try {
    console.log("🔹 Restore API called!");

    if (!req.file) {
      console.log("❌ No file received.");
      return res.status(400).json({ message: "No file uploaded" });
    }

    console.log("✅ File received:", req.file);

    const filePath = req.file.path;
    const fileData = JSON.parse(fs.readFileSync(filePath, "utf8"));

    await DataBackup.create({ userId: req.user.userId, backupData: fileData });

    res.status(200).json({ message: "Data restored successfully" });
  } catch (error) {
    console.error("🔥 Error restoring data:", error);
    res.status(500).json({ message: "Error restoring data", error });
  }
};

// Delete Account & Data
exports.deleteAccount = async (req, res) => {
  try {
    console.log("🔹 Deleting data for user:", req.user.userId);

    // Delete all backups related to the user
    const deletedData = await DataBackup.deleteMany({
      userId: req.user.userId,
    });
    console.log("✅ Deleted backup data:", deletedData);

    // Delete the user account
    const deletedUser = await User.findByIdAndDelete(req.user.userId);
    console.log("✅ Deleted user:", deletedUser);

    if (!deletedUser) {
      console.log("❌ User not found.");
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: "Account and all data deleted successfully" });
  } catch (error) {
    console.error("🔥 Error deleting account:", error);
    res
      .status(500)
      .json({ message: "Error deleting account", error: error.message });
  }
};
