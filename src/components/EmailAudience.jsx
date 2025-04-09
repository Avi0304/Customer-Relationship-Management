import React, { useState } from "react";
import axios from "axios";
import {
  Button, TextField, Select, MenuItem, FormControl, InputLabel,
  Box, Typography, Paper, Grid, Chip, Stack,
} from "@mui/material";

const EmailAudience = ({ togglePanel, selectedPlatform }) => {
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [targetingOptions, setTargetingOptions] = useState({
    audienceName: "",
    audienceDescription: "",  // Fixed mismatch
    ageRange: "",
    location: "",
    gender: "",
    emailSubject: "",  // Fixed mismatch
    emailBody: "",  // Fixed mismatch
  });
  const [error, setError] = useState(null);

  const interestOptions = ["Technology", "Business", "Marketing", "Startups", "Innovation"];

  const handleInterestToggle = (interest) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((item) => item !== interest) : [...prev, interest]
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTargetingOptions((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    const audienceData = {
      ...targetingOptions,
      interests: selectedInterests,
      platform: selectedPlatform,
    };

    try {
      await axios.post("http://localhost:8080/api/audiences", audienceData, {
        headers: { "Content-Type": "application/json" },
      });
      togglePanel();
    } catch (error) {
      setError(error.response?.data?.error || "Failed to create audience.");
    }
  };

  return (
    <Box sx={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
      display: "flex", justifyContent: "center", alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 1300, overflow: "auto", p: 2 }}>
      <Paper elevation={3} sx={{ width: "100%", maxWidth: 700, p: 4, borderRadius: 2 }}>
        <Typography variant="h4" align="center" gutterBottom>
          {selectedPlatform} Audience Targeting
        </Typography>

        {error && <Typography color="error" align="center" sx={{ mb: 2 }}>{error}</Typography>}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField name="audienceName" label="Audience Name" fullWidth required
                variant="outlined" value={targetingOptions.audienceName} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField name="audienceDescription" label="Description" fullWidth required
                multiline rows={2} variant="outlined"
                value={targetingOptions.audienceDescription} onChange={handleChange} />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth variant="outlined" required>
                <InputLabel>Age Range</InputLabel>
                <Select name="ageRange" value={targetingOptions.ageRange} onChange={handleChange} label="Age Range">
                  {["18-25", "26-35", "36-50", "50+"].map((age) => (  // Fixed values to match backend
                    <MenuItem key={age} value={age}>{age}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth variant="outlined" required>
                <InputLabel>Location</InputLabel>
                <Select name="location" value={targetingOptions.location} onChange={handleChange} label="Location">
                  {["India", "USA", "Canada", "UK", "Europe", "Asia"].map((loc) => (
                    <MenuItem key={loc} value={loc}>{loc}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth variant="outlined" required>
                <InputLabel>Gender</InputLabel>
                <Select name="gender" value={targetingOptions.gender} onChange={handleChange} label="Gender">
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Select Interests</Typography>
              <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
                {interestOptions.map((interest) => (
                  <Chip key={interest} label={interest} onClick={() => handleInterestToggle(interest)}
                    color={selectedInterests.includes(interest) ? "primary" : "default"} />
                ))}
              </Stack>
            </Grid>

            <Grid item xs={12}>
              <TextField name="emailSubject" label="Email Subject" fullWidth required
                variant="outlined" value={targetingOptions.emailSubject} onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField name="emailBody" label="Email Body" fullWidth required
                multiline rows={4} variant="outlined"
                value={targetingOptions.emailBody} onChange={handleChange} />
            </Grid>

            <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
              <Button variant="outlined" color="secondary" onClick={togglePanel}>Cancel</Button>
              <Button type="submit" variant="contained" color="primary">Create Audience</Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default EmailAudience;
