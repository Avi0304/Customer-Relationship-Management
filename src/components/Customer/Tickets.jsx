import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputAdornment,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { LuPlus } from "react-icons/lu";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { UserContext } from "../../context/UserContext";

const Badge = ({ label, type }) => {
  const colorMap = {
    priority: {
      Low: "bg-green-500 text-white",
      Medium: "bg-yellow-500 text-white",
      High: "bg-red-500 text-white",
    },
    status: {
      Open: "bg-blue-500 text-white",
      "In Progress": "bg-purple-500 text-white",
      Closed: "bg-gray-500 text-white",
    },
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium capitalize ${colorMap[type][label]}`}
    >
      {label}
    </span>
  );
};

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [category, setCategory] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);
  const { user } = useContext(UserContext);

  useEffect(() => {
    fetchTicket();
  }, []);

  const fetchTicket = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/support/all");
      setTickets(response.data.data);
    } catch (error) {
      console.error("Error in Fetching Tickets: ", error);
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.subject.toLowerCase().includes(search.toLowerCase()) ||
      ticket._id.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = status ? ticket.status === status : true;
    const matchesPriority = priority ? ticket.priority === priority : true;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentRequest((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!currentRequest.subject || !currentRequest.description) {
      await Swal.fire("Error", "All fields are required!", "error");
      return;
    }

    // Include userId from context
    const requestData = {
      ...currentRequest,
      userId: user._id,
    };

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
          requestData
        );
        Swal.fire("Success", "Request updated successfully!", "success");
      } else {
        await axios.post("http://localhost:8080/api/support/add", requestData);
        Swal.fire("Success", "Request created successfully!", "success");
      }

      setOpenDialog(false);
      setCurrentRequest(null);
      await fetchTicket();
    } catch (error) {
      console.error("Error saving request:", error);
      Swal.fire("Error", "Failed to save request", "error");
      setOpenDialog(false);
      setCurrentRequest(null);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-end flex-wrap gap-y-3 mb-6">
        <div className="flex flex-wrap items-end gap-3">
          <TextField
            label="Search Tickets"
            variant="outlined"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            sx={{ minWidth: 200 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Open">Open</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Closed">Closed</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Priority</InputLabel>
            <Select
              label="Priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
            </Select>
          </FormControl>
        </div>

        <Button
          component={Link}
          variant="contained"
          color="primary"
          startIcon={<LuPlus />}
          sx={{ minWidth: 150 }}
          onClick={() => {
            setCurrentRequest({
              subject: "",
              description: "",
              status: "Open",
            });
            setOpenDialog(true);
          }}
        >
          New Ticket
        </Button>
      </div>

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
                align="center"
                sx={{ fontWeight: "bold", fontSize: "1rem" }}
              >
                Ticket ID
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", fontSize: "1rem" }}
              >
                Title
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", fontSize: "1rem" }}
              >
                Priority
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", fontSize: "1rem" }}
              >
                Status
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", fontSize: "1rem" }}
              >
                Created
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", fontSize: "1rem" }}
              >
                Updated
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTickets.map((ticket) => (
              <TableRow key={ticket._id} hover>
                <TableCell align="center">
                  TICKET-{ticket._id.slice(-4).toUpperCase()}
                </TableCell>
                <TableCell align="center">
                  <Link
                    to={`/ticket-detail/${ticket._id}`}
                    style={{ color: "#1976d2", textDecoration: "none" }}
                  >
                    {ticket.subject}
                  </Link>
                </TableCell>
                <TableCell align="center">
                  <Badge label={ticket.priority} type="priority" />
                </TableCell>
                <TableCell align="center">
                  <Badge label={ticket.status} type="status" />
                </TableCell>
                <TableCell align="center">
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell align="center">
                  {new Date(ticket.updatedAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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

          <FormControl fullWidth margin="dense">
            <InputLabel>Priority</InputLabel>
            <Select
              label="Priority"
              name="priority"
              value={currentRequest?.priority || "Low"}
              onChange={handleChange}
            >
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
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
    </div>
  );
};

export default Tickets;
