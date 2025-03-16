import React from "react";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

const AudienceForm = ({ togglePanel, selectedPlatform }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    togglePanel();
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-50">
      <div
        className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 
                   shadow-lg rounded-lg transition-transform duration-300 p-6 w-[50%] max-w-[600px] overflow-y-auto"
      >
        {/* Dynamic Heading Based on Selected Platform */}
        <h2 className="text-3xl font-semibold mb-6 text-center">
          {selectedPlatform} Ads Audience Info
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Audience Name & Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextField label="Audience Name" fullWidth required />
            <TextField label="Description" multiline rows={3} fullWidth required />
          </div>

          {/* Targeting Section */}
          <h2 className="text-2xl font-semibold mt-6">Targeting</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormControl fullWidth>
              <InputLabel>Age Range</InputLabel>
              <Select required>
                <MenuItem value="18-24">18-24</MenuItem>
                <MenuItem value="25-34">25-34</MenuItem>
                <MenuItem value="35-44">35-44</MenuItem>
                <MenuItem value="45-54">45-54</MenuItem>
                <MenuItem value="55-64">55-64</MenuItem>
                <MenuItem value="65+">65+</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Location</InputLabel>
              <Select required>
                <MenuItem value="North America">North America</MenuItem>
                <MenuItem value="Europe">Europe</MenuItem>
                <MenuItem value="Asia">Asia</MenuItem>
                <MenuItem value="Australia">Australia</MenuItem>
                <MenuItem value="Africa">Africa</MenuItem>
                <MenuItem value="South America">South America</MenuItem>
              </Select>
            </FormControl>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-6">
            <Button variant="outlined" color="secondary" onClick={togglePanel}>
              Back
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Create Audience
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AudienceForm;
