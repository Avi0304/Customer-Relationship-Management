import React, { useState } from "react";
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

const LeadManagement = () => {
  const [leads, setLeads] = useState([
    {
      id: 1,
      name: "Rajesh Kumar",
      contactInfo: "rajesh.kumar@gmail.com",
      status: "New",
    },
    {
      id: 2,
      name: "Priya Sharma",
      contactInfo: "priya.sharma@gmail.com",
      status: "Contacted",
    },
    {
      id: 3,
      name: "Amit Verma",
      contactInfo: "amit.verma@gmail.com",
      status: "Converted",
    },
    {
      id: 4,
      name: "Neha Gupta",
      contactInfo: "neha.gupta@gmail.com",
      status: "New",
    },
    {
      id: 5,
      name: "Vikas Yadav",
      contactInfo: "vikas.yadav@gmail.com",
      status: "Contacted",
    },
    {
      id: 6,
      name: "Anjali Patel",
      contactInfo: "anjali.patel@gmail.com",
      status: "Converted",
    },
    {
      id: 7,
      name: "Rohan Singh",
      contactInfo: "rohan.singh@gmail.com",
      status: "New",
    },
    {
      id: 8,
      name: "Meera Nair",
      contactInfo: "meera.nair@gmail.com",
      status: "Contacted",
    },
    {
      id: 9,
      name: "Sandeep Joshi",
      contactInfo: "sandeep.joshi@gmail.com",
      status: "Converted",
    },
    {
      id: 10,
      name: "Kavita Reddy",
      contactInfo: "kavita.reddy@gmail.com",
      status: "New",
    },
  ]);
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newLead, setNewLead] = useState({
    name: "",
    contactInfo: "",
    status: "New",
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const filteredLeads = leads.filter(
    (lead) =>
      (lead.name.toLowerCase().includes(filter.toLowerCase()) ||
        lead.contactInfo.toLowerCase().includes(filter.toLowerCase())) &&
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
    setNewLead((prevState) => ({ ...prevState, [name]: value }));
  };

  // For Select (dropdown), extract name manually
  const handleStatusChange = (event) => {
    setNewLead((prevState) => ({ ...prevState, status: event.target.value }));
  };

  const handleAddNewLead = () => {
    if (!newLead.name || !newLead.contactInfo) {
      Swal.fire("Error", "Please fill in all fields", "error");
      setOpenAddDialog(false);
      return;
    }

    if (newLead.id) {
      setLeads((prevLeads) =>
        prevLeads.map((lead) =>
          lead.id === newLead.id ? { ...lead, ...newLead } : lead
        )
      );
      Swal.fire({
        title: "Update!",
        text: "Lead has been updated successfully.",
        icon: "success",
        timer: 4000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    } else {
      const newLeadData = { ...newLead, id: leads.length + 1 };
      setLeads((prevLeads) => [...prevLeads, newLeadData]);
      Swal.fire({
        title: "Added!",
        text: "New lead has been added successfully.",
        icon: "success",
        timer: 4000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }

    setOpenAddDialog(false);
    setNewLead({ name: "", contactInfo: "", status: "New" });
  };

  const handleEditLead = (lead) => {
    setNewLead(lead);
    setOpenAddDialog(true);
  };

  const handleDeleteLead = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setLeads((prevLeads) => prevLeads.filter((lead) => lead.id !== id));
        Swal.fire({
          title: "Deleted!",
          text: "The lead has been deleted.",
          icon: "success",
          timer: 4000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }
    });
  };

  const handleExportToExcel = () => {
    Swal.fire({
      title: "Export Leads?",
      text: "Do you want to export the leads to an Excel file?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Export!",
    }).then((result) => {
      if (result.isConfirmed) {
        const ws = XLSX.utils.json_to_sheet(leads);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Leads");
        XLSX.writeFile(wb, "leads.xlsx");

        Swal.fire({
          title: "Exported!",
          text: "Your leads have been exported.",
          icon: "success",
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }
    });
  };

  const handleOpenSnackbar = () => {
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
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
              <MenuItem value="New">New</MenuItem>
              <MenuItem value="Contacted">Contacted</MenuItem>
              <MenuItem value="Converted">Converted</MenuItem>
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
                Contact Info
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
              <TableRow key={lead.id}>
                <TableCell align="center">{lead.name}</TableCell>
                <TableCell align="center">{lead.contactInfo}</TableCell>
                <TableCell align="center">
                  {" "}
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                      lead.status === "Converted"
                        ? "bg-green-500 text-white"
                        : lead.status === "New"
                        ? "bg-blue-500 text-white"
                        : "bg-yellow-500 text-white"
                    }`}
                  >
                    {lead.status}
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
                    onClick={() => handleDeleteLead(lead.id)}
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
          <TextField
            label="Lead Name"
            variant="outlined"
            name="name"
            value={newLead.name}
            onChange={handleNewLeadChange}
            fullWidth
            style={{ marginBottom: "16px" }}
            margin="dense"
          />
          <TextField
            label="Contact Info"
            variant="outlined"
            name="contactInfo"
            value={newLead.contactInfo}
            onChange={handleNewLeadChange}
            fullWidth
            style={{ marginBottom: "16px" }}
          />

          {/* Status Dropdown with Full Width */}
          <FormControl
            fullWidth
            variant="outlined"
            style={{ marginBottom: "16px" }}
          >
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={newLead.status} // Default to "New"
              onChange={handleStatusChange}
              label="Status"
            >
              <MenuItem value="New">New</MenuItem>
              <MenuItem value="Contacted">Contacted</MenuItem>
              <MenuItem value="Converted">Converted</MenuItem>
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
            onClick={newLead.id ? handleAddNewLead : handleAddNewLead}
            color="primary"
            variant="contained"
          >
            {newLead.id ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for reminder */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message="Reminder: Follow up with leads!"
        action={
          <Button color="secondary" size="small" onClick={handleCloseSnackbar}>
            Close
          </Button>
        }
      />
    </div>
  );
};

export default LeadManagement;
