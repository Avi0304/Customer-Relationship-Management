import React, { useState, useEffect, useContext } from "react";
import Sidebar from "../components/SideBar";
import TopNav from "../components/TopNav";
import { UserContext } from "../context/UserContext";
import {
  Avatar,
  Box,
  Button,
  TextField,
  Switch,
  CircularProgress,
  useTheme,
  Typography,
  Select, MenuItem, FormControl, InputLabel
} from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { Settings } from "@mui/icons-material";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaShieldAlt, FaFileCsv } from "react-icons/fa";
import { LuFileJson2 } from "react-icons/lu";
import { MdBackup, MdOutlineRestore, MdPolicy, MdDelete } from "react-icons/md";
import { FiEdit } from "react-icons/fi";

const token = localStorage.getItem("token"); // Fetch token dynamically

const SettingsPage = () => {
  const { tab: urlTab } = useParams();
  const [tab, setTab] = useState(urlTab || "profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const theme = useTheme();
  const [password, setPassword] = useState({
    email: "",
    token: "",
    newPassword: "",
  });
  const [otp, setOtp] = useState(false);
  const [success, setSuccess] = useState("");

  const { user, setUser } = useContext(UserContext);

  const pushEnabled = localStorage.getItem("pushEnabled") === "true"
  const [notifications, setNotifications] = useState({
    email: true,
    push: pushEnabled,
  });

  const [selectedModel, setSelectedModel] = useState("");
  const [backupFile, setBackupFile] = useState(null);
  const [selectedBackUpModel, setSelectedBackUpModel] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token") || "";

        if (!token) {
          console.error("❌ No token found! User might not be logged in.");
          setError("Unauthorized. Please log in.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          "http://localhost:8080/api/Profile/get-profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setUser(response.data); // ✅ Store user data
      } catch (err) {
        console.error("❌ Error fetching profile:", err.response?.data || err);
        setError(err.response?.data?.message || "Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [refresh]); // ✅ Runs when `refresh` changes

  useEffect(() => {
    if (urlTab) setTab(urlTab);
  }, [urlTab]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1500);
  }, []);

  useEffect(() => {
    setPassword({
      email: "",
      token: "",
      newPassword: "",
    });
    setSuccess("");
  }, [tab]);

  const handleFieldChange = (field, value) => {
    setUser((prevuser) => ({
      ...prevuser,
      [field]: value,
    }));
  };

  const handleFieldSecurity = (field, value) => {
    setPassword((prev) => ({ ...prev, [field]: value }));
  };

  // Handle OTP Button Click
  const handleSendOTP = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8080/api/user/forget-password",
        { email: password.email }
      );

      if (response.status === 200) {
        setOtp(true);
        Swal.fire({
          title: "Send Reset Token!",
          text: "Reset token send to your email.",
          timer: 1500,
          icon: "success",
          iconColor: "green",
          showConfirmButton: false,
          allowOutsideClick: false,
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Oops!",
        text: "Something went Wrong...",
        icon: "error",
        iconColor: "red",
        timer: 1500,
        confirmButtonText: "OK",
      });
    }
  };

  // === Password Change Logic ===
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (!password.email || !password.token || !password.newPassword) {
      Swal.fire({
        title: "Error!",
        text: "Please fill in all fields.",
        icon: "warning",
        iconColor: "orange",
      });
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/user/reset-password",
        {
          email: password.email,
          token: password.token,
          newPassword: password.newPassword,
        }
      );

      if (response.status === 200) {
        setSuccess("Password Reset Successfully...");
        Swal.fire({
          title: "Password Reset Successfully!",
          text: "You can now log in with your new password.",
          icon: "success",
          iconColor: "green",
          timer: 1500,
          showConfirmButton: false,
          allowOutsideClick: false,
        });

        // setTimeout(() => navigate("/login"), 2000);
      }
    } catch (error) {
      console.error(
        "Reset Password Error:",
        error.response?.data || error.message
      );

      Swal.fire({
        title: "Oops!",
        text: error.response?.data?.message || "Something went wrong...",
        icon: "error",
        iconColor: "red",
        timer: 1500,
        confirmButtonText: "OK",
      });
    }
  };

  // === Profile Save Logic ===
  const handleSaveProfile = async () => {
    setSaving(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        Swal.fire("Error", "Unauthorized access", "error");
        setSaving(false);
        return;
      }

      // Define API endpoints for different profile sections
      const endpoints = {
        profile: "http://localhost:8080/api/profile/update-profile",
        contact: "http://localhost:8080/api/profile/update-contact",
        professional: "http://localhost:8080/api/profile/update-professional",
      };

      const profileFields = ["name", "bio", "dob"];
      const contactFields = ["email", "phone", "address"];
      const professionalFields = ["organization", "skills", "occupation"];

      // Prepare data for each section
      const profileData = {};
      const contactData = {};
      const professionalData = {};

      Object.keys(user).forEach((field) => {
        if (profileFields.includes(field) && user[field]) {
          profileData[field] = user[field];
        } else if (contactFields.includes(field) && user[field]) {
          contactData[field] = user[field];
        } else if (professionalFields.includes(field) && user[field]) {
          professionalData[field] = user[field];
        }
      });

      // Send API requests only for the sections that have updates
      if (Object.keys(profileData).length) {
        await axios.put(endpoints.profile, profileData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      if (Object.keys(contactData).length) {
        await axios.put(endpoints.contact, contactData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      if (Object.keys(professionalData).length) {
        await axios.put(endpoints.professional, professionalData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      Swal.fire("Success", "Profile updated successfully", "success");
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error(
        "Error updating profile:",
        error.response?.data || error.message
      );
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to update profile",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  // === Enable 2FA Logic ===
  const handleEnable2FA = async () => {
    try {
      const newStatus = !user.is2FAEnabled;

      await axios.post("http://localhost:8080/api/user/enable-2fa", {
        email: user.email,
        enable: newStatus,
      });

      Swal.fire(
        "Success",
        `Two-Factor Authentication ${newStatus ? "Enabled" : "Disabled"}`,
        "success"
      );

      // Update the user state
      setUser((prevUser) => ({
        ...prevUser,
        is2FAEnabled: newStatus,
      }));
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to update 2FA status",
        "error"
      );
    }
  };

  // === Notifications Save Logic ===
  const handleSaveNotifications = async () => {
    try {
      await axios.put("/api/notifications/update", notifications);
      Swal.fire("Success", "Notification preferences updated", "success");
    } catch (error) {
      Swal.fire("Error", "Failed to update notifications", "error");
    }
  };

  // === Data Management Logic ===
  // === Export Data ===
  const handleExportData = async (format, model) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/data/export?format=${format}&model=${model}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob", // Ensure proper file handling
        }
      );

      const blob = new Blob([response.data], {
        type: format === "csv" ? "text/csv" : "application/json",
      });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `data_${model}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      Swal.fire("Success", `Data of ${model} exported as ${format}`, "success");
    } catch (error) {
      console.error("Error exporting data:", error);
      Swal.fire("Error", "Failed to export data", "error");
    }
  };

  // === Backup Data and Store it Locally ===
  const handleBackup = async (modelName) => {
    try {
      const token = localStorage.getItem("token");

      if (!token || token === "undefined") {
        Swal.fire("Error", "Token missing. Please log in again.", "error");
        return;
      }


      // ✅ Send the correct user settings data for backup
      const response = await axios.post(
        `http://localhost:8080/api/data/backup?model=${modelName}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const backupData = response.data.backup.backupData;
      const jsonString = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const fileUrl = URL.createObjectURL(blob);

      setBackupFile(blob); // ✅ Store the backup file in state

      Swal.fire("Success", `Backup for ${modelName} created successfully!`, "success");

      // ✅ Automatically trigger file download
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = `backup-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("🔥 Error creating backup:", error.response?.data || error);
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to create backup",
        "error"
      );
    }
  };

  // === Restore Data from Stored Backup File ===
  const handleRestore = async (e, modelName) => {
    console.log("🔹 Restore function triggered!");
  
    // Ensure the file is selected
    const file = e.target.files[0];
    if (!file) {
      console.warn("⚠️ No file selected!");
      Swal.fire("Error", "No backup file selected!", "error");
      return;
    }
  
    console.log("📂 Selected File:", file);
  
    // Ensure the file is a .json file
    if (!file.name.endsWith(".json")) {
      console.warn("⚠️ Invalid file format:", file.name);
      Swal.fire("Error", "Invalid file format! Please upload a .json file.", "error");
      return;
    }
  
    // Token check (authentication)
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("⚠️ No token found!");
      Swal.fire("Error", "Unauthorized. Please log in again.", "error");
      return;
    }
  
    // Prepare the form data for upload
    const formData = new FormData();
    formData.append("backupFile", file);
  
    console.log("📤 Sending FormData:", formData);
  
    // Send the request to restore the data
    try {
      // Add the model as a query parameter
      const response = await axios.post(
        `http://localhost:8080/api/data/restore?model=${modelName}`, // Add model as query param
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("✅ Restore Response:", response.data);
      Swal.fire("Success", "Data restored successfully!", "success");
    } catch (error) {
      console.error("🔥 Error restoring data:", error.response?.data || error);
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to restore data",
        "error"
      );
    }
  };
  








  const handleViewPolicy = () => {
    Swal.fire({
      title: "📜 Data Retention Policy",
      html: `
        <p>We store your data securely for up to <b>12 months</b>.</p>
        <p>After this period, inactive data will be permanently deleted.</p>
        <p>You can manually delete your data anytime from the settings.</p>
      `,
      icon: "info",
      confirmButtonText: "Got it!",
    });
  };

  // === Delete Account ===
  const handleDeleteAccount = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action will permanently delete your account!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete("http://localhost:8080/api/data/delete", {
          headers: { Authorization: `Bearer ${token}` },
        });

        Swal.fire("Deleted", "Your account has been deleted", "success");
      } catch (error) {
        console.error("Error deleting account:", error);
        Swal.fire("Error", "Failed to delete account", "error");
      }
    }
  };

  const handleProfilePhotoChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Show the uploaded image immediately
    const imageUrl = URL.createObjectURL(file);
    setUser((prev) => ({ ...prev, photo: imageUrl }));

    const formData = new FormData();
    formData.append("photo", file);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "http://localhost:8080/api/Profile/update-photo",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      URL.revokeObjectURL(imageUrl);

      setUser((prev) => ({
        ...prev,
        photo: `http://localhost:8080${response.data.profilePhoto}`, // Ensure correct server path
      }));

      setRefresh((prev) => !prev); // Trigger re-fetch if needed
    } catch (error) {
      console.error(
        "Error uploading profile photo:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <Box display="flex" minHeight="100vh">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <TopNav title="Settings" />

        <div className="flex min-h-screen bg-white-100">
          <div className="flex-1 p-6">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <CircularProgress />
              </div>
            ) : (
              <>
                {/* Profile Tab */}
                {tab === "profile" && (
                  <div className="bg-white shadow-xl rounded-lg p-6 dark:bg-[#1B222D]">
                    {/* Avatar & Info Section */}
                    <div className="flex items-center gap-6 mb-6">
                      <div className="relative">
                        <Avatar
                          src={
                            user.photo
                              ? user.photo.startsWith("blob")
                                ? user.photo
                                : `http://localhost:8080${user.photo}`
                              : "https://via.placeholder.com/150"
                          }
                          sx={{
                            width: 96,
                            height: 96,
                            border: "4px solid #fff",
                            boxShadow: "0 0 10px rgba(0,0,0,0.2)",
                          }}
                        />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          id="profile-photo"
                          onChange={handleProfilePhotoChange}
                        />
                        <label
                          htmlFor="profile-photo"
                          className="absolute bottom-0 right-0 bg-white border rounded-full border-gray-400 p-1 cursor-pointer shadow-lg"
                        >
                          <FiEdit className="text-gray-600" />
                        </label>
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                          {user.name}
                        </h2>
                        <p className="text-md text-gray-600 dark:text-gray-400">
                          {user.occupation} at {user.organization}
                        </p>
                      </div>
                    </div>

                    {/* Form Fields Section */}
                    <div className="grid gap-4">
                      {[
                        "name",
                        "dob",
                        "email",
                        "address",
                        "phone",
                        "organization",
                        "occupation",
                        "skills",
                      ].map((field) => (
                        <TextField
                          key={field}
                          label={field.replace(/([A-Z])/g, " $1").trim()}
                          value={user[field]}
                          onChange={(e) =>
                            handleFieldChange(field, e.target.value)
                          }
                          fullWidth
                          variant="outlined"
                        />
                      ))}

                      {/* Save Button */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          mt: 4,
                        }}
                      >
                        <Button
                          variant="contained"
                          sx={{
                            backgroundColor: "#3B82F6",
                            textTransform: "capitalize",
                            width: "200px",
                            "&:hover": { backgroundColor: "#2563EB" },
                          }}
                          onClick={handleSaveProfile}
                          disabled={saving}
                        >
                          {saving ? (
                            <CircularProgress size={24} color="inherit" />
                          ) : (
                            "Save Changes"
                          )}
                        </Button>
                      </Box>
                    </div>
                  </div>
                )}

                {/* Security Tab */}
                {tab === "security" && (
                  <div className="bg-white shadow-xl rounded-lg p-6 dark:bg-[#1B222D]">
                    {/* Password Change Section */}
                    <div className="mt-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-semibold flex items-center gap-2">
                            <RiLockPasswordFill /> Change Password
                          </h3>
                          <p className="text-sm text-gray-500 mb-2">
                            Add an extra layer of security by updating your
                            password regularly.
                          </p>
                        </div>
                        {success ? (
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              my: 2,
                            }}
                          >
                            <Typography
                              variant="body1"
                              sx={{ color: "green", fontWeight: "bold" }}
                            >
                              {success}
                            </Typography>
                          </Box>
                        ) : (
                          <>
                            <TextField
                              label="Email"
                              variant="outlined"
                              type="email"
                              fullWidth
                              value={password.email}
                              onChange={(e) =>
                                handleFieldSecurity("email", e.target.value)
                              }
                              sx={{ mb: 2 }}
                            />

                            {otp && (
                              <>
                                <TextField
                                  label="OTP"
                                  variant="outlined"
                                  type="text"
                                  fullWidth
                                  value={password.token}
                                  onChange={(e) =>
                                    handleFieldSecurity("token", e.target.value)
                                  }
                                  sx={{ mb: 2 }}
                                />

                                <TextField
                                  label="New Password"
                                  variant="outlined"
                                  type="password"
                                  fullWidth
                                  value={password.newPassword}
                                  onChange={(e) =>
                                    handleFieldSecurity(
                                      "newPassword",
                                      e.target.value
                                    )
                                  }
                                  sx={{ mb: 2 }}
                                />
                              </>
                            )}

                            {!otp && (
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                              >
                                <Button
                                  variant="contained"
                                  color="primary"
                                  sx={{
                                    backgroundColor: "#3B82F6",
                                    textTransform: "capitalize",
                                    width: "200px",
                                  }}
                                  onClick={handleSendOTP}
                                >
                                  Send OTP
                                </Button>
                              </Box>
                            )}

                            {otp && (
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                              >
                                <Button
                                  variant="contained"
                                  color="primary"
                                  sx={{
                                    backgroundColor: "#3B82F6",
                                    textTransform: "capitalize",
                                    width: "200px",
                                  }}
                                  onClick={handlePasswordChange}
                                >
                                  Reset Password
                                </Button>
                              </Box>
                            )}
                          </>
                        )}
                      </div>

                      {/* Two-Factor Authentication */}
                      <div className="border-t border-gray-300 my-4"></div>
                      <div className="mb-6">
                        <div className="mb-4">
                          <h3 className="text-lg font-semibold flex items-center gap-2">
                            <FaShieldAlt />
                            Two-Factor Authentication (2FA)
                          </h3>
                          <p className="text-sm text-gray-500 mb-2">
                            Add an extra layer of security by enabling 2FA.
                          </p>
                        </div>
                        <Button
                          variant="outlined"
                          sx={{
                            borderColor: "gray",
                            color:
                              theme.palette.mode === "dark" ? "white" : "black",
                            textTransform: "capitalize",
                            px: 3,
                          }}
                          onClick={handleEnable2FA}
                        >
                          {user.is2FAEnabled ? "Disable 2FA" : "Enable 2FA"}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notifications Tab */}
                {tab === "notifications" && (
                  <div className="bg-white shadow-xl rounded-lg p-6 dark:bg-[#1B222D]">
                    {/* Notification user */}
                    <div className="mt-6">
                      <div className="space-y-4">
                        {[
                          {
                            key: "email",
                            label: "Email Notifications",
                            description:
                              "Receive important updates, reminders, and alerts via email.",
                            icon: "📧",
                          },
                          {
                            key: "push",
                            label: "Push Notifications",
                            description:
                              "Get instant alerts directly in your browser.",
                            icon: "🔔",
                          },
                        ].map(({ key, label, description, icon }) => (
                          <div
                            key={key}
                            className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-700"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-xl">{icon}</span>
                              <div>
                                <p className="font-semibold">{label}</p>
                                <p className="text-sm text-gray-500">
                                  {description}
                                </p>
                              </div>
                            </div>

                            <Switch
                              checked={notifications[key]}
                              onChange={() => {
                                setNotifications((prev) => {
                                  const updatedNotifications = {
                                    ...prev,
                                    [key]: !prev[key],
                                  };
                                  // For push notifications, also update the localStorage
                                  if (key === "push") {
                                    const isPushEnabled = !prev[key];
                                    localStorage.setItem("pushEnabled", isPushEnabled.toString()); // Save to localStorage
                                  }
                                  return updatedNotifications;
                                });
                              }}
                            />
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-gray-300 my-4"></div>

                      {/* Advanced Preferences */}
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold">
                          Advanced Preferences
                        </h3>
                        <p className="text-sm text-gray-500 mb-2">
                          Customize the frequency and priority of notifications.
                        </p>

                        <Button
                          variant="outlined"
                          sx={{
                            borderColor: "gray",
                            color:
                              theme.palette.mode === "dark" ? "white" : "black",
                            textTransform: "capitalize",
                            px: 3,
                          }}
                        >
                          Manage Preferences
                        </Button>
                      </div>

                      {/* Save Button */}
                      <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <Button
                          variant="contained"
                          color="primary"
                          sx={{
                            backgroundColor: "#3B82F6",
                            textTransform: "capitalize",
                            width: "200px",
                          }}
                          onClick={handleSaveNotifications}
                        >
                          Save Preferences
                        </Button>
                      </Box>
                    </div>
                  </div>
                )}


                {/* Data Management Tab */}
                {tab === "data" && (
                  <div className="bg-white shadow-xl rounded-lg p-6 dark:bg-[#1B222D]">
                    {/* Data Export Section */}
                    <div className="mt-6">
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold">Export Data</h3>
                        <p className="text-gray-500 text-sm mb-4">
                          Download your data securely in CSV or JSON format.
                        </p>

                        <FormControl
                          variant="outlined"
                          size="small"
                          sx={{ minWidth: 200 }}
                          fullWidth
                        >
                          <InputLabel>Select Data to Export</InputLabel>
                          <Select
                            value={selectedModel}
                            onChange={(e) => setSelectedModel(e.target.value)}
                            label="Select Data to Export"
                          >
                            {/* <MenuItem value="" disabled>Select Model</MenuItem> */}
                            <MenuItem value="appointments">Appointments</MenuItem>
                            <MenuItem value="tasks">Tasks</MenuItem>
                            <MenuItem value="leads">Leads</MenuItem>
                            <MenuItem value="customers">Customers</MenuItem>
                            <MenuItem value="sales">Sales</MenuItem>
                            <MenuItem value="support">Customer Support</MenuItem>
                          </Select>
                        </FormControl>

                        <div className="flex gap-3 mt-4">
                          <Button
                            variant="contained"
                            color="primary"

                            sx={{
                              backgroundColor: "#3B82F6",
                              color: "white",
                              textTransform: "capitalize",
                              px: 3,
                            }}
                            onClick={() => handleExportData("csv", selectedModel)}
                            startIcon={<FaFileCsv />}
                          >
                            Export as CSV
                          </Button>

                          <Button
                            variant="contained"
                            color="primary"
                            sx={{
                              backgroundColor: "#3B82F6",
                              color: "white",
                              textTransform: "capitalize",
                              px: 3,
                            }}
                            onClick={() => handleExportData("json", selectedModel)}
                            startIcon={<LuFileJson2 />}
                          >
                            Export as JSON
                          </Button>
                        </div>
                      </div>

                      <div className="border-t border-gray-300 my-4"></div>

                      {/* Backup & Restore Section */}
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold">
                          Backup & Restore
                        </h3>
                        <p className="text-gray-500 text-sm mb-4">
                          Backup your current data or restore data from a backup
                          file.
                        </p>

                        <FormControl
                          variant="outlined"
                          size="small"
                          sx={{ minWidth: 200 }}
                          fullWidth
                        >
                          <InputLabel>Select Data to Backup</InputLabel>
                          <Select
                            value={selectedBackUpModel}
                            onChange={(e) => setSelectedBackUpModel(e.target.value)}
                            label="Select Data to Backup"
                          >
                            {/* <MenuItem value="" disabled>Select Model</MenuItem> */}
                            <MenuItem value="appointments">Appointments</MenuItem>
                            <MenuItem value="tasks">Tasks</MenuItem>
                            <MenuItem value="leads">Leads</MenuItem>
                            <MenuItem value="customers">Customers</MenuItem>
                            <MenuItem value="sales">Sales</MenuItem>
                            <MenuItem value="support">Customer Support</MenuItem>
                          </Select>
                        </FormControl>

                        <div className="flex gap-3 mt-4">
                          <Button
                            variant="contained"
                            color="primary"
                            sx={{
                              backgroundColor: "#16A34A",
                              color: "white",
                              textTransform: "capitalize",
                              px: 3,
                            }}
                            onClick={() => handleBackup(selectedBackUpModel)}
                            startIcon={<MdBackup />}
                          >
                            Backup Now
                          </Button>

                          <label
                            htmlFor="restore-upload"
                            className="cursor-pointer"
                          >
                            <Button
                              variant="outlined"
                              color="secondary"
                              component="span"
                              sx={{
                                borderColor: "gray",
                                color:
                                  theme.palette.mode === "dark"
                                    ? "white"
                                    : "black",
                                textTransform: "capitalize",
                                px: 3,
                              }}
                              startIcon={<MdOutlineRestore />}
                            >
                              Restore Data
                            </Button>
                            <input
                              type="file"
                              id="restore-upload"
                              accept=".json"
                              hidden
                              onChange={(e) => handleRestore(e, selectedBackUpModel)} // Pass event and modelName to handleRestore
                            />

                          </label>
                        </div>
                      </div>

                      <div className="border-t border-gray-300 my-4"></div>

                      {/* Data Retention Policy */}
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold">
                          Data Retention Policy
                        </h3>
                        <p className="text-gray-500 text-sm mb-2">
                          View details about how long we store your data.
                        </p>

                        <Button
                          variant="outlined"
                          sx={{
                            borderColor: "gray",
                            color:
                              theme.palette.mode === "dark" ? "white" : "black",
                            textTransform: "capitalize",
                            px: 3,
                          }}
                          onClick={handleViewPolicy}
                          startIcon={<MdPolicy />}
                        >
                          View Policy
                        </Button>
                      </div>

                      <div className="border-t border-gray-300 my-4"></div>

                      {/* Danger Zone */}
                      <div className="mt-4">
                        <h3 className="text-lg font-semibold text-red-600">
                          Danger Zone
                        </h3>
                        <p className="text-gray-500 text-sm mb-2">
                          Permanently delete your account and all associated
                          data. This action is irreversible.
                        </p>

                        <Button
                          variant="contained"
                          color="error"
                          sx={{
                            textTransform: "capitalize",
                            px: 3,
                          }}
                          onClick={handleDeleteAccount}
                          startIcon={<MdDelete />}
                        >
                          Delete Account
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </Box>
    </Box>
  );
};

export default SettingsPage;
