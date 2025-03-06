import React, { useState } from "react";
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
  Stack,
} from "@mui/material";

import { BiPlus } from "react-icons/bi";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import Swal from "sweetalert2";
import { Search } from "@mui/icons-material";

const SalesManagement = () => {
  const [sales, setSales] = useState([
    { id: 1, customer: "Rajat Sharma", amount: "₹1300", status: "Completed" },
    { id: 2, customer: "Megha Joshi", amount: "₹900", status: "Pending" },
    { id: 3, customer: "Nitin Saxena", amount: "₹2000", status: "Completed" },
    { id: 4, customer: "Aditi Nair", amount: "₹850", status: "Pending" },
    { id: 5, customer: "Suresh Menon", amount: "₹700", status: "Completed" },
    { id: 6, customer: "Pallavi Desai", amount: "₹450", status: "Pending" },
    { id: 7, customer: "Vivek Chauhan", amount: "₹1600", status: "Completed" },
    { id: 8, customer: "Sneha Reddy", amount: "₹720", status: "Pending" },
    { id: 9, customer: "Anupam Verma", amount: "₹1350", status: "Completed" },
    { id: 10, customer: "Divya Bhatt", amount: "₹500", status: "Pending" },
  ]);

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
  });

  const handleAddSale = () => {
    setNewSale({ customer: "", amount: "", status: "Pending" });
    setIsAdding(true);
  };

  const handleSaveNewSale = () => {
    if (!newSale.customer || !newSale.amount) {
      Swal.fire("Oops!", "Please fill in all fields before adding the sale.", "error");
      return;
    }

    const formattedAmount = newSale.amount.startsWith("₹") ? newSale.amount : `₹${newSale.amount}`;

    setSales([...sales, { id: sales.length + 1, ...newSale, amount: formattedAmount }]);
    setIsAdding(false);

    Swal.fire({
      title: "Added!",
      text: "New Sale has been added successfully.",
      icon: "success",
      timer: 4000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  };

  const handleDeleteSale = (id) => {
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
        setSales(sales.filter((sale) => sale.id !== id));
        Swal.fire({
          title: "Deleted!",
          text: "The Sale has been deleted.",
          icon: "success",
          timer: 4000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }
    });
  };

  const handleEditSale = (sale) => {
    setSelectedSale(sale);
    setIsEditing(true);
  };

  const handleSaveSale = () => {
    setSales(sales.map((sale) => (sale.id === selectedSale.id ? selectedSale : sale)));
    setIsEditing(false);

    Swal.fire({
      title: "Updated!",
      text: "Sale has been updated successfully.",
      icon: "success",
      timer: 4000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  };

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
          <TextField
            label="Search Sales"
            variant="outlined"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            sx={{ width: "325px"}}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />

          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            variant="outlined"
            sx={{ width: "150px", height: "40px" }}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
          </Select>
        </div>

        <Button variant="contained" color="primary" onClick={handleAddSale} startIcon={<BiPlus size={20} />}>
          Add Sale
        </Button>
      </div>

      {/* Sales Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#e0e0e0" }}>
              <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "1rem" }}>ID</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "1rem" }}>Customer</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "1rem" }}>Amount</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "1rem" }}>Status</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "1rem" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell align="center">{sale.id}</TableCell>
                <TableCell align="center">{sale.customer}</TableCell>
                <TableCell align="center">{sale.amount}</TableCell>
                <TableCell align="center">{sale.status}</TableCell>
                <TableCell align="center">
                  <Button onClick={() => handleEditSale(sale)} sx={{ marginRight: 1 }}>
                    <FaEdit size={20} />
                  </Button>
                  <Button onClick={() => handleDeleteSale(sale.id)}>
                    <RiDeleteBin6Line className="h-5 w-5 text-red-600" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default SalesManagement;
