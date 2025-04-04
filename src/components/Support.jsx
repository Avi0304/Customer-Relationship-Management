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
} from "@mui/material";
import { BiPlus } from "react-icons/bi";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Line, RiSearchLine } from "react-icons/ri";
import Swal from "sweetalert2";

const dummyRequests = [
  {
    id: 1,
    subject: "Login Issue",
    description: "Unable to log in",
    status: "Open",
  },
  {
    id: 2,
    subject: "Bug Report",
    description: "App crashes on load",
    status: "In Progress",
  },
  {
    id: 3,
    subject: "Feature Request",
    description: "Add dark mode",
    status: "Closed",
  },
];

const Support = () => {
  const [requests, setRequests] = useState(dummyRequests);
  const [filteredRequests, setFilteredRequests] = useState(dummyRequests);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    filterRequests();
  }, [requests, searchQuery]);

  const filterRequests = () => {
    let updatedRequests = requests.filter((req) =>
      req.subject.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredRequests(updatedRequests);
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
        const newRequest = { ...currentRequest, id: requests.length + 1 };
        setRequests([...requests, newRequest]);
        await Swal.fire("Success", "Request Created!", "success");
      }

      setCurrentRequest(null);
      setOpenDialog(false);
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
        maxWidth: 900,
        mx: "auto",
        mt: 4,
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
        <Typography variant="h5" fontWeight="bold">
          📞 Support Requests
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

      <Grid container spacing={3}>
        {filteredRequests.map((req) => (
          <Grid item xs={12} sm={6} md={4} key={req.id}>
            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  {req.subject}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {req.description}
                </Typography>
                <Typography
                  sx={{
                    mt: 1,
                    display: "inline-block",
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 2,
                    bgcolor:
                      req.status === "Open"
                        ? "green"
                        : req.status === "In Progress"
                        ? "orange"
                        : "gray",
                    color: "white",
                    fontSize: "0.85rem",
                  }}
                >
                  {req.status}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton
                  onClick={() => {
                    setCurrentRequest(req);
                    setOpenDialog(true);
                  }}
                  color="primary"
                >
                  <FaEdit />
                </IconButton>
                <IconButton onClick={() => handleDelete(req.id)} color="error">
                  <RiDeleteBin6Line />
                </IconButton>
              </CardActions>
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
