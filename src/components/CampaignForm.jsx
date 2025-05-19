import React, { useState } from "react";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { FaEnvelope, FaSms, FaPhone } from "react-icons/fa";

const CampaignForm = ({
  campaignType = "email",
  handleChannelChange,
  togglePanel,
}) => {
  const [audience, setAudience] = useState("");
  const [sendToSelected, setSendToSelected] = useState(false);
  const [campaignName, setCampaignName] = useState("");
  const [sender, setSender] = useState("");
  const [message, setMessage] = useState("");

  // Map campaign types to corresponding labels and icons
  const campaignDetails = {
    email: {
      title: "Email Campaign",
      placeholder: "Sender Email",
      icon: <FaEnvelope />,
    },
    sms: {
      title: "SMS Campaign",
      placeholder: "Sender Number",
      icon: <FaSms />,
    },
    voice: {
      title: "Voice Campaign",
      placeholder: "Caller ID",
      icon: <FaPhone />,
    },
  };

  const { title, placeholder, icon } =
    campaignDetails[campaignType] || campaignDetails.email;

  const handleSubmit = async () => {
    try {
    } catch (error) {
      console.error(
        "❌ Failed to send campaign:",
        error.response?.data || error.message
      );
      alert(
        `Error: ${error.response?.data?.message || "Something went wrong."}`
      );
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-50">
      <div
        className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 
                   shadow-lg rounded-lg transition-transform duration-300 p-6 w-[50%] max-w-[600px] h-[80vh] overflow-y-auto"
      >
        <h2 className="text-2xl mb-4 flex items-center gap-2">
          {icon} {title}
        </h2>

        <form>
          <div className="grid grid-cols-1 gap-4 mb-4">
            <TextField label="Campaign Name" fullWidth />
            <TextField
              label={placeholder}
              fullWidth
              InputProps={{ startAdornment: icon }}
            />
            <TextField
              label={campaignType === "voice" ? "Voice Message" : "Message"}
              multiline
              rows={4}
              fullWidth
            />
          </div>

          <h2 className="text-2xl mb-4">Audience</h2>
          <FormControl fullWidth>
            <InputLabel>Target Audience</InputLabel>
            <Select
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
            >
              <MenuItem value="All customers">All Customers</MenuItem>
              <MenuItem value="Professionals">Professionals</MenuItem>
              <MenuItem value="College Students">College Students</MenuItem>
              <MenuItem value="Family">Family</MenuItem>
            </Select>
          </FormControl>

          {/* Checkbox for sending to selected customers */}
          <FormControlLabel
            control={
              <Checkbox
                checked={sendToSelected}
                onChange={(e) => setSendToSelected(e.target.checked)}
              />
            }
            label="Send only to selected customers"
          />

          <div className="flex justify-end gap-4 mt-6">
            <Button variant="outlined" color="primary" onClick={togglePanel}>
              Back
            </Button>
            <Button variant="contained" color="primary" onClick={togglePanel}>
              {campaignType === "voice" ? "Send Voice Message" : "Send"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CampaignForm;
