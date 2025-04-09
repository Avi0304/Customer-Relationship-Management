import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Box,
  Typography,
  Paper,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import axios from "axios";

const EmailPost = ({ togglePanel }) => {
  const [mediaUrl, setMediaUrl] = useState("");

  // Prevent background scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    const promotedPostData = {
      campaignType: "email",
      title: formData.get("subject"),
      emailPost: {
        caption: formData.get("caption"),
        callToAction: formData.get("callToAction"),
        link: formData.get("link"),
        mediaUrl: mediaUrl,
        subject: formData.get("subject"),
        body: formData.get("body"),
      },
      recipients: formData
        .get("recipients")
        ?.split(",")
        .map((email) => email.trim()) || [],
      schedule: "immediately",
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/api/campaign/add",
        promotedPostData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Post promoted successfully:", response.data);
      togglePanel();
    } catch (error) {
      console.error("Error promoting post:", error.response?.data || error);
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
        overflow: "hidden",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "90%",
          maxWidth: 600,
          maxHeight: "90vh",
          padding: 4,
          borderRadius: 2,
          backgroundColor: "background.paper",
          overflowY: "auto",
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Promote a Post
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} mt={2}>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Call-to-Action</InputLabel>
                <Select name="callToAction" defaultValue="">
                  <MenuItem value="Shop Now">Shop Now</MenuItem>
                  <MenuItem value="Learn More">Learn More</MenuItem>
                  <MenuItem value="Sign Up">Sign Up</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Caption"
                name="caption"
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Media URL (image/video)"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                fullWidth
                variant="outlined"
                required
              />
              {mediaUrl && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "120px",
                    height: "80px",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                    overflow: "hidden",
                    mt: 2,
                  }}
                >
                  <img
                    src={mediaUrl}
                    alt="Preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </Box>
              )}
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Subject"
                name="subject"
                fullWidth
                variant="outlined"
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Body"
                name="body"
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Recipients (comma-separated emails)"
                name="recipients"
                fullWidth
                variant="outlined"
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Redirect Link"
                name="link"
                type="url"
                fullWidth
                variant="outlined"
                required
              />
            </Grid>

            <Grid item xs={12} sx={{ display: "flex", justifyContent: "space-between" }}>
              <Button variant="outlined" color="secondary" onClick={togglePanel}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Promote Post
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default EmailPost;
