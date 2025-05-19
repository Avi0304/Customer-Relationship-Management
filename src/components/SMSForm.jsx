import React, { useState, useCallback } from "react";
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
import axios from "axios";

const SMSForm = ({ togglePanel }) => {
  const [schedule, setSchedule] = useState("immediately");
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    recipients: "", // Comma-separated phone numbers
  });
  const [scheduledTime, setScheduledTime] = useState("");

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleScheduleChange = useCallback((e) => {
    setSchedule(e.target.value);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const recipientsArray = formData.recipients
      .split(",")
      .map((num) => num.trim());

    const newCampaign = {
      title: formData.title,
      campaignType: "sms",
      message: formData.message,
      recipients: recipientsArray,
      schedule,
      ...(schedule === "later" && { scheduledTime }),
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/api/campaign/add",
        newCampaign,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("SMS Campaign created successfully:", response.data);
      togglePanel();
    } catch (error) {
      console.error(
        "Error creating SMS campaign:",
        error.response?.data || error
      );
    }
  };

  return (
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
        <IconButton
          onClick={togglePanel}
          sx={{ position: "absolute", top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>

        {/* Back Button */}
        <IconButton
          onClick={togglePanel}
          sx={{ position: "absolute", top: 8, left: 8 }}
        >
          <ArrowBackIcon />
        </IconButton>

        <Typography variant="h4" align="center" gutterBottom>
          Create SMS Campaign
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Campaign Name */}
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

            {/* Message Content */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="message"
                label="Message Content"
                variant="outlined"
                multiline
                rows={4}
                value={formData.message}
                onChange={handleChange}
                inputProps={{ maxLength: 160 }}
                required
              />
              <Typography variant="caption" color="textSecondary">
                Max 160 characters
              </Typography>
            </Grid>

            {/* Recipients (Comma-separated) */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="recipients"
                label="Recipients (comma-separated)"
                variant="outlined"
                value={formData.recipients}
                onChange={handleChange}
                placeholder="e.g. +919876543210, +911234567890"
                required
              />
            </Grid>

            {/* Scheduling */}
            <Grid item xs={12}>
              <Typography variant="h6">Schedule</Typography>
              <RadioGroup
                row
                name="schedule"
                value={schedule}
                onChange={handleScheduleChange}
              >
                <FormControlLabel
                  value="immediately"
                  control={<Radio />}
                  label="Send Immediately"
                />
              </RadioGroup>
            </Grid>

            {/* Action Buttons */}
            <Grid item xs={6}>
              <Button
                fullWidth
                variant="outlined"
                color="secondary"
                onClick={togglePanel}
              >
                Cancel
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default SMSForm;
