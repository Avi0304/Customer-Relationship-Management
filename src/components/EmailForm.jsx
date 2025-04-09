import React, { useState, useCallback, useEffect } from "react";
import {
  Button,
  TextField,
  Paper,
  Typography,
  Grid,
  FormControlLabel,
  Radio,
  RadioGroup,
  Box,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EmailForm = ({ togglePanel, onSubmit, allUsers = [], selectedCampaign }) => {
  const [schedule, setSchedule] = useState("immediately");
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    recipients: "",
    subject: "",
    body: "",
    scheduledTime: "",
  });

  // 🛠️ Load selectedCampaign data safely
  useEffect(() => {
    if (selectedCampaign) {
      setFormData({
        id: selectedCampaign._id || "",
        title: selectedCampaign.title || "",
        recipients: selectedCampaign.recipients?.join(", ") || "", // Avoid crash if recipients is undefined
        subject: selectedCampaign.subject || "",
        body: selectedCampaign.body || "",
        scheduledTime: selectedCampaign.scheduledTime || "",
      });
      setSchedule(selectedCampaign.schedule || "immediately");
    }
  }, [selectedCampaign]);

  // 🔄 Handle input changes
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  // 🔄 Handle schedule change
  const handleScheduleChange = useCallback((e) => {
    setSchedule(e.target.value);
  }, []);

  // ✅ Select all users' emails
  const handleSelectAllUsers = () => {
    const emails = allUsers.map((user) => user.email).join(", ");
    setFormData((prev) => ({ ...prev, recipients: emails }));
  };

  // 📨 Handle form submission with error handling
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
  
      const emailCampaign = {
        title: formData.title,
        recipients: formData.recipients.split(",").map((email) => email.trim()),
        subject: formData.subject,
        body: formData.body,
        schedule,
        scheduledTime: formData.scheduledTime,
        status: "Scheduled",
        campaignType: "email", // ✅ Required by backend
      };
  
      try {
        const response = await fetch(
          formData.id
            ? `http://localhost:8080/api/campaigns/${formData.id}`
            : "http://localhost:8080/api/campaign/add",
          {
            method: formData.id ? "PUT" : "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(emailCampaign),
          }
        );
  
        if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);
  
        const data = await response.json();
        toast.success(formData.id ? "Email campaign updated successfully!" : "Email campaign created successfully!");
  
        if (togglePanel) togglePanel();
        if (onSubmit) onSubmit(data);
      } catch (error) {
        console.error("Error:", error);
        toast.error("Server error! Please try again later.");
      }
    },
    [formData, schedule, togglePanel, onSubmit]
  );
  

  return (
    <>
      <ToastContainer />
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1300,
          overflow: "auto",
          p: 2,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            width: "100%",
            maxWidth: 600,
            p: 4,
            borderRadius: 2,
            position: "relative",
          }}
        >
          {/* Close Button */}
          <IconButton onClick={togglePanel} sx={{ position: "absolute", top: 8, right: 8 }}>
            <CloseIcon />
          </IconButton>

          {/* Back Button */}
          <IconButton onClick={togglePanel} sx={{ position: "absolute", top: 8, left: 8 }}>
            <ArrowBackIcon />
          </IconButton>

          <Typography variant="h4" align="center" gutterBottom>
            {formData.id ? "Update Email Campaign" : "Create Email Campaign"}
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="title"
                  label="Campaign Name"
                  variant="outlined"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12} container spacing={1} alignItems="center">
                <Grid item xs={12} sm={9}>
                  <TextField
                    fullWidth
                    name="recipients"
                    label="Recipients (comma-separated emails)"
                    variant="outlined"
                    value={formData.recipients}
                    onChange={handleChange}
                    required
                    placeholder="example1@gmail.com, example2@gmail.com"
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Button fullWidth variant="contained" onClick={handleSelectAllUsers} type="button">
                    Select All
                  </Button>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="subject"
                  label="Email Subject"
                  variant="outlined"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="body"
                  label="Email Content"
                  variant="outlined"
                  multiline
                  rows={4}
                  value={formData.body}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6">Schedule</Typography>
                <RadioGroup row name="schedule" value={schedule} onChange={handleScheduleChange}>
                  <FormControlLabel value="immediately" control={<Radio />} label="Send Immediately" />
                  <FormControlLabel value="later" control={<Radio />} label="Schedule for Later" />
                </RadioGroup>
                {schedule === "later" && (
                  <TextField
                    fullWidth
                    type="datetime-local"
                    name="scheduledTime"
                    variant="outlined"
                    required
                    sx={{ mt: 2 }}
                    value={formData.scheduledTime}
                    onChange={handleChange}
                  />
                )}
              </Grid>

              <Grid item xs={6}>
                <Button fullWidth variant="outlined" onClick={togglePanel} type="button">
                  Cancel
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button fullWidth variant="contained" color="primary" type="submit">
                  {formData.id ? "Update" : "Submit"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </>
  );
};

export default EmailForm;
