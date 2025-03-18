import React, { useState, useEffect } from "react";
import Sidebar from "../components/SideBar";
import TopNav from "../components/TopNav";
import {
  Box,
  Button,
  TextField,
  Switch,
  Typography,
  CircularProgress,
  Avatar,
  Card,

} from "@mui/material";
import { useParams } from "react-router-dom";



const SettingsPage = () => {
  const { tab: urlTab } = useParams();
  const [tab, setTab] = useState(urlTab || 'profile');
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    jobTitle: "",
    department: "",
  });
  const [notifications, setNotifications] = useState({
    email: false,
    push: false,
  });

  useEffect(() => {
    if (urlTab) {
      setTab(urlTab);
    }
  }, [urlTab]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1500);
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  return (
    <Box display="flex" minHeight="100vh">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        {/* Top Navigation */}
        <TopNav title="Settings" />

        <div className="flex min-h-screen bg-white-100 ">

          {/* Main Content */}
          <div className="flex-1 p-6">
            {/* Settings Content */}
            <div className="w-full">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <CircularProgress />
                </div>
              ) : (
                <>
                  {tab === "profile" && (
                    <div className="bg-white shadow-xl rounded-lg p-6 bg-white dark:bg-[#1B222D]">
                      <h2 className="text-2xl font-semibold leading-none tracking-tight mb-1">Profile Settings</h2>
                      <p className="text-sm text-muted-foreground text-gray-500 mb-6">
                        Update your personal information and profile settings
                      </p>

                      {/* Avatar Section */}
                      <div className="flex items-center mb-6">
                        <Avatar sx={{ width: 64, height: 64, bgcolor: "gray", ml: 2 }}>
                          {profile.fullName ? profile.fullName[0] : "A"}
                        </Avatar>
                        <Button
                          variant="outlined"
                          sx={{ ml: 5, color: "black", borderColor: "gray", textTransform: 'capitalize' }}
                        >
                          Change Avatar
                        </Button>
                      </div>


                      {/* Profile Fields */}
                      <div className="grid gap-4">
                        <TextField
                          label="Full Name"
                          variant="outlined"
                          name="fullName"
                          value={profile.fullName}
                          onChange={handleChange}
                          fullWidth
                        />
                        <TextField
                          label="Email Address"
                          variant="outlined"
                          type="email"
                          name="email"
                          value={profile.email}
                          onChange={handleChange}
                          fullWidth
                        />
                        <TextField
                          label="Job Title"
                          variant="outlined"
                          name="jobTitle"
                          value={profile.jobTitle}
                          onChange={handleChange}
                          fullWidth
                        />
                        <TextField
                          label="Department"
                          variant="outlined"
                          name="department"
                          value={profile.department}
                          onChange={handleChange}
                          fullWidth
                        />

                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", mt: 2 }}>
                          <Button
                            variant="contained"
                            color="primary"
                            sx={{
                              width: "auto",
                              background: "black",
                              textTransform: "capitalize",
                            }}
                          >
                            Save Changes
                          </Button>
                        </Box>
                      </div>
                    </div>
                  )}

                  {tab === "security" && (
                    <div className="bg-white shadow-xl rounded-lg p-6 bg-white dark:bg-[#1B222D]">
                      <h2 className="text-2xl font-semibold leading-none tracking-tight mb-1">Security</h2>
                      <p className="text-sm text-muted-foreground text-gray-500 mb-6">
                        Manage your account security and authentication settings
                      </p>
                      <TextField
                        label="Current Password"
                        variant="outlined"
                        type="password"
                        fullWidth
                        sx={{ mb: 2 }}
                      />
                      <TextField
                        label="New Password"
                        variant="outlined"
                        type="password"
                        fullWidth
                        sx={{ mb: 2 }}
                      />
                      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", mt: 2 }}>
                        <Button
                          variant="contained"
                          color="primary"
                          sx={{
                            width: "auto",
                            background: "black",
                            textTransform: "capitalize",
                          }}
                        >
                          Update Changes
                        </Button>
                      </Box>
                    </div>
                  )}

                  {tab === "notifications" && (
                    <div className="bg-white shadow-xl rounded-lg p-6">
                      {/* Title & Description */}
                      <h2 className="text-2xl font-semibold leading-none tracking-tight mb-1">Notifications</h2>
                      <p className="text-sm text-muted-foreground text-gray-500 mb-6">
                        Configure how you receive notifications and alerts
                      </p>

                      {/* Notification Options */}
                      {[
                        { key: "email", label: "Email Notifications", description: "Receive notifications via email" },
                        { key: "push", label: "Push Notifications", description: "Receive notifications in the browser" }
                      ].map(({ key, label, description }) => (
                        <div key={key} className="flex justify-between items-center mb-4">
                          <div>
                            <p variant="body1" className="font-bold">{label}</p>
                            <p variant="body2" className="text-gray-500">{description}</p>
                          </div>
                          <Switch
                            checked={notifications[key]}
                            onChange={() => setNotifications({ ...notifications, [key]: !notifications[key] })}
                          />
                        </div>
                      ))}

                      {/* Save Preferences Button */}
                      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", mt: 2 }}>
                        <Button
                          variant="contained"
                          color="primary"
                          sx={{
                            width: "auto",
                            background: "black",
                            textTransform: "capitalize",
                          }}
                        >
                          Save Preferences
                        </Button>
                      </Box>
                    </div>
                  )}

                  {tab === "data" && (
                    <div className="bg-white shadow-xl rounded-lg p-6 bg-white dark:bg-[#1B222D]">
                      {/* Title */}
                      <h2 className="text-2xl font-semibold leading-none tracking-tight mb-1">Data Management</h2>
                      <p className="text-sm text-muted-foreground text-gray-500 mb-4">Manage your data and export options</p>

                      {/* Export Data Section */}
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold">Export Data</h3>
                        <p className="text-gray-500 text-sm mb-2">Download all your data in CSV or JSON format</p>

                        <div className="flex gap-3">
                          <Button
                            variant="outlined"
                            sx={{ borderColor: "gray", color: "black", textTransform: 'capitalize' }}
                          >
                            Export as CSV
                          </Button>

                          <Button
                            variant="outlined"
                            sx={{ borderColor: "gray", color: "black", textTransform: 'capitalize' }}
                          >
                            Export as JSON
                          </Button>

                        </div>
                      </div>

                      {/* Danger Zone */}
                      <div className="mt-4">
                        <h3 className="text-lg font-semibold text-red-600">Danger Zone</h3>
                        <p className="text-gray-500 text-sm mb-2">Permanently delete your account and all associated data</p>

                        <Button variant="contained" color="error" sx={{ textTransform: 'capitalize' }}>
                          Delete Account
                        </Button>
                      </div>
                    </div>
                  )}

                </>
              )}
            </div>
          </div>
        </div>
      </Box>
    </Box>
  );
};

export default SettingsPage;
