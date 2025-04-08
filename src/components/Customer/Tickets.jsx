import React, { useState } from "react";
import {
    Box,
    Button,
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

const tickets = [
    {
        id: "TICKET-1001",
        title: "Unable to deploy my Next.js application",
        category: "Deployment",
        priority: "high",
        status: "open",
        created: "2025-04-05T10:30:00Z",
        updated: "2025-04-05T14:45:00Z",
    },
    {
        id: "TICKET-1002",
        title: "Billing issue with my Pro subscription",
        category: "Billing",
        priority: "medium",
        status: "in-progress",
        created: "2025-04-03T08:15:00Z",
        updated: "2025-04-07T09:20:00Z",
    },
    {
        id: "TICKET-1003",
        title: "Need help with environment variables",
        category: "Configuration",
        priority: "low",
        status: "closed",
        created: "2025-04-01T16:45:00Z",
        updated: "2025-04-02T11:30:00Z",
    },
    {
        id: "TICKET-1004",
        title: "Website performance issues after latest deployment",
        category: "Performance",
        priority: "high",
        status: "open",
        created: "2025-04-06T09:10:00Z",
        updated: "2025-04-06T11:25:00Z",
    },
    {
        id: "TICKET-1005",
        title: "Need to update payment method",
        category: "Billing",
        priority: "medium",
        status: "closed",
        created: "2025-03-28T14:20:00Z",
        updated: "2025-03-29T10:15:00Z",
    },
];

const Badge = ({ label, type }) => {
    const colorMap = {
        priority: {
            low: "bg-green-500 text-white",
            medium: "bg-yellow-500 text-white",
            high: "bg-red-500 text-white",
        },
        status: {
            open: "bg-blue-500 text-white",
            "in-progress": "bg-purple-500 text-white",
            closed: "bg-gray-500 text-white",
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
    const [search, setSearch] = useState("");
    const [status, setStatus] =useState("");
    const [priority, setPriority] = useState("");
    const [category, setCategory] = useState("");

    const filteredTickets = tickets.filter((ticket) => {
        const matchesSearch =
            ticket.title.toLowerCase().includes(search.toLowerCase()) ||
            ticket.id.toLowerCase().includes(search.toLowerCase());

        const matchesStatus = status ? ticket.status === status : true;
        const matchesPriority = priority ? ticket.priority === priority : true;
        const matchesCategory = category ? ticket.category === category : true;

        return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
    });

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
                            <MenuItem value="open">Open</MenuItem>
                            <MenuItem value="in-progress">In Progress</MenuItem>
                            <MenuItem value="closed">Closed</MenuItem>
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
                            <MenuItem value="low">Low</MenuItem>
                            <MenuItem value="medium">Medium</MenuItem>
                            <MenuItem value="high">High</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ minWidth: 160 }}>
                        <InputLabel>Category</InputLabel>
                        <Select
                            label="Category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <MenuItem value="">All</MenuItem>
                            <MenuItem value="Deployment">Deployment</MenuItem>
                            <MenuItem value="Billing">Billing</MenuItem>
                            <MenuItem value="Configuration">Configuration</MenuItem>
                            <MenuItem value="Performance">Performance</MenuItem>
                        </Select>
                    </FormControl>
                </div>

                <Button
                    component={Link}
                    to="/tickets/new"
                    variant="contained"
                    color="primary"
                    startIcon={<LuPlus />}
                    sx={{ minWidth: 150 }}
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
                            <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "1rem" }}>Ticket ID</TableCell>
                            <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "1rem" }}>Title</TableCell>
                            <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "1rem" }}>Category</TableCell>
                            <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "1rem" }}>Priority</TableCell>
                            <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "1rem" }}>Status</TableCell>
                            <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "1rem" }}>Created</TableCell>
                            <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "1rem" }}>Updated</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredTickets.map((ticket) => (
                            <TableRow key={ticket.id} hover>
                                <TableCell align="center">{ticket.id}</TableCell>
                                <TableCell align="center">
                                    <Link
                                        to={`/tickets/${ticket.id}`}
                                        style={{ color: "#1976d2", textDecoration: "none" }}
                                    >
                                        {ticket.title}
                                    </Link>
                                </TableCell>
                                <TableCell align="center">{ticket.category}</TableCell>
                                <TableCell align="center">
                                    <Badge label={ticket.priority} type="priority" />
                                </TableCell>
                                <TableCell align="center">
                                    <Badge label={ticket.status} type="status" />
                                </TableCell>
                                <TableCell align="center">
                                    {new Date(ticket.created).toLocaleDateString()}
                                </TableCell>
                                <TableCell align="center">
                                    {new Date(ticket.updated).toLocaleDateString()}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default Tickets;
