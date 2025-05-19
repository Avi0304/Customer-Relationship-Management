import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Select,
  MenuItem,
  TableContainer,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  FormControl,
  InputLabel,
} from "@mui/material";

import { BiPlus } from "react-icons/bi";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import Swal from "sweetalert2";
import { Search } from "@mui/icons-material";

const SalesManagement = () => {
  const [sales, setSales] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  // Dialog states
  const [selectedSale, setSelectedSale] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newSale, setNewSale] = useState({
    customer: "",
    amount: "",
    status: "Pending",
    services: "",
  });
  const currentTheme = localStorage.getItem("theme") || "light";

  // Fetch Sales Data
  const fetchSales = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/sales/all");
      setSales(response.data);
    } catch (error) {
      console.error("Error fetching sales:", error);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  // Add Sale
  const handleAddSale = () => {
    setNewSale({ customer: "", amount: "", status: "Pending", services: "" });
    setIsAdding(true);
  };

  const handleSaveNewSale = async () => {
    if (!newSale.customer || !newSale.amount) {
      Swal.fire(
        "Oops!",
        "Please fill in all fields before adding the sale.",
        "error"
      );
      setIsAdding(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/sales/add",
        newSale
      );
      setSales([...sales, response.data.sale]);
      setIsAdding(false);

      Swal.fire({
        title: "Added!",
        text: "New Sale has been added successfully.",
        icon: "success",
        iconColor: currentTheme === "dark" ? "#4ade80" : "green",
        background: currentTheme === "dark" ? "#1e293b" : "#fff",
        color: currentTheme === "dark" ? "#f8fafc" : "#000",
        timer: 4000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error adding sale:", error);
      Swal.fire("Error", "Failed to add sale.", "error");
    }
  };

  // Delete Sale
  const handleDeleteSale = async (id) => {
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
          await axios.delete(`http://localhost:8080/api/sales/delete/${id}`);
          setSales(sales.filter((sale) => sale._id !== id));

          Swal.fire({
            title: "Deleted!",
            text: "The Sale has been deleted.",
            icon: "success",
            iconColor: currentTheme === "dark" ? "#4ade80" : "green",
            background: currentTheme === "dark" ? "#1e293b" : "#fff",
            color: currentTheme === "dark" ? "#f8fafc" : "#000",
            timer: 4000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
        } catch (error) {
          console.error("Error deleting sale:", error);
          Swal.fire("Error", "Failed to delete sale.", "error");
        }
      }
    });
  };

  // Edit Sale
  const handleEditSale = (sale) => {
    setSelectedSale(sale);
    setIsEditing(true);
  };

  const handleSaveSale = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/sales/update/${selectedSale._id}`,
        selectedSale
      );

      setSales(
        sales.map((sale) =>
          sale._id === selectedSale._id ? response.data.sale : sale
        )
      );
      setIsEditing(false);

      Swal.fire({
        title: "Updated!",
        text: "Sale has been updated successfully.",
        icon: "success",
        iconColor: currentTheme === "dark" ? "#4ade80" : "green",
        background: currentTheme === "dark" ? "#1e293b" : "#fff",
        color: currentTheme === "dark" ? "#f8fafc" : "#000",
        timer: 4000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error updating sale:", error);
      Swal.fire("Error", "Failed to update sale.", "error");
    }
  };

  // Filter Sales
  const filteredSales = sales.filter(
    (sale) =>
      (filter === "All" || sale.status === filter) &&
      sale.customer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* Search & Filter Section */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex gap-4">
          {/* Search Bar with Standardized Width */}
          <div style={{ width: "405px" }}>
            <TextField
              label="Search Sales"
              variant="outlined"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="small"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </div>

          {/* Filter Dropdown */}
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            variant="outlined"
            sx={{ width: "150px", height: "40px" }}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Cancelled">Cancelled</MenuItem>
          </Select>
        </div>

        {/* Add Sale Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddSale}
          startIcon={<BiPlus size={20} />}
        >
          Add Sale
        </Button>
      </div>

      {/* Sales Table */}
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
                Customer
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", fontSize: "1rem" }}
              >
                Service
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", fontSize: "1rem" }}
              >
                Amount
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
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSales.map((sale) => (
              <TableRow key={sale._id}>
                {/* <TableCell align="center">{sale._id}</TableCell> */}
                <TableCell align="center">{sale.customer}</TableCell>
                <TableCell align="center">{sale.services}</TableCell>
                <TableCell align="center">₹ {sale.amount}</TableCell>
                <TableCell align="center">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                      sale.status === "Completed"
                        ? "bg-green-500 text-white dark:bg-green-600"
                        : sale.status === "Pending"
                        ? "bg-yellow-500 text-white dark:bg-yellow-600"
                        : "bg-red-500 text-white dark:bg-red-600"
                    }`}
                  >
                    {sale.status}
                  </span>
                </TableCell>
                <TableCell align="center">
                  <Button
                    onClick={() => handleEditSale(sale)}
                    sx={{ marginRight: 1 }}
                  >
                    <FaEdit size={20} />
                  </Button>
                  <Button onClick={() => handleDeleteSale(sale._id)}>
                    <RiDeleteBin6Line className="h-5 w-5 text-red-600" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Sale Dialog */}
      <Dialog
        open={isAdding}
        onClose={() => setIsAdding(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          <h2 className="text-xl font-semibold mb-3">Add Sale</h2>
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            label="Customer Name"
            fullWidth
            margin="dense"
            value={newSale.customer}
            onChange={(e) =>
              setNewSale({ ...newSale, customer: e.target.value })
            }
          />
          <TextField
            label="Services"
            fullWidth
            margin="dense"
            value={newSale.services}
            onChange={(e) =>
              setNewSale({ ...newSale, services: e.target.value })
            }
          />
          <TextField
            label="Amount"
            fullWidth
            margin="dense"
            value={newSale.amount}
            onChange={(e) => setNewSale({ ...newSale, amount: e.target.value })}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              value={newSale.status}
              onChange={(e) =>
                setNewSale({ ...newSale, status: e.target.value })
              }
            >
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ m: 1 }}>
          <Button
            onClick={() => setIsAdding(false)}
            sx={{ color: "gray", "&:hover": { color: "darkgray" } }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveNewSale}
            color="primary"
            variant="contained"
          >
            Add{" "}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Sale Dialog */}
      <Dialog
        open={isEditing}
        onClose={() => setIsEditing(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Sale</DialogTitle>
        <DialogContent dividers>
          <TextField
            label="Customer Name"
            fullWidth
            margin="dense"
            value={selectedSale?.customer || ""}
            onChange={(e) =>
              setSelectedSale({ ...selectedSale, customer: e.target.value })
            }
          />
          <TextField
            label="Services"
            fullWidth
            margin="dense"
            value={selectedSale?.services || ""}
            onChange={(e) =>
              setSelectedSale({ ...selectedSale, services: e.target.value })
            }
          />
          <TextField
            label="Amount"
            fullWidth
            margin="dense"
            value={selectedSale?.amount || ""}
            onChange={(e) =>
              setSelectedSale({ ...selectedSale, amount: e.target.value })
            }
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              value={selectedSale?.status || ""}
              onChange={(e) =>
                setSelectedSale({ ...selectedSale, status: e.target.value })
              }
            >
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ m: 1 }}>
          <Button
            onClick={() => setIsEditing(false)}
            sx={{ color: "gray", "&:hover": { color: "darkgray" } }}
          >
            Cancel
          </Button>
          <Button onClick={handleSaveSale} color="primary" variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SalesManagement;
