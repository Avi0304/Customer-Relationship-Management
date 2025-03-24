import React, { useState, useEffect, useContext } from "react";
import Sidebar from "../components/SideBar";
import TopNav from "../components/TopNav";
import { UserContext } from "../context/UserContext"
import {
  Avatar,
  Box,
  Button,
  TextField,
  Switch,
  CircularProgress,
  useTheme,
  Typography
} from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { Settings } from "@mui/icons-material";


const SettingsPage = () => {
  const { tab: urlTab } = useParams();
  const [tab, setTab] = useState(urlTab || "profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const theme = useTheme();
  const [password, setPassword] = useState({
    email: '',
    token: '',
    newPassword: "",
  })
  const [otp, setOtp] = useState(false);
  const [success, setSuccess] = useState("");

  const { user, setUser } = useContext(UserContext);

  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8080/api/Profile/get-profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.response?.data?.message || "Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [refresh]);

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
        iconColor: 'red',
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
      console.error("Reset Password Error:", error.response?.data || error.message);

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
      console.error("Error updating profile:", error.response?.data || error.message);
      Swal.fire("Error", error.response?.data?.message || "Failed to update profile", "error");
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

      Swal.fire("Success", `Two-Factor Authentication ${newStatus ? "Enabled" : "Disabled"}`, "success");

      // Update the user state
      setUser((prevUser) => ({
        ...prevUser,
        is2FAEnabled: newStatus, 
      }));
    } catch (error) {
      Swal.fire("Error", error.response?.data?.message || "Failed to update 2FA status", "error");
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
                  <div className="bg-white shadow-xl rounded-lg p-6 dark:bg-[#1B222D]">
                    <h2 className="text-2xl font-semibold mb-2">
                      Profile user
                    </h2>

                    {/* Avatar & Info */}
                    <div className="flex items-center gap-4 mb-6">
                      <Avatar
                        src={user.photo ? user.photo.startsWith("blob") ? user.photo : `http://localhost:8080${user.photo}` : "https://via.placeholder.com/150"}
                        sx={{ width: 96, height: 96, border: "4px solid #fff" }}
                      />
                      <div>
                        <h2 className="text-3xl font-bold">
                          {user.name}
                        </h2>
                        <p className="text-md">
                          {user.occupation} at {user.organization}
                        </p>
                      </div>
                    </div>

                    {/* Fields Section */}
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
                          color="primary"
                          sx={{
                            backgroundColor: "#3B82F6",
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
                      Security user
                    </h2>
                    <p className="text-sm text-gray-500 mb-6">
                      Strengthen your account security by updating your password
                      and managing key user.
                    </p>

                    {/* Password Change Section */}
                    <div className="space-y-4">
                      {success ? (
                        <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
                          <Typography variant="body1" sx={{ color: "green", fontWeight: "bold" }}>
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
                            onChange={(e) => handleFieldSecurity("email", e.target.value)}
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
                                onChange={(e) => handleFieldSecurity("token", e.target.value)}
                                sx={{ mb: 2 }}
                              />

                              <TextField
                                label="New Password"
                                variant="outlined"
                                type="password"
                                fullWidth
                                value={password.newPassword}
                                onChange={(e) => handleFieldSecurity("newPassword", e.target.value)}
                                sx={{ mb: 2 }}
                              />
                            </>
                          )}

                          {!otp && (
                            <Box sx={{ display: "flex", justifyContent: "center" }}>
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
                          color: theme.palette.mode === "dark" ? "white" : "black",
                          textTransform: "capitalize",
                          px: 3,
                        }}
                        onClick={handleEnable2FA}
                      >
                         {user.is2FAEnabled ? "Disable 2FA" : "Enable 2FA"}
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

                    {/* Notification user */}
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
                          color: theme.palette.mode === "dark" ? "white" : "black",
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
                      user.
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
                              color: theme.palette.mode === "dark" ? "white" : "black",
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
                          color: theme.palette.mode === "dark" ? "white" : "black",
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
