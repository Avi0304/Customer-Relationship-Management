const DataBackup = require("../models/DataModel");
const fs = require("fs");
const path = require("path");
const User = require("../models/User");
const Appointment = require("../models/Appointment");
const Task = require("../models/Task");
const Customer = require("../models/Customer");
const Leads = require("../models/Leads");
const Support = require("../models/Support");
const Sales = require("../models/Sales");

// Export Data
// exports.exportData = async (req, res) => {
//   try {
//     console.log("🚀 Export API called!");

//     const { format } = req.query;
//     console.log("🔹 Requested format:", format);

//     const userId = req.user.userId; // Ensure correct field
//     console.log("🔹 Fetching data for user:", userId);

//     const data = await DataBackup.find({ userId });
//     console.log("🔹 Data retrieved from DB:", data);

//     if (!data.length) {
//       console.log("⚠️ No data found for this user.");
//       return res.status(404).json({ message: "No data found." });
//     }

//     let response;
//     if (format === "json") {
//       response = JSON.stringify(data, null, 2);
//       res.setHeader("Content-Type", "application/json");
//     } else if (format === "csv") {
//       const csvData = data
//         .map((d) => Object.values(d.toObject()).join(","))
//         .join("\n");
//       response = csvData;
//       res.setHeader("Content-Type", "text/csv");
//     } else {
//       return res.status(400).json({ message: "Invalid format." });
//     }

//     res.setHeader("Content-Disposition", `attachment; filename=data.${format}`);
//     res.send(response);
//   } catch (error) {
//     console.error("🔥 Error exporting data:", error);
//     res.status(500).json({ message: "Error exporting data", error });
//   }
// };

exports.exportData = async (req, res) => {
  try {
    console.log("🚀 Export API called!");

    const { format, model } = req.query; // Accept 'model' as a query parameter
    console.log("🔹 Requested format:", format);
    console.log("🔹 Requested model:", model);

    const userId = req.user.userId; // Ensure correct field
    console.log("🔹 Fetching data for user:", userId);

    // Fetch data based on the 'model' query parameter
    let data;
    if (model === "appointments") {
      data = await Appointment.find();
      console.log("🔹 Data retrieved from Appointment DB:", data);
    } 
    else if (model === "tasks") {
      data = await Task.find(); 
      console.log("🔹 Data retrieved from Task DB:", data);
    } 
    else if (model === "sales") {
      data = await Sales.find(); 
      console.log("🔹 Data retrieved from Sales DB:", data);
    } 
    else if (model === "customers") {
      data = await Customer.find(); 
      console.log("🔹 Data retrieved from Customer DB:", data);
    } 
    else if (model === "support") {
      data = await Support.find(); 
      console.log("🔹 Data retrieved from Support DB:", data);
    } 
    else if (model === "leads") {
      data = await Leads.find(); 
      console.log("🔹 Data retrieved from Lead DB:", data);
    } 
    else {
      return res.status(400).json({ message: "Invalid model." });
    }

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

    // Set the content disposition for file download
    res.setHeader("Content-Disposition", `attachment; filename=${model}.${format}`);
    res.send(response);

  } catch (error) {
    console.error("🔥 Error exporting data:", error);
    res.status(500).json({ message: "Error exporting data", error });
  }
};

// Backup Data
// exports.createBackup = async (req, res) => {
//   try {
//     console.log("🔹 Received Backup Request:", req.body);

//     if (!req.user || !req.user.userId) {
//       return res
//         .status(401)
//         .json({ message: "Unauthorized. User ID not found." });
//     }

//     const userId = req.user.userId;

//     if (!req.body || Object.keys(req.body).length === 0) {
//       return res.status(400).json({ message: "No data provided for backup." });
//     }

//     const backupData = await DataBackup.create({
//       userId,
//       backupData: req.body.backupData, // 🔹 Store user data
//     });

