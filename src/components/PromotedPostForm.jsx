import React, { useState } from "react";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

const PromotedPostForm = ({ togglePanel }) => {
  const [formData, setFormData] = useState({
    campaignName: "",
    brandName: "",
    platforms: [],
    audienceType: "",
    ageRange: "",
    gender: "",
    location: "",
    interests: "",
    adHeadline: "",
    primaryText: "",
    cta: "",
    media: null,
    landingPage: "",
    kpi: [],
    budget: "",
    startDate: "",
    endDate: "",
    submittedBy: "",
  });

  const handleChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const handleFileChange = (event) => {
    setFormData({ ...formData, media: event.target.files[0] });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Form Submitted:", formData);
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-50">
      <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 shadow-2xl rounded-lg w-[50%] max-w-[700px] p-8 overflow-y-auto h-[80vh]">
        <h2 className="text-2xl font-bold mb-6 border-b pb-3 text-center">
          🚀 Promoted Post Form
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campaign & Brand Name */}
          <div className="grid grid-cols-2 gap-4">
            <TextField
              label="Campaign Name"
              fullWidth
              value={formData.campaignName}
              onChange={handleChange("campaignName")}
            />
            <TextField
              label="Brand Name"
              fullWidth
              value={formData.brandName}
              onChange={handleChange("brandName")}
            />
          </div>

          {/* Platforms Selection */}
          <FormControl fullWidth>
            <InputLabel>Platforms</InputLabel>
            <Select
              multiple
              value={formData.platforms}
              onChange={handleChange("platforms")}
            >
              {[
                "Facebook",
                "Instagram",
                "LinkedIn",
                "Twitter",
                "TikTok",
                "Other",
              ].map((p) => (
                <MenuItem key={p} value={p}>
                  {p}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Audience Type & Age Range */}
          <div className="grid grid-cols-2 gap-4 mt-3">
            <FormControl fullWidth>
              <InputLabel>Audience Type</InputLabel>
              <Select
                value={formData.audienceType}
                onChange={handleChange("audienceType")}
              >
                {[
                  "New Customers",
                  "Existing Customers",
                  "Lookalike Audience",
                  "Custom Audience",
                ].map((a) => (
                  <MenuItem key={a} value={a}>
                    {a}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Age Range"
              fullWidth
              value={formData.ageRange}
              onChange={handleChange("ageRange")}
            />
          </div>

          {/* Gender & Location */}
          <div className="grid grid-cols-2 gap-4">
            <FormControl fullWidth>
              <InputLabel>Gender</InputLabel>
              <Select value={formData.gender} onChange={handleChange("gender")}>
                {["Male", "Female", "All"].map((g) => (
                  <MenuItem key={g} value={g}>
                    {g}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Location(s)"
              fullWidth
              value={formData.location}
              onChange={handleChange("location")}
            />
          </div>

          {/* Ad Headline & Primary Text */}
          <div className="grid grid-cols-2 gap-4">
            <TextField
              label="Ad Headline"
              fullWidth
              value={formData.adHeadline}
              onChange={handleChange("adHeadline")}
            />
            <TextField
              label="Primary Text"
              multiline
              rows={3}
              fullWidth
              value={formData.primaryText}
              onChange={handleChange("primaryText")}
            />
          </div>

          {/* Call-to-Action (CTA) */}
          <FormControl fullWidth>
            <InputLabel>Call-to-Action (CTA)</InputLabel>
            <Select value={formData.cta} onChange={handleChange("cta")}>
              {["Learn More", "Sign Up", "Buy Now", "Book a Demo", "Other"].map(
                (c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                )
              )}
            </Select>
          </FormControl>

          {/* Media Upload & Landing Page */}
          <div className="grid grid-cols-2 gap-4 mt-3">
            <Button variant="contained" component="label">
              Upload Media
              <input type="file" hidden onChange={handleFileChange} />
            </Button>
            <TextField
              label="Landing Page URL"
              fullWidth
              value={formData.landingPage}
              onChange={handleChange("landingPage")}
            />
          </div>

          {/* Expected KPI */}
          <FormControl fullWidth>
            <InputLabel>Expected KPI</InputLabel>
            <Select
              multiple
              value={formData.kpi}
              onChange={handleChange("kpi")}
            >
              {[
                "Clicks",
                "Conversions",
                "Impressions",
                "Engagement",
                "Leads",
              ].map((k) => (
                <MenuItem key={k} value={k}>
                  {k}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Budget, Start & End Date, Submitted By */}
          <div className="grid grid-cols-2 gap-4 mt-3">
            <TextField
              label="Budget"
              fullWidth
              value={formData.budget}
              onChange={handleChange("budget")}
            />
            <TextField
              label="Start Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={formData.startDate}
              onChange={handleChange("startDate")}
            />
            <TextField
              label="End Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={formData.endDate}
              onChange={handleChange("endDate")}
            />
            <TextField
              label="Submitted By"
              fullWidth
              value={formData.submittedBy}
              onChange={handleChange("submittedBy")}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 gap-2 mt-6">
            <Button variant="outlined" color="secondary" onClick={togglePanel}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              onClick={togglePanel}
              color="primary"
            >
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PromotedPostForm;
