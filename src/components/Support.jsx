import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  IconButton,
  Snackbar,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { BiPlus, BiSupport } from "react-icons/bi";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import Swal from "sweetalert2";

const dummyRequests = [
  {
    id: 1,
    subject: "Login Issue",
    description: "Unable to log in",
    status: "Open",
    createdAt: "2025-03-28T09:15:00Z",
  },
  {
    id: 2,
    subject: "Bug Report",
    description: "App crashes on load",
    status: "In Progress",
    createdAt: "2025-03-29T11:30:00Z",
  },
  {
    id: 3,
    subject: "Feature Request",
    description: "Add dark mode",
    status: "Closed",
    createdAt: "2025-03-30T14:05:00Z",
  },
  {
    id: 4,
    subject: "Payment Failure",
    description: "Transaction failed during checkout",
    status: "Open",
    createdAt: "2025-03-31T08:45:00Z",
  },
  {
    id: 5,
    subject: "Slow Performance",
    description: "Dashboard takes too long to load",
    status: "In Progress",
    createdAt: "2025-04-01T10:20:00Z",
  },
  {
    id: 6,
    subject: "Email Not Received",
    description: "Verification email not arriving",
    status: "Open",
    createdAt: "2025-04-01T17:40:00Z",
  },
  {
    id: 7,
    subject: "Data Sync Problem",
    description: "Leads are not syncing from the CRM",
    status: "Closed",
    createdAt: "2025-04-02T13:10:00Z",
  },
  {
    id: 8,
    subject: "Broken Link",
    description: "Support link on the homepage leads to 404",
    status: "Open",
    createdAt: "2025-04-03T15:55:00Z",
  },
  {
    id: 9,
    subject: "Mobile App Crash",
    description: "iOS app crashes after login",
    status: "In Progress",
    createdAt: "2025-04-04T10:00:00Z",
  },
  {
    id: 10,
    subject: "Report Generation Error",
    description: "Sales report PDF is not generating correctly",
    status: "Closed",
    createdAt: "2025-04-04T18:25:00Z",
  },
];

