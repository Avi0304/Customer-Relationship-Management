import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  InputAdornment,
} from "@mui/material";
import { BiPlus } from "react-icons/bi";
import { FaEdit, FaEye } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Edit, Delete, Visibility } from "@mui/icons-material";
import Swal from "sweetalert2";
import { Search } from "@mui/icons-material";

const CustomerDetails = () => {
  const [customers, setCustomers] = useState([
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
    { id: 11, customer: "Rohan Kapoor", amount: "₹950", status: "Completed" },
    { id: 12, customer: "Neha Malhotra", amount: "₹1120", status: "Pending" },
  ]);

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [formData, setFormData] = useState({
    customer: "",
    amount: "",
    status: "",
  });

  const handleOpen = (customer = null) => {
    setSelectedCustomer(customer);
    setFormData(customer || { customer: "", amount: "", status: "" });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCustomer(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (!formData.customer || !formData.amount || !formData.status) {
      Swal.fire("Oops!", "All fields are required.", "error");
      setOpen(false);
      return;
    }

    if (selectedCustomer) {
      setCustomers(
        customers.map((c) => (c.id === selectedCustomer.id ? formData : c))
      );
      Swal.fire({
        title: "Updated!",
        text: "Customer details have been updated successfully.",
        icon: "success",
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    } else {
      setCustomers([...customers, { ...formData, id: Date.now() }]);
      Swal.fire({
        title: "Added!",
        text: "New customer has been added successfully.",
        icon: "success",
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }
    handleClose();
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This customer record will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setCustomers(customers.filter((c) => c.id !== id));
        Swal.fire({
          title: "Deleted!",
          text: "The Sales has been deleted.",
          icon: "success",
          timer: 4000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }
    });
  };

  // **Fixed filtering function**
  const filteredCustomers = customers.filter((c) =>
    c.customer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        {/* <TextField
          label="Search Customers"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={() => handleOpen()} startIcon={<BiPlus size={20} />}>
          Add Customer
        /> */}

        <div className="w-full sm:w-1/2 md:w-1/3">
          <TextField
            label="Search Customers"
            variant="outlined"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpen()}
          startIcon={<BiPlus size={20} />}
        >
          Add Customer
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#e0e0e0" }}>
              <TableCell
                sx={{ fontWeight: "bold", fontSize: "1rem" }}
                align="center"
              >
                Customer
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", fontSize: "1rem" }}
                align="center"
              >
                Amount
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
            {filteredCustomers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell align="center">{customer.customer}</TableCell>
                <TableCell align="center">{customer.amount}</TableCell>
                <TableCell align="center">{customer.status}</TableCell>
                <TableCell align="center">
                  <Button color="primary" onClick={() => handleOpen(customer)}>
                    <FaEdit size={20} />
                  </Button>
                  <Button color="info" onClick={() => handleOpen(customer)}>
                    <FaEye size={20} color="black" />
                  </Button>
                  <Button
                    color="error"
                    onClick={() => handleDelete(customer.id)}
                  >
                    <RiDeleteBin6Line className="h-4 w-4 text-red-600" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          <h2 className="font-bold">
            {" "}
            {selectedCustomer ? "Edit Customer" : "Add Customer"}
          </h2>
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Customer"
            name="customer"
            value={formData.customer}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions sx={{ m: 1 }}>
          <Button
            onClick={handleClose}
            sx={{ color: "gray", "&:hover": { color: "darkgray" } }}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary" variant="contained">
            {selectedCustomer ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CustomerDetails;
