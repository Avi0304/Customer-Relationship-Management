import React, { useState, useEffect } from "react";
import Sidebar from "../components/SideBar";
import TopNav from "../components/TopNav";
import {
  Avatar,
  Box,
  Button,
  TextField,
  Switch,
  CircularProgress,
} from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const SettingsPage = () => {
  const { tab: urlTab } = useParams();
  const [tab, setTab] = useState(urlTab || "profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [settings, setSettings] = useState({
    fullName: "Aayush Patel",
    dateOfBirth: "12/10/2003",
    email: "ap3017015@gmail.com",
    address: "64, In Darwaja, Near Ramji Temple, Gamdi, Anand, Gujarat, India",
    phone: "+91 7048512103",
    organization: "Tech Elecon Pvt. Ltd.",
    occupation: "Developer",
    skills: "React, Node.js, JavaScript",
    currentPassword: "",
    newPassword: "",
  });

  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
  });

  useEffect(() => {
    if (urlTab) setTab(urlTab);
  }, [urlTab]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1500);
  }, []);

  const handleFieldChange = (field, value) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [field]: value,
    }));
  };

  // === Profile Save Logic ===
  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await axios.put("/api/profile/update", settings);
      Swal.fire("Success", "Profile updated successfully", "success");
    } catch (error) {
      Swal.fire("Error", "Failed to update profile", "error");
    } finally {
      setSaving(false);
    }
  };

  // === Password Change Logic ===
  const handlePasswordChange = async () => {
    const { currentPassword, newPassword } = settings;
    try {
      await axios.put("/api/security/change-password", {
        currentPassword,
        newPassword,
      });
      Swal.fire("Success", "Password updated successfully", "success");
    } catch (error) {
      Swal.fire("Error", "Failed to update password", "error");
    }
  };

  // === Enable 2FA Logic ===
  const handleEnable2FA = async () => {
    try {
      await axios.post("/api/security/enable-2fa");
      Swal.fire("Success", "Two-Factor Authentication Enabled", "success");
    } catch (error) {
      Swal.fire("Error", "Failed to enable 2FA", "error");
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
  const handleExportData = async (format) => {
    try {
      const response = await axios.get(`/api/data/export?format=${format}`);
      const blob = new Blob([response.data], {
        type: format === "csv" ? "text/csv" : "application/json",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `data.${format}`;
      link.click();
    } catch (error) {
      Swal.fire("Error", "Failed to export data", "error");
    }
  };

  const handleBackup = async () => {
    try {
      await axios.post("/api/data/backup");
      Swal.fire("Success", "Backup created successfully", "success");
    } catch (error) {
      Swal.fire("Error", "Failed to create backup", "error");
    }
  };

  const handleRestore = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("backupFile", file);

    try {
      await axios.post("/api/data/restore", formData);
      Swal.fire("Success", "Data restored successfully", "success");
    } catch (error) {
      Swal.fire("Error", "Failed to restore data", "error");
    }
  };

  // === Account Deletion Logic ===
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
        await axios.delete("/api/account/delete");
        Swal.fire("Deleted", "Your account has been deleted", "success");
      } catch (error) {
        Swal.fire("Error", "Failed to delete account", "error");
      }
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
                  <div className="bg-white shadow-xl rounded-lg p-6">
                    <h2 className="text-2xl font-semibold mb-2">
                      Profile Settings
                    </h2>

                    {/* Avatar & Info */}
                    <div className="flex items-center gap-4 mb-6">
                      <Avatar
                        src="https://avatar.iran.liara.run/public/1"
                        sx={{
                          width: 96,
                          height: 96,
                          border: "4px solid #fff",
                        }}
                      />
                      <div>
                        <h2 className="text-3xl font-bold">
                          {settings.fullName}
                        </h2>
                        <p className="text-md">
                          {settings.occupation} at {settings.organization}
                        </p>
                      </div>
                    </div>

                    {/* Fields Section */}
                    <div className="grid gap-4">
                      {[
                        "fullName",
                        "dateOfBirth",
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
                          value={settings[field]}
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
                          color="primary"
                          sx={{
                            background: "black",
                            textTransform: "capitalize",
                            width: "200px",
                          }}
                          onClick={handleSaveProfile} // Add this
                          disabled={saving}
                        >
                          {saving ? (
                            <CircularProgress size={24} />
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
                    <h2 className="text-2xl font-semibold mb-2">
                      Security Settings
                    </h2>
                    <p className="text-sm text-gray-500 mb-6">
                      Strengthen your account security by updating your password
                      and managing key settings.
                    </p>

                    {/* Password Change Section */}
                    <div className="space-y-4">
                      <TextField
                        label="Current Password"
                        variant="outlined"
                        type="password"
                        fullWidth
                        value={settings.currentPassword}
                        onChange={(e) =>
                          handleFieldChange("currentPassword", e.target.value)
                        }
                        sx={{ mb: 2 }}
                      />

                      <TextField
                        label="New Password"
                        variant="outlined"
                        type="password"
                        fullWidth
                        value={settings.newPassword}
                        onChange={(e) =>
                          handleFieldChange("newPassword", e.target.value)
                        }
                        sx={{ mb: 2 }}
                      />
                      <TextField
                        label="Confirm New Password"
                        variant="outlined"
                        type="password"
                        fullWidth
                        sx={{ mb: 2 }}
                      />

                      <Box sx={{ display: "flex", justifyContent: "center" }}>
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
                          Change Password
                        </Button>
                      </Box>
                    </div>

                    {/* Two-Factor Authentication */}
                    <div className="border-t border-gray-300 my-4"></div>
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold">
                        Two-Factor Authentication (2FA)
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">
                        Add an extra layer of security by enabling 2FA.
                      </p>
                      <Button
                        variant="outlined"
                        sx={{
                          borderColor: "gray",
                          color: "black",
                          textTransform: "capitalize",
                          px: 3,
                        }}
                        onClick={handleEnable2FA}
                      >
                        Enable 2FA
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
                      >
                        Save Changes
                      </Button>
                    </Box>
                  </div>
                )}

                {/* Notifications Tab */}
                {tab === "notifications" && (
                  <div className="bg-white shadow-xl rounded-lg p-6 dark:bg-[#1B222D]">
                    <h2 className="text-2xl font-semibold mb-2">
                      Notification Preferences
                    </h2>
                    <p className="text-sm text-gray-500 mb-6">
                      Manage how you receive important updates and alerts.
                    </p>

                    {/* Notification Settings */}
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
                            onChange={() =>
                              setNotifications((prev) => ({
                                ...prev,
                                [key]: !prev[key],
                              }))
                            }
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
                          color: "black",
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
                )}

                {/* Data Management Tab */}
                {tab === "data" && (
                  <div className="bg-white shadow-xl rounded-lg p-6 dark:bg-[#1B222D]">
                    <h2 className="text-2xl font-semibold mb-2">
                      Data Management
                    </h2>
                    <p className="text-sm text-gray-500 mb-6">
                      Manage your data, backup options, and account removal
                      settings.
                    </p>

                    {/* Data Export Section */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold">Export Data</h3>
                      <p className="text-gray-500 text-sm mb-2">
                        Download your data securely in CSV or JSON format.
                      </p>

                      <div className="flex gap-3">
                        <Button
                          variant="contained"
                          color="primary"
                          sx={{
                            backgroundColor: "#3B82F6",
                            color: "white",
                            textTransform: "capitalize",
                            px: 3,
                          }}
                          onClick={() => handleExportData("csv")}
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
                          onClick={() => handleExportData("json")}
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
                      <p className="text-gray-500 text-sm mb-2">
                        Backup your current data or restore data from a backup
                        file.
                      </p>

                      <div className="flex gap-3">
                        <Button
                          variant="contained"
                          color="primary"
                          sx={{
                            backgroundColor: "#16A34A",
                            color: "white",
                            textTransform: "capitalize",
                            px: 3,
                          }}
                          onClick={handleBackup}
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
                              color: "black",
                              textTransform: "capitalize",
                              px: 3,
                            }}
                            onChange={handleRestore}
                          >
                            Restore Data
                          </Button>
                          <input
                            type="file"
                            id="restore-upload"
                            accept=".csv, .json"
                            hidden
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
                          color: "black",
                          textTransform: "capitalize",
                          px: 3,
                        }}
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
                        Permanently delete your account and all associated data.
                        This action is irreversible.
                      </p>

                      <Button
                        variant="contained"
                        color="error"
                        sx={{
                          textTransform: "capitalize",
                          px: 3,
                        }}
                        onClick={handleDeleteAccount}
                      >
                        Delete Account
                      </Button>
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