const Support = () => {
  const [requests, setRequests] = useState(dummyRequests);
  const [filteredRequests, setFilteredRequests] = useState(dummyRequests);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("Newest");

  useEffect(() => {
    filterRequests();
  }, [requests, searchQuery, statusFilter, sortOrder]);

  const filterRequests = () => {
    let updated = [...requests];

    // Filter by status
    if (statusFilter !== "All") {
      updated = updated.filter((req) => req.status === statusFilter);
    }

    // Search by subject
    if (searchQuery) {
      updated = updated.filter((req) =>
        req.subject.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    updated.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === "Newest" ? dateB - dateA : dateA - dateB;
    });

    setFilteredRequests(updated);
  };

  const showSnackbar = (message) => setSnackbar({ open: true, message });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentRequest((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!currentRequest.subject || !currentRequest.description) {
      await Swal.fire("Error", "All fields are required!", "error");
      return;
    }

    setOpenDialog(false);

    const { isConfirmed } = await Swal.fire({
      title: currentRequest.id ? "Confirm Edit" : "Confirm Creation",
      text: currentRequest.id ? "Update this request?" : "Create new request?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });

    if (isConfirmed) {
      if (currentRequest.id) {
        setRequests((prev) =>
          prev.map((req) =>
            req.id === currentRequest.id ? { ...currentRequest } : req
          )
        );
        await Swal.fire("Success", "Request Updated!", "success");
      } else {
        const newRequest = {
          ...currentRequest,
          id: requests.length + 1,
          createdAt: new Date().toISOString(),
        };
        setRequests([...requests, newRequest]);
        await Swal.fire("Success", "Request Created!", "success");
      }

      setCurrentRequest(null);
    }
  };

  const handleDelete = async (id) => {
    const { isConfirmed } = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the request!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No",
    });

    if (isConfirmed) {
      setRequests(requests.filter((req) => req.id !== id));
      await Swal.fire("Deleted!", "Request has been removed.", "success");
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 1800,
        mx: "auto",
        p: 3,
        bgcolor: "background.paper",
        borderRadius: 3,
        boxShadow: 4,
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          display="flex"
          alignItems="center"
          gap={1}
        >
          <span
            style={{ display: "flex", alignItems: "center", color: "#1976d2" }}
          >
            <BiSupport size={26} />
          </span>
          Support Requests
        </Typography>

        <Box display="flex" gap={2}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="🔍 Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<BiPlus />}
            onClick={() => {
              setCurrentRequest({
                subject: "",
                description: "",
                status: "Open",
              });
              setOpenDialog(true);
            }}
          >
            New Request
          </Button>
        </Box>
      </Box>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        {/* Status Filter */}
        <Box display="flex" gap={1} flexWrap="wrap">
          {["All", "Open", "In Progress", "Closed"].map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? "contained" : "outlined"}
              color={statusFilter === status ? "primary" : "inherit"}
              onClick={() => setStatusFilter(status)}
              size="small"
              sx={{
                textTransform: "none",
                borderRadius: 2,
                boxShadow: statusFilter === status ? 1 : 0,
                fontWeight: statusFilter === status ? "bold" : "normal",
                transition: "0.2s",
                "&:hover": {
                  backgroundColor:
                    statusFilter === status ? "primary.dark" : "grey.100",
                },
              }}
            >
              {status}
            </Button>
          ))}
        </Box>

        {/* Sort Dropdown */}
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <Select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            displayEmpty
            sx={{
              borderRadius: 2,
              fontWeight: "bold",
              boxShadow: 1,
              "& .MuiSelect-select": {
                padding: "6px 12px",
              },
            }}
          >
            <MenuItem value="Newest">Newest First</MenuItem>
            <MenuItem value="Oldest">Oldest First</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        {filteredRequests.map((req) => (
          <Grid item xs={12} sm={6} md={3} key={req.id}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: 3,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                p: 2,
              }}
            >
              {/* Subject */}
              <Typography variant="h6" fontWeight="bold" gutterBottom noWrap>
                {req.subject}
              </Typography>

              {/* Description */}
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  flexGrow: 1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  mb: 2,
                }}
              >
                {req.description}
              </Typography>

              {/* Status + Buttons Row */}
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                {/* Status Badge */}
                <Box
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 2,
                    bgcolor:
                      req.status === "Open"
                        ? "success.main"
                        : req.status === "In Progress"
                        ? "warning.main"
                        : "text.disabled",
                    color: "white",
                    fontSize: "0.75rem",
                    fontWeight: "500",
                    minWidth: "70px",
                    textAlign: "center",
                  }}
                >
                  {req.status}
                </Box>

                {/* Edit / Delete */}
                <Box display="flex" gap={1}>
                  <IconButton
                    onClick={() => {
                      setCurrentRequest(req);
                      setOpenDialog(true);
                    }}
                    color="primary"
                    size="small"
                    sx={{ p: 0.5 }}
                  >
                    <FaEdit size={16} />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(req.id)}
                    color="error"
                    size="small"
                    sx={{ p: 0.5 }}
                  >
                    <RiDeleteBin6Line size={16} />
                  </IconButton>
                </Box>
              </Box>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 1 }}
              >
                {new Date(req.createdAt).toLocaleString()}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Dialog for Adding/Editing */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {currentRequest?.id ? "Edit Request" : "New Support Request"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Subject"
            name="subject"
            value={currentRequest?.subject || ""}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Description"
            name="description"
            value={currentRequest?.description || ""}
            onChange={handleChange}
            fullWidth
            margin="dense"
            multiline
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select
              label="Status"
              name="status"
              value={currentRequest?.status || "Open"}
              onChange={handleChange}
            >
              <MenuItem value="Open">Open</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Closed">Closed</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSave} color="primary" variant="contained">
            {currentRequest?.id ? "Save" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </Box>
  );
};

export default Support;
