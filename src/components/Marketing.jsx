import React, { useState, useEffect } from "react";
import { IoIosMail } from "react-icons/io";
import { MdSms } from "react-icons/md";
import EmailForm from "./EmailForm";
import SMSForm from "./SMSForm";
import EmailAudience from "./EmailAudience";
// import SmsAudience from "./SmsAudience";
import EmailPost from "./EmailPost";
// import Smspost from "./Smspost";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, TextField, ButtonGroup } from "@mui/material";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Link } from "react-router-dom";


const Marketing = () => {
  const [activeForm, setActiveForm] = useState(null);
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [showTable, setShowTable] = useState("emailCampaigns"); // default to emailCampaigns
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false); // state to open/close the edit modal
  const [editingCampaign, setEditingCampaign] = useState(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:8080/api/campaigns/");
        const campaigns = res.data || [];


        // Filter campaigns based on the selected tab (campaignType)
        const filteredCampaigns = campaigns.filter(
          (campaign) =>
            campaign.campaignType ===
            (showTable === "emailCampaigns" ? "email" : "sms")
        );

        // Additional filter for email posts
        if (showTable === "emailPostTable") {
          setTableData(
            campaigns.filter((campaign) => campaign.campaignType === "email" && campaign.emailPost)
          );
        } else {
          setTableData(filteredCampaigns);
        }
      } catch (err) {
        console.error("Failed to fetch campaigns:", err);
        setTableData([]);
      }
      setLoading(false);
    };

    fetchCampaigns();
  }, [showTable]); // Re-fetch when showTable changes

  const handleFormClick = (formType, platform = "") => {
    setActiveForm(formType);
    setSelectedPlatform(platform);
  };

  const closePopup = () => {
    setActiveForm(null);
  };

  const sections = [
    {
      title: "Create Campaign",
      items: [
        { icon: IoIosMail, title: "Email Campaign", bg: "bg-blue-100 dark:bg-blue-900", text: "text-blue-600 dark:text-blue-400", desc: "Create and send email campaigns", formType: "email" },
        { icon: MdSms, title: "SMS Campaign", bg: "bg-green-100 dark:bg-green-900", text: "text-green-600 dark:text-green-400", desc: "Reach your customers via SMS", formType: "sms" },
      ]
    },
    {
      title: "Create Audience",
      items: [
        { icon: IoIosMail, title: "Email Audience", bg: "bg-blue-100 dark:bg-blue-900", text: "text-blue-600 dark:text-blue-400", desc: "Create and manage Email Ads", formType: "emailAudience", platform: "LinkedIn" },
        // { icon: MdSms, title: "SMS Audience", bg: "bg-blue-100 dark:bg-blue-900", text: "text-blue-600 dark:text-blue-400", desc: "Manage SMS advertising", formType: "smsAudience", platform: "Facebook" },
      ]
    },
    {
      title: "Promoted Posts",
      items: [
        { icon: IoIosMail, title: "Email Posts", bg: "bg-blue-100 dark:bg-blue-900", text: "text-blue-600 dark:text-blue-400", desc: "Boost your Email posts", formType: "emailpost" },
        // { icon: MdSms, title: "SMS Posts", bg: "bg-pink-100 dark:bg-pink-900", text: "text-pink-600 dark:text-pink-400", desc: "Promote your SMS content", formType: "smspost" }
      ]
    }
  ];

  const handleDeleteCampaign = async (campaignId) => {
    try {
      await axios.delete(`http://localhost:8080/api/campaigns/${campaignId}`);
      setTableData(tableData.filter((campaign) => campaign._id !== campaignId)); // Remove from table without re-fetching
    } catch (err) {
      console.error("Error deleting campaign:", err);
    }
  };

  const handleEditCampaign = (campaign) => {
    console.log("Editing Campaign: ", campaign); // Add this line to verify the data
    setEditingCampaign(campaign);
    setEditModalOpen(true);
  };



  const handleUpdateCampaign = async () => {
    try {
      const updatedData = {
        ...editingCampaign, // retain other fields
      };
      const res = await axios.put(`http://localhost:8080/api/campaigns/${editingCampaign._id}`, updatedData);
      setTableData(tableData.map((campaign) => (campaign._id === editingCampaign._id ? res.data : campaign))); // Update in state
      setEditModalOpen(false); // Close modal after update
    } catch (err) {
      console.error("Failed to update campaign:", err);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {sections.map((section, index) => (
        <section key={index} className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">{section.title}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
            {section.items.map((item, idx) => (
              <div
                key={idx}
                className="group relative overflow-hidden transition-all hover:shadow-lg bg-white dark:bg-gray-900 rounded-lg p-6 flex flex-col items-center text-center space-y-4 shadow-md cursor-pointer"
                onClick={() => handleFormClick(item.formType, item.platform)}
              >
                <div className={`p-3 ${item.bg} rounded-full transition-transform group-hover:scale-110`}>
                  <item.icon className={`text-2xl ${item.text}`} />
                </div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      ))}

      {activeForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-transparent">
          <div className="fixed inset-0 bg-black opacity-50" onClick={closePopup}></div>
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-1/2 max-w-md relative">
            <button
              onClick={closePopup}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
            {activeForm === "email" && <EmailForm togglePanel={closePopup} />}
            {activeForm === "sms" && <SMSForm togglePanel={closePopup} />}
            {activeForm === "emailAudience" && <EmailAudience togglePanel={closePopup} />}
            {/* {activeForm === "smsAudience" && <SmsAudience togglePanel={closePopup} />} */}
            {activeForm === "emailpost" && <EmailPost togglePanel={closePopup} />}
            {/* {activeForm === "smspost" && <Smspost togglePanel={closePopup} />} */}
          </div>
        </div>
      )}


      <div className="flex justify-center gap-4 p-2 ">
        <ButtonGroup variant="outlined" aria-label="Campaign button group">
          {[
            { label: "Email Campaigns", key: "emailCampaigns" },
            { label: "SMS Campaigns", key: "smsCampaigns" },
            { label: "Audience", key: "audienceTable" },
            // { label: "SMS Audience", key: "smsAudienceTable" },
            { label: "Email Posts", key: "emailPostTable" },
            // { label: "SMS Posts", key: "smsPostTable" },
          ].map((tab) => (
            <Button
              key={tab.key}
              onClick={() => setShowTable(tab.key)}
              className={`transition-all duration-300 ${showTable === tab.key
                ? "bg-blue-500 text-white shadow-lg"
                : "text-gray-700 dark:text-gray-300 hover:bg-blue-200 dark:hover:bg-blue-600"
                }`}
            >
              {tab.label}
            </Button>
          ))}
        </ButtonGroup>
      </div>

      <div className="w-full grid grid-cols-1 gap-4 transition-all duration-300 min-h-[100px]">
        {loading ? (
          <div className="flex justify-center items-center">
            <CircularProgress />
          </div>
        ) : showTable === "emailCampaigns" || showTable === "smsCampaigns" ? (
          tableData.length === 0 ? (
            <p className="text-center text-gray-500">No campaigns found.</p>
          ) : (
            <TableContainer component={Paper} className="shadow-lg">
              <Table aria-label="campaigns table">
                <TableHead>
                  <TableRow
                    sx={{
                      backgroundColor: (theme) =>
                        theme.palette.mode === "dark" ? "#2d2d2d" : "#e0e0e0",
                    }}
                  >
                    <TableCell
                      sx={{ fontWeight: "bold", fontSize: "1rem" }}
                      align="center"
                    >
                      Title
                    </TableCell>
                    {showTable !== "smsCampaigns" && <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}
                      align="center">Subject</TableCell>}
                    <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}
                      align="center">Recipients</TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}
                      align="center">Scheduled</TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}
                      align="center">Created At</TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}
                      align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tableData.map((campaign) => (
                    <TableRow key={campaign._id}>
                      <TableCell align="center">{campaign.title}</TableCell>
                      {showTable !== "smsCampaigns" && <TableCell align="center">{campaign.subject}</TableCell>}
                      <TableCell>
                        {campaign.recipients.map((recipient, index) => (
                          <div key={index}>{recipient}</div>
                        ))}
                      </TableCell>

                      <TableCell align="center">{campaign.schedule}</TableCell>
                      <TableCell>
                        {new Date(campaign.createdAt).toLocaleDateString('en-GB')}
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          onClick={() => handleEditCampaign(campaign)}
                          size="small">
                          <FaEdit size={20} />
                        </Button>
                        <Button
                          onClick={() => handleDeleteCampaign(campaign._id)}
                          size="small"
                        >
                          <RiDeleteBin6Line className="h-5 w-5 text-red-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )
        ) : showTable === "emailPostTable" && tableData.length > 0 ? (
          <TableContainer component={Paper} className="shadow-lg">
            <Table aria-label="email posts table">
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: (theme) =>
                      theme.palette.mode === "dark" ? "#2d2d2d" : "#e0e0e0",
                  }}
                >
                  <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}
                    align="center">Title</TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}
                    align="center">Caption</TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}
                    align="center">Link</TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}
                    align="center">Recipients</TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}
                    align="center">Scheduled</TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}
                    align="center">Created At</TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}
                    align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.map((campaign) => (
                  <TableRow key={campaign._id}>
                    <TableCell align="center">{campaign.title}</TableCell>
                    <TableCell align="center">{campaign.emailPost?.caption}</TableCell>
                    <TableCell align="center">
                      <Link to={campaign.emailPost?.link} target="_blank" rel="noopener noreferrer">
                        {campaign.emailPost?.link}
                      </Link>
                    </TableCell>
                    <TableCell align="center">
                      {campaign.recipients.map((recipient, index) => (
                        <div key={index}>{recipient}</div>
                      ))}
                    </TableCell>
                    <TableCell align="center">{campaign.schedule}</TableCell>
                    <TableCell>
                      {new Date(campaign.createdAt).toLocaleDateString('en-GB')}
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        onClick={() => handleEditCampaign(campaign)}
                        size="small">
                        <FaEdit size={20} />
                      </Button>
                      <Button
                        onClick={() => handleDeleteCampaign(campaign._id)}
                        size="small"
                      >
                        <RiDeleteBin6Line className="h-5 w-5 text-red-600" />
                      </Button>
                    </TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <p className="text-center text-gray-500">No data available.</p>
        )}
      </div>

      {editModalOpen && editingCampaign && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-transparent">
          {/* Background overlay */}
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={() => setEditModalOpen(false)}
          ></div>

          {/* Modal content */}
          <div className="bg-white dark:bg-gray-900 rounded-lg p-8 w-full max-w-md relative space-y-6">

            {/* Close button */}
            <button
              onClick={() => setEditModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
            >
              &times;
            </button>

            {/* Modal title */}
            <h2 className="text-2xl font-semibold text-center">Edit Campaign</h2>

            {/* Title field */}
            <TextField
              label="Title"
              variant="outlined"
              fullWidth
              value={editingCampaign.title}
              margin="dense"
              onChange={(e) => setEditingCampaign({ ...editingCampaign, title: e.target.value })}
              sx={{ marginBottom: 2 }}
            />

            {/* Subject field */}
            <TextField
              label="Subject"
              variant="outlined"
              fullWidth
              value={editingCampaign.subject}
              margin="dense"
              onChange={(e) => setEditingCampaign({ ...editingCampaign, subject: e.target.value })}
              className="mb-4"
            />

            {/* Save changes button */}
            <div className="flex justify-end mt-6">
              <Button
                onClick={handleUpdateCampaign}
                variant="contained"
                color="primary"
                className="px-6 py-2"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}



    </div>
  );
};

export default Marketing;
