import React, { useEffect, useState } from "react";
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
  MenuItem, Select, FormControl, InputLabel
} from "@mui/material";
import { BiPlus } from "react-icons/bi";
import { FaEdit, FaEye } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Edit, Delete, Visibility } from "@mui/icons-material";
import Swal from "sweetalert2";
import { Search } from "@mui/icons-material";
import axios from "axios";

const CustomerDetails = () => {
  const [customers, setCustomers] = useState([]);

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [viewOnly, setViewOnly] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [formData, setFormData] = useState({
    customer: "",
    amount: "",
    status: "",
    services: "",
  });
  const currentTheme = localStorage.getItem("theme") || "light";

  useEffect(() => {
    fetchCustomer();
  }, []);

  const fetchCustomer = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/Customer/all");
      console.log("API Response:", response.data); // Debugging: Log the response
      setCustomers(Array.isArray(response.data) ? response.data : []); // Ensure an array
    } catch (error) {
      console.error("Error fetching customers: ", error);
      setCustomers([]); // Prevent undefined errors
    }
  };



  const handleOpen = (customer = null, isViewOnly = false) => {
    setSelectedCustomer(customer);
    setFormData(customer || { customer: "", amount: "", status: "", service: "" });
    setViewOnly(isViewOnly);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCustomer(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Check if the 'services' field is being updated
    if (name === "services") {
      setFormData({ ...formData, [name]: value });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };


  const handleSave = async () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.segmentation || !formData.amount) {
      Swal.fire("Oops!", "All fields are required.", "error");
      return;
    }

    if (formData.amount !== undefined && formData.amount !== null) {
      formData.amount = String(formData.amount).trim();
    }


    try {
      if (selectedCustomer) {
        // Update customer
        console.log("Submitting updated formData:", formData);
        await axios.put(`http://localhost:8080/api/Customer/update/${selectedCustomer._id}`, formData);
        await fetchCustomer();
        Swal.fire({
          title: "Updated!",
          text: "Customer details have been updated successfully.",
          icon: "success",
          iconColor: currentTheme === "dark" ? "#4ade80" : "green",
          background: currentTheme === "dark" ? "#1e293b" : "#fff",
          color: currentTheme === "dark" ? "#f8fafc" : "#000",
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      } else {
        // Ensure correct payload before sending request
        const newCustomerData = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          segmentation: formData.segmentation,
          status: formData.status || "pending", // Default status if not provided
          leadstatus: formData.leadstatus || "new", // Default lead status
          amount: formData.amount,
        };

        console.log("Sending Data:", newCustomerData); // Debugging

        // Add new customer
        await axios.post("http://localhost:8080/api/Customer/add", newCustomerData);
        await fetchCustomer();
        Swal.fire({
          title: "Added!",
          text: "New customer has been added successfully.",
          icon: "success",
          iconColor: currentTheme === "dark" ? "#4ade80" : "green",
          background: currentTheme === "dark" ? "#1e293b" : "#fff",
          color: currentTheme === "dark" ? "#f8fafc" : "#000",
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }

      handleClose();
    } catch (error) {
      console.error("Error in updating customer:", error.response ? error.response.data : error);
      Swal.fire("Error", "Something went wrong. Please try again.", "error");
    }
  };



  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This customer record will be permanently deleted!",
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
          const response = await axios.delete(`http://localhost:8080/api/Customer/delete/${id}`);

          if (response.status === 200) {
            setCustomers(customers.filter((c) => c._id !== id)); // Ensure you're using `_id`
            Swal.fire({
              title: "Deleted!",
              text: "The customer has been deleted successfully.",
              icon: "success",
              iconColor: currentTheme === "dark" ? "#4ade80" : "green",
              background: currentTheme === "dark" ? "#1e293b" : "#fff",
              color: currentTheme === "dark" ? "#f8fafc" : "#000",
              timer: 4000,
              timerProgressBar: true,
              showConfirmButton: false,
            });
          }
        } catch (error) {
          Swal.fire({
            title: "Error!",
            text: "Failed to delete the customer. Please try again.",
            icon: "error",
            iconColor: currentTheme === "dark" ? "#f87171" : "red",
            background: currentTheme === "dark" ? "#1e293b" : "#fff",
            color: currentTheme === "dark" ? "#f8fafc" : "#000",
          });
          console.error("Error deleting customer:", error);
        }
      }
    });
  };


  const filteredCustomers = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );


  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
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
            <TableRow sx={{ backgroundColor: (theme) => theme.palette.mode === "dark" ? "#2d2d2d" : "#e0e0e0" }}>
              <TableCell
                sx={{ fontWeight: "bold", fontSize: "1rem", width: "25%" }}
                align="center"
              >
                Customer
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", fontSize: "1rem", width: "25%" }}
                align="center"
              >
                Amount
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", fontSize: "1rem", width: "25%" }}
                align="center"
              >
                Status
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", fontSize: "1rem", width: "25%" }}
                align="center"
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCustomers.map((customer) => (
              <TableRow key={customer._id}>
                <TableCell align="center" sx={{ width: "25%" }}>
                  {customer.name}
                </TableCell>
                <TableCell align="center" sx={{ width: "25%" }}>
                  ₹ {customer.amount}
                </TableCell>
                <TableCell align="center" sx={{ width: "25%" }}>
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${customer.status.charAt(0).toUpperCase() + customer.status.slice(1) === "Completed"
                      ? "bg-green-500 text-white dark:bg-green-600"
                      : customer.status.charAt(0).toUpperCase() + customer.status.slice(1) === "Pending"
                        ? "bg-yellow-500 text-white dark:bg-yellow-600"
                        : "bg-red-500 text-white dark:bg-red-600"
                      }`}
                  >
                    {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                  </span>
                </TableCell>
                <TableCell align="center" sx={{ width: "25%" }}>
                  <Button color="primary" onClick={() => handleOpen(customer)}>
                    <FaEdit size={20} />
                  </Button>
                  <Button color="info" onClick={() => handleOpen(customer, true)}>
                    <FaEye size={20} className="text-black dark:text-[#E5E7EB]" />
                  </Button>
                  <Button
                    color="error"
                    onClick={() => handleDelete(customer._id)}
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
            {viewOnly ? "View Details" : selectedCustomer ? "Edit Customer" : "Add Customer"}
          </h2>
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Name"
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            required
            InputProps={{ readOnly: viewOnly }}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Email"
            name="email"
            type="email"
            value={formData.email || ""}
            onChange={handleChange}
            required
            InputProps={{ readOnly: viewOnly }}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Phone"
            name="phone"
            type="tel"
            value={formData.phone || ""}
            onChange={handleChange}
            required
            InputProps={{ readOnly: viewOnly }}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Segmentation"
            name="segmentation"
            value={formData.segmentation || ""}
            onChange={handleChange}
            InputProps={{ readOnly: viewOnly }}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Amount"
            name="amount"
            type="String"
            value={formData.amount || ""}
            onChange={handleChange}
            required
            InputProps={{ readOnly: viewOnly }}
          />
          <FormControl fullWidth margin="dense" disabled={viewOnly}>
            <InputLabel>Status</InputLabel>
            <Select name="status" value={formData.status || "Pending"} onChange={handleChange}>
              <MenuItem value="completed">completed</MenuItem>
              <MenuItem value="pending">pending</MenuItem>
              <MenuItem value="cancelled">cancelled</MenuItem>
            </Select>
          </FormControl>

          {formData.status === "completed" && (
            <TextField
              fullWidth
              margin="dense"
              label="Service"
              name="services"
              value={formData.services || ""}
              onChange={handleChange}
              required
              InputProps={{ readOnly: viewOnly }}
            />
          )}
        </DialogContent>
        <DialogActions sx={{ m: 1 }}>
          <Button onClick={handleClose} sx={{ color: "gray", "&:hover": { color: "darkgray" } }}>
            {viewOnly ? "Close" : "Cancel"}
          </Button>
          {!viewOnly && (
            <Button onClick={handleSave} color="primary" variant="contained">
              {selectedCustomer ? "Update" : "Add"}
            </Button>
          )}
        </DialogActions>

      </Dialog>

    </Box>
  );
};

export default CustomerDetails;
