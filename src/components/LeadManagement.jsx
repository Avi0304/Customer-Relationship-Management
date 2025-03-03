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

const LeadManagement = () => {
  const [leads, setLeads] = useState([
    {
      id: 1,
      name: "John Doe",
      contactInfo: "john.doe@example.com",
      status: "New",
    },
    {
      id: 2,
      name: "Jane Smith",
      contactInfo: "jane.smith@example.com",
      status: "Contacted",
    },
    {
      id: 3,
      name: "Robert Brown",
      contactInfo: "robert.brown@example.com",
      status: "Converted",
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
    if (newLead.id) {
      // Update existing lead
      setLeads((prevLeads) =>
        prevLeads.map((lead) =>
          lead.id === newLead.id ? { ...lead, ...newLead } : lead
        )
      );
    } else {
      // Add new lead
      const newLeadData = { ...newLead, id: leads.length + 1 };
      setLeads((prevLeads) => [...prevLeads, newLeadData]);
    }
  
    setOpenAddDialog(false);
    setNewLead({ name: "", contactInfo: "", status: "New" });
  };
  

  const handleEditLead = (lead) => {
    setNewLead(lead); 
    setOpenAddDialog(true);
  };
  

  const handleDeleteLead = (id) => {
    setLeads((prevLeads) => prevLeads.filter((lead) => lead.id !== id));
  };

  const handleExportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(leads);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Leads");
    XLSX.writeFile(wb, "leads.xlsx");
  };

  const handleOpenSnackbar = () => {
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div className="mt-2">
      {/* Search and Filter Section */}
      <Grid
        container
        spacing={3}
        justifyContent="flex-start"
        style={{ marginBottom: "20px" }}
      >
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Search Leads"
            variant="outlined"
            value={filter}
            onChange={handleFilterChange}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth variant="outlined">
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
        </Grid>
      </Grid>

      {/* Add Lead and Export to Excel Buttons */}
      <Box textAlign="right" style={{ marginBottom: "20px" }}>
        <Button
          variant="contained"
          color="primary"
          className="flex items-center gap-2  px-4 py-2 rounded-md"
          onClick={handleAddLeadClick}
        >
          <BiPlus size={20} /> Add Lead
        </Button>

        <Button
          variant="contained"
          color="secondary"
          startIcon={<Search />}
          onClick={handleExportToExcel}
          style={{
            borderRadius: "5px",
            fontWeight: "bold",
            marginLeft: "10px",
          }}
        >
          Export to Excel
        </Button>
      </Box>

      {/* Lead Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Contact Info</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold", textAlign: "end", pr: 11 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLeads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell>{lead.name}</TableCell>
                <TableCell>{lead.contactInfo}</TableCell>
                <TableCell>{lead.status}</TableCell>
                <TableCell sx={{ textAlign: "end" }}>
                  {/* Edit and Delete Buttons with Icons */}
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    startIcon={<Edit />}
                    onClick={() => handleEditLead(lead)}
                    style={{ marginRight: "5px" }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    size="small"
                    startIcon={<Delete />}
                    onClick={() => handleDeleteLead(lead.id)}
                  >
                    Delete
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
        <DialogActions>
          <Button onClick={handleCloseAddDialog} sx={{color: 'gray'}}>
            Cancel
          </Button>
          <Button
            onClick={newLead.id ? handleAddNewLead : handleAddNewLead}
            color="primary"
          >
            {newLead.id ? "Save Changes" : "Add Lead"}
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