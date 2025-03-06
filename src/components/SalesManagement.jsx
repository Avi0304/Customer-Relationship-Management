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
  Stack,
} from "@mui/material";
import { BiPlus } from "react-icons/bi";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";

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
    setNewSale({ customer: "", amount: "", status: "Pending" }); // Reset form
    setIsAdding(true);
  };

  const handleSaveNewSale = () => {
    if (!newSale.customer || !newSale.amount) {
      alert("Please fill in all fields before adding the sale.");
      return;
    }
    const formattedAmount = newSale.amount.startsWith("₹")
      ? newSale.amount
      : `₹${newSale.amount}`;

    setSales([
      ...sales,
      { id: sales.length + 1, ...newSale, amount: formattedAmount },
    ]);
    setIsAdding(false);
  };

  const handleDeleteSale = (id) => {
    setSales(sales.filter((sale) => sale.id !== id));
  };

  const handleEditSale = (sale) => {
    setSelectedSale(sale);
    setIsEditing(true);
  };

  const handleSaveSale = () => {
    setSales(
      sales.map((sale) => (sale.id === selectedSale.id ? selectedSale : sale))
    );
    setIsEditing(false);
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
            placeholder="Search customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            sx={{ width: "200px", "& .MuiInputBase-root": { height: "35px" } }}
          />
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            size="small"
            sx={{
              width: "120px",
              height: "35px",
              "& .MuiSelect-select": {
                display: "flex",
                alignItems: "center",
                height: "100%",
              },
            }}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
          </Select>
        </div>
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
            <TableRow sx={{ backgroundColor: "#e0e0e0" }}>
                          <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }} align="center">ID</TableCell>
                          <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }} align="center">Customer</TableCell>
                          <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }} align="center">Amount</TableCell>
                          <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }} align="center">Amount</TableCell>
                          <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }} align="center">Actions</TableCell>
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
                  <Button
                    onClick={() => handleEditSale(sale)}
                    sx={{ marginRight: 1 }}
                  >
                    <FaEdit size={20}/>
                  </Button>
                  <Button
                    onClick={() => handleDeleteSale(sale.id)}
                  >
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
        <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>
          Add New Sale
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              label="Customer Name"
              variant="outlined"
              value={newSale.customer}
              onChange={(e) =>
                setNewSale({ ...newSale, customer: e.target.value })
              }
              fullWidth
            />
            <TextField
              label="Amount"
              variant="outlined"
              value={newSale.amount}
              onChange={(e) =>
                setNewSale({ ...newSale, amount: e.target.value })
              }
              fullWidth
            />
            <Select
              value={newSale.status}
              onChange={(e) =>
                setNewSale({ ...newSale, status: e.target.value })
              }
              fullWidth
              sx={{ height: "45px" }}
            >
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
            </Select>
          </Stack>
        </DialogContent>
        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "space-between",
            px: 3,
            pb: 3,
          }}
        >
          <Button
            onClick={() => setIsAdding(false)}
            variant="outlined"
            color="secondary"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveNewSale}
            variant="contained"
            color="primary"
          >
            Add Sale
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Sale Dialog (Same as before) */}
      <Dialog
        open={isEditing}
        onClose={() => setIsEditing(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>
          Edit Sale Details
        </DialogTitle>
        <DialogContent>
          {selectedSale && (
            <Stack spacing={2} sx={{ mt: 2 }}>
              <TextField
                label="Customer Name"
                variant="outlined"
                value={selectedSale.customer}
                onChange={(e) =>
                  setSelectedSale({ ...selectedSale, customer: e.target.value })
                }
                fullWidth
              />
              <TextField
                label="Amount"
                variant="outlined"
                value={selectedSale.amount}
                onChange={(e) =>
                  setSelectedSale({ ...selectedSale, amount: e.target.value })
                }
                fullWidth
              />
              <Select
                value={selectedSale.status}
                onChange={(e) =>
                  setSelectedSale({ ...selectedSale, status: e.target.value })
                }
                fullWidth
              >
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
              </Select>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditing(false)}>Cancel</Button>
          <Button onClick={handleSaveSale}>Save Changes</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SalesManagement;
