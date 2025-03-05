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
  Grid,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

const SalesManagement = () => {
  const [sales, setSales] = useState([
    { id: 1, customer: "John Doe", amount: "$500", status: "Completed" },
    { id: 2, customer: "Jane Smith", amount: "$300", status: "Pending" },
    { id: 3, customer: "Michael Brown", amount: "$700", status: "Completed" },
  ]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [selectedSale, setSelectedSale] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newSale, setNewSale] = useState({
    customer: "",
    amount: "",
    status: "Pending",
  });

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleAddSale = () => {
    setNewSale({ customer: "", amount: "", status: "Pending" });
    setIsAdding(true);
  };

  const handleSaveNewSale = () => {
    if (!newSale.customer || !newSale.amount) {
      alert("Please fill in all fields before adding the sale.");
      return;
    }
    setSales([...sales, { id: sales.length + 1, ...newSale }]);
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
      <Grid container spacing={2} alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            placeholder="Search customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
          />
        </Grid>
        <Grid item xs={6} sm={3} md={2}>
          <Select fullWidth value={filter} onChange={(e) => setFilter(e.target.value)} size="small">
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={6} sm={3} md={2}>
          <Button fullWidth variant="contained" color="primary" onClick={handleAddSale}>
            Add Sale
          </Button>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table size={isSmallScreen ? "small" : "medium"}>
          <TableHead>
            <TableRow>
              <TableCell align="center"><b>ID</b></TableCell>
              <TableCell align="center"><b>Customer</b></TableCell>
              <TableCell align="center"><b>Amount</b></TableCell>
              <TableCell align="center"><b>Status</b></TableCell>
              <TableCell align="center"><b>Actions</b></TableCell>
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
                  <Button size="small" variant="contained" color="info" onClick={() => handleEditSale(sale)}>
                    Edit
                  </Button>
                  <Button size="small" variant="contained" color="secondary" onClick={() => handleDeleteSale(sale.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={isAdding} onClose={() => setIsAdding(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add New Sale</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField label="Customer Name" value={newSale.customer} onChange={(e) => setNewSale({ ...newSale, customer: e.target.value })} fullWidth />
            <TextField label="Amount" value={newSale.amount} onChange={(e) => setNewSale({ ...newSale, amount: e.target.value })} fullWidth />
            <Select value={newSale.status} onChange={(e) => setNewSale({ ...newSale, status: e.target.value })} fullWidth>
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
            </Select>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAdding(false)}>Cancel</Button>
          <Button onClick={handleSaveNewSale}>Add Sale</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SalesManagement;
