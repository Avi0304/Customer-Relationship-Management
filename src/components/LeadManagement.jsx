import React, { useEffect, useState } from "react";
import {
  Typography,
  TextField,
  Grid,
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Snackbar,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { Search, AddCircle, Edit, Delete } from "@mui/icons-material"; // Added icons
import { BiPlus } from "react-icons/bi";
import * as XLSX from "xlsx"; // For exporting to Excel
import Swal from "sweetalert2";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import axios from "axios";
import { NewLeadValidationSchema } from "../components/validation/AuthValidation";

const LeadManagement = () => {
  const [leads, setLeads] = useState([]);
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newLead, setNewLead] = useState({
    name: "",
    contactInfo: { email: "", phone: "" },
    status: "new",
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const currentTheme = localStorage.getItem('theme') || 'light'

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/leads/all");
      console.log(response.data);

      if (Array.isArray(response.data)) {
        setLeads(response.data);
      } else {
        setLeads([]);
      }
    } catch (error) {
      console.error("Error in fetching leads data: ", error);
      setLeads([]);
    }
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const filteredLeads = leads.filter(
    (lead) =>
      (lead.name.toLowerCase().includes(filter.toLowerCase()) ||
        lead.contactInfo.email.toLowerCase().includes(filter.toLowerCase()) ||
        lead.contactInfo.phone.includes(filter)) &&
      (statusFilter === "All Status" || lead.status === statusFilter)
  );

  const handleAddLeadClick = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const handleNewLeadChange = (event) => {
    const { name, value } = event.target;

    if (name === "email" || name === "phone") {
      setNewLead((prevState) => ({
        ...prevState,
        contactInfo: { ...prevState.contactInfo, [name]: value },
      }));
    } else {
      setNewLead((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  // For Select (dropdown), extract name manually
  const handleStatusChange = (event) => {
    setNewLead((prevState) => ({ ...prevState, status: event.target.value }));
  };

  const handleAddNewLead = async () => {
    try {
      // await NewLeadValidationSchema.validate(newLead, { abortEarly: false });

      if (newLead._id) {
        // Update existing lead using PUT request
        const response = await axios.put(
          `http://localhost:8080/api/leads/update/${newLead._id}`,
          newLead
        );

        console.log("Update Response Data:", response.data); // Debugging API response

        // Check if response data contains the updated lead
        if (response.data && response.data.lead) {
          setLeads((prevLeads) => {
            const lead = prevLeads.map((lead) =>
              lead._id === response.data.lead._id ? response.data.lead : lead
            );
            return [...lead];
            const updatedLeads = prevLeads.map((lead) =>
              lead._id === response.data.updatedLead._id
                ? response.data.updatedLead
                : lead
            );
            return [...updatedLeads];
          });

          Swal.fire({
            title: "Updated!",
            text: "Lead has been updated successfully.",
            icon: "success",
            iconColor: currentTheme === "dark" ? "#4ade80" : "green",
            background: currentTheme === "dark" ? "#1e293b" : "#fff",
            color: currentTheme === "dark" ? "#f8fafc" : "#000",
            timer: 4000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
        } else {
          console.error("Invalid response data:", response.data);
          Swal.fire({
            title: "Error!",
            text: "Failed to update...",
            icon: "error",
            iconColor: currentTheme === "dark" ? "#f87171" : "red",
            background: currentTheme === "dark" ? "#1e293b" : "#fff",
            color: currentTheme === "dark" ? "#f8fafc" : "#000",
          });
        }
      } else {
        // Add new lead using POST request
        if (
          !newLead.name.trim() ||
          !newLead.contactInfo.email.trim() ||
          !newLead.contactInfo.phone.trim()
        ) {
          Swal.fire("Error", "All fields are required!", "error");
          return;
        }

        const response = await axios.post(
          "http://localhost:8080/api/leads/add",
          newLead
        );

        console.log("Response Data:", response.data); // Debugging API response

        // Check if response data contains newLead
        if (response.data && response.data.newLead) {
          setLeads((prevLeads) => [...prevLeads, response.data.newLead]);

          Swal.fire({
            title: "Added!",
            text: "New lead has been added successfully.",
            icon: "success",
            iconColor: currentTheme === "dark" ? "#4ade80" : "green",
            background: currentTheme === "dark" ? "#1e293b" : "#fff",
            color: currentTheme === "dark" ? "#f8fafc" : "#000",
            timer: 4000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
        } else {
          console.error("Invalid response data:", response.data);
          Swal.fire("Error", "Failed to add lead. Please try again.", "error");
        }
      }

      setOpenAddDialog(false);

      // Reset newLead state
      setNewLead({
        name: "",
        contactInfo: { email: "", phone: "" },
        status: "new",
      });
    } catch (error) {
      console.error("Validation Error:", error);
      Swal.fire({
        title: "Error!",
        text: "Please check the entered details.",
        icon: "error",
        iconColor: currentTheme === "dark" ? "#f87171" : "red",
        background: currentTheme === "dark" ? "#1e293b" : "#fff",
        color: currentTheme === "dark" ? "#f8fafc" : "#000",
      });
    }
  };

  const handleEditLead = (lead) => {
    setNewLead(lead);
    setOpenAddDialog(true);
  };

  const handleDeleteLead = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      background: currentTheme === "dark" ? "#1e293b" : "#fff",
      color: currentTheme === "dark" ? "#f8fafc" : "#000",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:8080/api/leads/delete/${id}`);
          setLeads((prevLeads) => prevLeads.filter((lead) => lead._id !== id));

          Swal.fire({
            title: "Deleted!",
            text: "The lead has been deleted.",
            icon: "success",
            timer: 4000,
            iconColor: currentTheme === "dark" ? "#4ade80" : "green",
            background: currentTheme === "dark" ? "#1e293b" : "#fff",
            color: currentTheme === "dark" ? "#f8fafc" : "#000",
            timerProgressBar: true,
            showConfirmButton: false,
          });
        } catch (error) {
          console.error("Error deleting lead:", error);
          Swal.fire({
            title: "Error!",
            text: "Could not delete.",
            icon: "error",
            iconColor: currentTheme === "dark" ? "#f87171" : "red",
            background: currentTheme === "dark" ? "#1e293b" : "#fff",
            color: currentTheme === "dark" ? "#f8fafc" : "#000",
          });
        }
      }
    });
  };

  const handleExportToExcel = () => {
    Swal.fire({
      title: "Export Leads?",
      text: "Do you want to export the leads to an Excel file?",
      icon: "warning",
      background: currentTheme === "dark" ? "#1e293b" : "#fff",
      color: currentTheme === "dark" ? "#f8fafc" : "#000",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Export!",
    }).then((result) => {
      if (result.isConfirmed) {
        // Include contactInfo (email and phone) in the exported data
        const leadsWithContactInfo = leads.map(lead => ({
          ...lead,
          email: lead.contactInfo ? lead.contactInfo.email : '',
          phone: lead.contactInfo ? lead.contactInfo.phone : '',
        }));
  
        // Convert the leads data (with contact info) to a sheet
        const ws = XLSX.utils.json_to_sheet(leadsWithContactInfo);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Leads");
        
        // Export the Excel file
        XLSX.writeFile(wb, "leads.xlsx");
  
        // Show success message
        Swal.fire({
          title: "Exported!",
          text: "Your leads have been exported.",
          icon: "success",
          iconColor: currentTheme === "dark" ? "#4ade80" : "green",
          background: currentTheme === "dark" ? "#1e293b" : "#fff",
          color: currentTheme === "dark" ? "#f8fafc" : "#000",
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }
    });
  };
  

  return (
    <div className="mt-0">
      {/* Search and Filter Section */}
      <div className="mb-5 flex flex-wrap items-center gap-4">
        {/* Search Input */}
        <div className="w-full sm:w-1/2 md:w-1/3">
          <TextField
            label="Search Leads"
            variant="outlined"
            value={filter}
            onChange={handleFilterChange}
            fullWidth
            size="small"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              },
            }}
          />
        </div>

        {/* Status Dropdown */}
        <div className="w-full sm:w-1/3 md:w-1/4">
          <FormControl fullWidth variant="outlined" size="small">
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              label="Status"
            >
              <MenuItem value="All Status">All Status</MenuItem>
              <MenuItem value="new">New</MenuItem>
              <MenuItem value="contacted">Contacted</MenuItem>
              <MenuItem value="converted">Converted</MenuItem>
            </Select>
          </FormControl>
        </div>

        {/* Buttons */}
        <div className="w-full sm:w-auto flex items-center gap-3 justify-end flex-1 mt-0 pt-0">
          <Button
            variant="contained"
            color="primary"
            startIcon={<BiPlus size={20} />}
            onClick={handleAddLeadClick}
          >
            Add Lead
          </Button>

          <Button
            variant="contained"
            color="secondary"
            startIcon={<Search />}
            onClick={handleExportToExcel}
          >
            Export to Excel
          </Button>
        </div>
      </div>

      {/* Lead Table */}
      <TableContainer component={Paper}>
        <Table>
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
                Name
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", fontSize: "1rem" }}
                align="center"
              >
                Email
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", fontSize: "1rem" }}
                align="center"
              >
                Phone
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", fontSize: "1rem" }}
                align="center"
              >
                Status
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", fontSize: "1rem" }}
                align="center"
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLeads.map((lead) => (
              <TableRow key={lead._id}>
                <TableCell align="center">{lead.name}</TableCell>
                <TableCell align="center">
                  {lead?.contactInfo?.email ?? "N/A"}
                </TableCell>
                <TableCell align="center">
                  {lead?.contactInfo?.phone ?? "N/A"}
                </TableCell>

                <TableCell align="center">
                  {" "}
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium capitalized ${lead.status === "converted"
                      ? "bg-green-500 text-white"
                      : lead.status === "new"
                        ? "bg-blue-500 text-white"
                        : "bg-yellow-500 text-white"
                      }`}
                  >
                    {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                  </span>
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  {/* Edit and Delete Buttons with Icons */}

                  <Button
                    size="small"
                    onClick={() => handleEditLead(lead)}
                    style={{ marginRight: "5px" }}
                  >
                    <FaEdit size={20} />
                  </Button>
                  <Button
                    size="small"
                    onClick={() => handleDeleteLead(lead._id)}
                  >
                    <RiDeleteBin6Line className="h-5 w-5 text-red-600" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Lead Dialog */}
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
        <DialogTitle>{newLead.id ? "Edit Lead" : "Add New Lead"}</DialogTitle>
        <DialogContent>
          {/* Lead Name Input */}
          <TextField
            label="Lead Name"
            variant="outlined"
            name="name"
            value={newLead.name}
            onChange={handleNewLeadChange}
            fullWidth
            margin="dense"
            style={{ marginBottom: "16px" }}
          />

          {/* Email Input */}
          <TextField
            label="Email"
            variant="outlined"
            name="email"
            value={newLead.contactInfo.email || ""}
            onChange={(e) =>
              setNewLead((prevLead) => ({
                ...prevLead,
                contactInfo: { ...prevLead.contactInfo, email: e.target.value },
              }))
            }
            fullWidth
            margin="dense"
            style={{ marginBottom: "16px" }}
          />

          {/* Phone Input */}
          <TextField
            label="Phone"
            variant="outlined"
            name="phone"
            value={newLead.contactInfo.phone || ""}
            onChange={(e) =>
              setNewLead((prevLead) => ({
                ...prevLead,
                contactInfo: { ...prevLead.contactInfo, phone: e.target.value },
              }))
            }
            fullWidth
            margin="dense"
            style={{ marginBottom: "16px" }}
          />

          {/* Status Dropdown */}
          <FormControl
            fullWidth
            variant="outlined"
            style={{ marginBottom: "16px" }}
          >
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={newLead.status}
              onChange={handleStatusChange}
              label="Status"
            >
              <MenuItem value="new">New</MenuItem>
              <MenuItem value="contacted">Contacted</MenuItem>
              <MenuItem value="converted">Converted</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>

        <DialogActions sx={{ m: 1 }}>
          <Button
            onClick={handleCloseAddDialog}
            sx={{ color: "gray", "&:hover": { color: "darkgray" } }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddNewLead}
            color="primary"
            variant="contained"
          >
            {newLead._id ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default LeadManagement;
