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
import { FaUser, FaLock, FaBell, FaDatabase } from "react-icons/fa";
import { FiUser, FiShield,FiBell, FiDatabase } from "react-icons/fi";


const SettingsPage = () => {
  const [tab, setTab] = useState("profile");
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
          {/* Sidebar */}
          <aside className="w-64 h-screen bg-white  p-5 bg-white dark:bg-[#1B222D]">
            <h2 className="text-lg font-semibold mb-4">Settings</h2>
            <ul className="space-y-4">
              {[
                { label: "Profile", icon: <FiUser />, value: "profile" },
                { label: "Security", icon: <FiShield />, value: "security" },
                { label: "Notifications", icon: <FiBell />, value: "notifications" },
                { label: "Data Management", icon: <FiDatabase />, value: "data" },
              ].map((item) => (
                <li
                  key={item.value}
                  className={`flex items-center space-x-2 text-gray-700 hover:text-black cursor-pointer p-2 rounded ${tab === item.value ? "bg-gray-200 font-bold text-black" : ""
                    }`}
                  onClick={() => setTab(item.value)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          </aside>


          {/* Main Content */}
          <div className="flex-1 p-6">
            {/* Settings Content */}
            <div className="max-w-4xl mx-auto ">
              {loading ? (
                <CircularProgress />
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
                        <Avatar sx={{ width: 64, height: 64, bgcolor: "gray" }}>
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

                        <Button
                          variant="contained"
                          color="primary"
                          sx={{ width: "20%", background: 'black', padding: '2', textTransform: 'capitalize' }}
                        >
                          Save Changes
                        </Button>

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
                      <Button variant="contained" color="primary" sx={{ background: 'black', textTransform: 'capitalize' }}>
                        Update Password
                      </Button>
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
                      <Button variant="contained" color="primary" sx={{ background: 'black', textTransform: 'capitalize' }}>
                        Save Preferences
                      </Button>
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

                        <Button variant="contained" color="error" sx={{textTransform:'capitalize'}}>
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