//     res
//       .status(201)
//       .json({ message: "Backup created successfully", backupData });
//   } catch (error) {
//     console.error("🔥 Error creating backup:", error);
//     res.status(500).json({ message: "Internal Server Error", error });
//   }
// };

exports.createBackup = async (req, res) => {
  try {
    const { model } = req.query; // e.g., ?model=appointments
    const userId = req.user.userId;

    if (!model) {
      return res.status(400).json({ message: "Model is required." });
    }

    // Load data from the correct model dynamically
    let data;
    if (model === "appointments") {
      data = await Appointment.find();
    } else if (model === "tasks") {
      data = await Task.find();
    } else if (model === "sales") {
      data = await Sales.find();
    } else if (model === "customers") {
      data = await Customer.find();
    } else if (model === "support") {
      data = await Support.find();
    } else if (model === "leads") {
      data = await Leads.find();
    } else {
      return res.status(400).json({ message: "Invalid model name." });
    }

    // Save to DataBackup collection
    const backup = new DataBackup({
      userId,
      model,
      backupData: data,
    });

    await backup.save();
    res.status(200).json({ message: `Backup for ${model} created.`, backup });
  } catch (error) {
    console.error("🔥 Error creating backup:", error);
    res.status(500).json({ message: "Error creating backup", error });
  }
};

// Restore Data
// exports.restoreBackup = async (req, res) => {
//   try {
//     console.log("🔹 Restore API called!");

//     if (!req.file) {
//       console.log("❌ No file received.");
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     console.log("✅ File received:", req.file);

//     const filePath = req.file.path;
//     const fileData = JSON.parse(fs.readFileSync(filePath, "utf8"));

//     await DataBackup.create({ userId: req.user.userId, backupData: fileData });

//     res.status(200).json({ message: "Data restored successfully" });
//   } catch (error) {
//     console.error("🔥 Error restoring data:", error);
//     res.status(500).json({ message: "Error restoring data", error });
//   }
// };

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

    const { model } = req.query; // e.g., ?model=appointments
    const userId = req.user.userId;

    if (!model) {
      return res.status(400).json({ message: "Model is required." });
    }

    // Function to remove _id from the backup data
    const removeIds = (data) => {
      return data.map((item) => {
        const { _id, ...rest } = item; // Destructure and remove _id field
        return rest; // Return the document without _id
      });
    };

    // Check if the backup data matches the correct model
    if (!fileData || !Array.isArray(fileData)) {
      return res.status(400).json({ message: "Invalid backup data format." });
    }

    let restoredData;
    if (model === "appointments") {
      const cleanedData = removeIds(fileData); // Clean the data
      restoredData = await Appointment.insertMany(cleanedData); // Insert cleaned data
    } else if (model === "tasks") {
      const cleanedData = removeIds(fileData); // Clean the data
      restoredData = await Task.insertMany(cleanedData); // Insert cleaned data
    } else if (model === "sales") {
      const cleanedData = removeIds(fileData); // Clean the data
      restoredData = await Sales.insertMany(cleanedData); // Insert cleaned data
    } else if (model === "customers") {
      const cleanedData = removeIds(fileData); // Clean the data
      restoredData = await Customer.insertMany(cleanedData); // Insert cleaned data
    } else if (model === "support") {
      const cleanedData = removeIds(fileData); // Clean the data
      restoredData = await Support.insertMany(cleanedData); // Insert cleaned data
    } else if (model === "leads") {
      const cleanedData = removeIds(fileData); // Clean the data
      restoredData = await Leads.insertMany(cleanedData); // Insert cleaned data
    } else {
      return res.status(400).json({ message: "Invalid model name." });
    }

    // Optionally save the restored backup entry in the DataBackup collection
    await DataBackup.create({
      userId,
      model,
      backupData: fileData,
    });

    res.status(200).json({ message: `${model.charAt(0).toUpperCase() + model.slice(1)} data restored successfully.`, restoredData });
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
