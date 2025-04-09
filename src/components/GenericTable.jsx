import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const API_BASE_URLS = {
  emailCampaigns: "http://localhost:8080/api/campaigns",
  smsCampaigns: "http://localhost:8080/api/sms-campaigns",
  audienceTable: "http://localhost:8080/api/audiences",
  // smsAudienceTable: "http://localhost:8080/api/sms-audiences",
  emailPostTable: "http://localhost:8080/api/promoted-posts",
  // smsPostTable: "http://localhost:8080/api/sms-posts",
};

const TABLE_HEADERS = {
  emailCampaigns: ["Title", "Status", "Created At"],
  smsCampaigns: ["Title", "message", "Created At"],
  audienceTable: ["Location", "Age Range", "Gender", "Interests"],
  // smsAudienceTable: ["Location", "Age Range", "Gender", "Interests"],
  emailPostTable: ["Caption", "Call-to-Action", "Budget", "Start Date", "End Date"],
  // smsPostTable: ["Caption", "Call-to-Action", "Budget", "Start Date", "End Date"],
};

const DISPLAY_FIELDS = {
  emailCampaigns: ["title", "status", "createdAt"],
  smsCampaigns: ["title", "message", "createdAt"],
  audienceTable: ["location", "ageRange", "gender", "interests"],
  // smsAudienceTable: ["location", "ageRange", "gender", "interests"],
  emailPostTable: ["caption", "callToAction", "budget", "startDate", "endDate"],
  // smsPostTable: ["caption", "cta", "budget", "startDate", "endDate"],
};

const GenericTable = ({ tableType }) => {
  const [data, setData] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchData();
  }, [tableType]);

  const fetchData = async () => {
    try {
      const response = await axios.get(API_BASE_URLS[tableType]);
      setData(response.data);
    } catch (error) {
      console.error(`Error fetching ${tableType}:`, error);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item._id);
    setFormData({ ...item });
    setOpenDialog(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(`${API_BASE_URLS[tableType]}/${editingItem}`, formData);
      setData((prev) => prev.map((item) => (item._id === editingItem ? response.data : item)));
      setOpenDialog(false);
      toast.success("Item updated successfully!");
    } catch (error) {
      console.error(`Error updating ${tableType}:`, error);
      toast.error("Failed to update item.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URLS[tableType]}/${id}`);
      setData((prev) => prev.filter((item) => item._id !== id));
      toast.error("Item deleted successfully!");
    } catch (error) {
      console.error(`Error deleting ${tableType}:`, error);
      toast.error("Failed to delete item.");
    }
  };

  // Function to handle form submission and update the table
  const handleFormSubmit = async (newItem) => {
    try {
      const response = await axios.post(API_BASE_URLS[tableType], newItem);
      setData((prev) => [...prev, response.data]); // Add the new item to the state
      toast.success("Item added successfully!");
    } catch (error) {
      console.error(`Error adding new item to ${tableType}:`, error);
      toast.error("Failed to add item.");
    }
  };

  return (
    <>
      <ToastContainer />
      <TableContainer component={Paper} style={{ marginTop: 20, boxShadow: "0 3px 5px rgba(0,0,0,0.1)" }}>
        <Table>
          <TableHead style={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              {TABLE_HEADERS[tableType].map((header) => (
                <TableCell key={header} sx={{ backgroundColor: "#ddd", fontWeight: "bold", color: "#222"  }}>
                  {header}
                </TableCell>
              ))}
              <TableCell style={{ backgroundColor: "#ddd", fontWeight: "bold", color: "#222" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item._id} hover>
                {DISPLAY_FIELDS[tableType].map((field) => (
                  <TableCell key={field}>{item[field]}</TableCell>
                ))}
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEdit(item)}>
                    <FaEdit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(item._id)}>
                    <RiDeleteBin6Line />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Edit Item</DialogTitle>
        <DialogContent>
          {Object.keys(formData).map((key) => (
            <TextField
              key={key}
              label={key}
              name={key}
              value={formData[key] || ""}
              onChange={handleChange}
              fullWidth
              margin="dense"
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary" startIcon={<SaveIcon />}>
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default GenericTable;