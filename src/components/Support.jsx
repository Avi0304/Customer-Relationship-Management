import React, { useState, useEffect } from "react";
import axios from "axios";
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

const Support = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("Newest");

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [requests, searchQuery, statusFilter, sortOrder]);

  const fetchRequests = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/support/all");
      setRequests(res.data.data);
    } catch (error) {
      console.error("Error fetching support requests:", error);
      Swal.fire("Error", "Failed to fetch requests", "error");
      setRequests([]);
    }
  };

  const filterRequests = () => {
    let updated = [...requests];

    if (statusFilter !== "All") {
      updated = updated.filter((req) => req.status === statusFilter);
    }

    if (searchQuery) {
      updated = updated.filter((req) =>
        req.subject.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    updated.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === "Newest" ? dateB - dateA : dateA - dateB;
    });

    setFilteredRequests(updated);
  };

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
      title: currentRequest._id ? "Confirm Edit" : "Confirm Creation",
      text: currentRequest._id ? "Update this request?" : "Create new request?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });

    if (!isConfirmed) return;

    try {
      if (currentRequest._id) {
        await axios.put(
          `http://localhost:8080/api/support/update/${currentRequest._id}`,
          currentRequest
        );
        Swal.fire("Success", "Request updated successfully!", "success");
      } else {
        await axios.post(
          "http://localhost:8080/api/support/add",
          currentRequest
        );
        Swal.fire("Success", "Request created successfully!", "success");
      }

      setOpenDialog(false);
      setCurrentRequest(null);
      await fetchRequests();
    } catch (error) {
      console.error("Error saving request:", error);
      Swal.fire("Success", "Failed to save request", "success");
      setOpenDialog(false);
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
      try {
        await axios.delete(`http://localhost:8080/api/support/delete/${id}`);
        Swal.fire("Deleted!", "Your request has been deleted.", "success");
        setCurrentRequest(null);
        setOpenDialog(false);
        fetchRequests();
      } catch (error) {
        console.error("Error deleting request:", error);
        Swal.fire("Error", "Failed to delete request", "error");
        setCurrentRequest(null);
        setOpenDialog(false);
      }
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
          <span style={{ color: "#1976d2" }}>
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
        {filteredRequests.map((req, index) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={3}
            key={req._id || `${req.subject}-${index}`}
          >
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
              <Typography variant="h6" fontWeight="bold" gutterBottom noWrap>
                {req.subject}
              </Typography>

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

              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
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
                    onClick={() => handleDelete(req._id)}
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

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {currentRequest?._id ? "Edit Request" : "New Support Request"}
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
            {currentRequest?._id ? "Save" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Support;
