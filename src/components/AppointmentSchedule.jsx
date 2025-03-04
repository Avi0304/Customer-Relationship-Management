import React, { useState } from "react";
import { BiPlus } from "react-icons/bi";
import {
  Button,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { Card, CardHeader, CardContent } from "../components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../components/ui/table";
import dayjs from "dayjs";
import { FaEdit } from "react-icons/fa";
import { PiVideoCameraBold } from "react-icons/pi";
import { RiDeleteBin6Line } from "react-icons/ri";

const AppointmentSchedule = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [editAppointment, setEditAppointment] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const today = dayjs().format("YYYY-MM-DD");

  const [appointments, setAppointments] = useState([
    {
      id: 1,
      customer: "Acme Inc.",
      contact: "John Smith",
      date: "2025-03-10",
      time: "10:00 AM",
      duration: "30 min",
      status: "Confirmed",
      type: "Sales Demo",
    },
    {
      id: 2,
      customer: "Widget Corp",
      contact: "Sarah Johnson",
      date: "2025-03-12",
      time: "2:00 PM",
      duration: "45 min",
      status: "Pending",
      type: "Follow-up",
    },
    {
      id: 3,
      customer: "Tech Solutions",
      contact: "Mike Davis",
      date: "2025-03-15",
      time: "11:30 AM",
      duration: "60 min",
      status: "Confirmed",
      type: "Consultation",
    },
    {
      id: 4,
      customer: "Axe IT Solutions",
      contact: "Lisa Wong",
      date: "2025-03-18",
      time: "3:15 PM",
      duration: "30 min",
      status: "Cancelled",
      type: "Support",
    },
    // Past Appointments
    {
      id: 5,
      customer: "Legacy Corp",
      contact: "Robert Brown",
      date: "2025-02-28",
      time: "9:00 AM",
      duration: "60 min",
      status: "Confirmed",
      type: "Business Meeting",
    },
    {
      id: 6,
      customer: "OldTech Ltd.",
      contact: "Emma Wilson",
      date: "2025-02-25",
      time: "1:30 PM",
      duration: "45 min",
      status: "Confirmed",
      type: "Technical Review",
    },
    {
      id: 7,
      customer: "Classic Consulting",
      contact: "David Johnson",
      date: "2025-02-20",
      time: "4:00 PM",
      duration: "30 min",
      status: "Confirmed",
      type: "Strategy Session",
    },
  ]);

  const [newAppointment, setNewAppointment] = useState({
    customer: "",
    contact: "",
    date: "",
    time: "",
    duration: "",
    status: "Pending",
    type: "",
  });

  const handleInputChange = (e) => {
    setNewAppointment({ ...newAppointment, [e.target.name]: e.target.value });
  };

  const handleAddAppointment = () => {
    setAppointments([
      ...appointments,
      { id: appointments.length + 1, ...newAppointment },
    ]);
    setOpenModal(false);
    setNewAppointment({
      customer: "",
      contact: "",
      date: "",
      time: "",
      duration: "",
      status: "Pending",
      type: "",
    });
  };

  const handleEditClick = (appointment) => {
    setEditAppointment(appointment);
    setOpenEditModal(true);
  };

  const handleEditInputChange = (e) => {
    setEditAppointment({ ...editAppointment, [e.target.name]: e.target.value });
  };

  const handleUpdateAppointment = () => {
    setAppointments(
      appointments.map((appt) =>
        appt.id === editAppointment.id ? editAppointment : appt
      )
    );
    setOpenEditModal(false);
  };

  const handleDeleteAppointment = (id) => {
    setAppointments(appointments.filter((appointment) => appointment.id !== id));
  };

  
  const filteredAppointments = appointments.filter(
    (appointment) =>
      appointment.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const upcomingAppointments = filteredAppointments.filter(
    (appointment) => appointment.date >= today
  );
  const pastAppointments = filteredAppointments.filter(
    (appointment) => appointment.date < today
  );

  return (
    <div className="w-full max-w-screen-xl mx-auto space-y-4">
      {/* Search Field & Button */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Search Input */}
        <div className="w-full md:w-1/3">
          <TextField
            fullWidth
            variant="outlined"
            label="Search Appointment"
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search className="text-gray-500" />
                </InputAdornment>
              ),
            }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Add Appointment Button */}
        <div className="w-full md:w-auto">
          <Button
            variant="contained"
            color="primary"
            size="medium"
            startIcon={<BiPlus size={20} />}
            onClick={() => setOpenModal(true)}
          >
            Add Appointment
          </Button>
        </div>
      </div>

      <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
        <Tab label="Upcoming" />
        <Tab label="Past" />
        <Tab label="All" />
      </Tabs>

      {tabValue === 0 && (
        <Card className="mt-4">
          <CardHeader><h1 className="text-lg font-bold leading-none tracking-tight mb-2">Upcoming Appointments</h1></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="flex justify-center">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {upcomingAppointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>{appointment.customer}</TableCell>
                    <TableCell>{appointment.contact}</TableCell>
                    <TableCell>{appointment.date}</TableCell>
                    <TableCell>{appointment.time}</TableCell>
                    <TableCell>{appointment.duration}</TableCell>
                    <TableCell>{appointment.type}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          appointment.status === "Confirmed"
                            ? "bg-green-500 text-white"
                            : appointment.status === "Pending"
                            ? "bg-yellow-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </TableCell>
                    <TableCell>
                    <div className="flex gap-2">
                        <Button
                          variant="outlined"
                          size="small"
                          className="w-8 h-8 rounded-md p-1 border-gray-300 hover:bg-gray-100 "
                          onClick={() => handleEditClick(appointment)}
                        >
                          <FaEdit className="h-4 w-4 text-blue-600" />
                        </Button>

                        <Button
                          variant="outlined"
                          size="small"
                          className="w-8 h-8 rounded-md p-1 border-gray-300 hover:bg-gray-100 "
                        >
                          <PiVideoCameraBold className="h-4 w-4 text-green-600" />
                        </Button>

                        <Button
                          variant="outlined"
                          size="small"
                          className="w-8 h-8 rounded-md p-1 border-gray-300 hover:bg-gray-100 "
                          onClick={() => handleDeleteAppointment(appointment.id)}
                        >
                          <RiDeleteBin6Line className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {tabValue === 1 && (
        <Card className="mt-4">
          <CardHeader><h1 className="text-lg font-bold leading-none tracking-tight mb-2">Past Appointments</h1></CardHeader>
          <CardContent>
            {pastAppointments.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="flex justify-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pastAppointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>{appointment.customer}</TableCell>
                      <TableCell>{appointment.contact}</TableCell>
                      <TableCell>{appointment.date}</TableCell>
                      <TableCell>{appointment.time}</TableCell>
                      <TableCell>{appointment.duration}</TableCell>
                      <TableCell>{appointment.type}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            appointment.status === "Confirmed"
                              ? "bg-green-500 text-white"
                              : appointment.status === "Pending"
                              ? "bg-yellow-500 text-white"
                              : "bg-red-500 text-white"
                          }`}
                        >
                          {appointment.status}
                        </span>
                      </TableCell>
                      <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outlined"
                          size="small"
                          className="w-8 h-8 rounded-md p-1 border-gray-300 hover:bg-gray-100 "
                          onClick={() => handleEditClick(appointment)}
                        >
                          <FaEdit className="h-4 w-4 text-blue-600" />
                        </Button>

                        <Button
                          variant="outlined"
                          size="small"
                          className="w-8 h-8 rounded-md p-1 border-gray-300 hover:bg-gray-100 "
                        >
                          <PiVideoCameraBold className="h-4 w-4 text-green-600" />
                        </Button>

                        <Button
                          variant="outlined"
                          size="small"
                          className="w-8 h-8 rounded-md p-1 border-gray-300 hover:bg-gray-100 "
                          onClick={() => handleDeleteAppointment(appointment.id)}
                        >
                          <RiDeleteBin6Line className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-gray-500">No past appointments to display.</p>
            )}
          </CardContent>
        </Card>
      )}

      {tabValue === 2 && (
        <Card className="mt-4">
          <CardHeader><h1 className="text-lg font-bold leading-none tracking-tight mb-2">All Appointments</h1></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="flex justify-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>{appointment.customer}</TableCell>
                    <TableCell>{appointment.contact}</TableCell>
                    <TableCell>{appointment.date}</TableCell>
                    <TableCell>{appointment.time}</TableCell>
                    <TableCell>{appointment.duration}</TableCell>
                    <TableCell>{appointment.type}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          appointment.status === "Confirmed"
                            ? "bg-green-500 text-white"
                            : appointment.status === "Pending"
                            ? "bg-yellow-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outlined"
                          size="small"
                          className="w-8 h-8 rounded-md p-1 border-gray-300 hover:bg-gray-100 "
                          onClick={() => handleEditClick(appointment)}
                        >
                          <FaEdit className="h-4 w-4 text-blue-600" />
                        </Button>

                        <Button
                          variant="outlined"
                          size="small"
                          className="w-8 h-8 rounded-md p-1 border-gray-300 hover:bg-gray-100 "
                        >
                          <PiVideoCameraBold className="h-4 w-4 text-green-600" />
                        </Button>

                        <Button
                          variant="outlined"
                          size="small"
                          className="w-8 h-8 rounded-md p-1 border-gray-300 hover:bg-gray-100 "
                          onClick={() => handleDeleteAppointment(appointment.id)}
                        >
                          <RiDeleteBin6Line className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Add modal */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth>
        <DialogTitle>Add New Appointment</DialogTitle>
        <DialogContent className="space-y-4">
          <TextField
            fullWidth
            label="Customer Name"
            name="customer"
            value={newAppointment.customer}
            onChange={handleInputChange}
            margin="dense"
          />
          <TextField
            fullWidth
            label="Contact"
            name="contact"
            value={newAppointment.contact}
            onChange={handleInputChange}
            margin="dense"
          />
          <TextField
            fullWidth
            type="date"
            name="date"
            value={newAppointment.date}
            onChange={handleInputChange}
            margin="dense"
          />
          <TextField
            fullWidth
            type="time"
            name="time"
            value={newAppointment.time}
            onChange={handleInputChange}
            margin="dense"
          />
          <TextField
            fullWidth
            label="Duration"
            name="duration"
            value={newAppointment.duration}
            onChange={handleInputChange}
            margin="dense"
          />
          <TextField
            fullWidth
            label="Type"
            name="type"
            value={newAppointment.type}
            onChange={handleInputChange}
            margin="dense"
          />
          <Select
            fullWidth
            name="status"
            value={newAppointment.status}
            onChange={handleInputChange}
            margin="dense"
            sx={{ mt: 1 }}
          >
            <MenuItem value="Confirmed">Confirmed</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Cancelled">Cancelled</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions sx={{ m: 1 }}>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddAppointment}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit modal */}
      <Dialog
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        fullWidth
      >
        <DialogTitle>Edit Appointment</DialogTitle>
        <DialogContent className="space-y-4">
          {editAppointment && (
            <>
              <TextField
                fullWidth
                label="Customer Name"
                name="customer"
                value={editAppointment.customer}
                onChange={handleEditInputChange}
                margin="dense"
              />
              <TextField
                fullWidth
                label="Contact"
                name="contact"
                value={editAppointment.contact}
                onChange={handleEditInputChange}
                margin="dense"
              />
              <TextField
                fullWidth
                type="date"
                name="date"
                value={editAppointment.date}
                onChange={handleEditInputChange}
                margin="dense"
              />
              <TextField
                fullWidth
                type="time"
                name="time"
                value={editAppointment.time}
                onChange={handleEditInputChange}
                margin="dense"
              />
              <TextField
                fullWidth
                label="Duration"
                name="duration"
                value={editAppointment.duration}
                onChange={handleEditInputChange}
                margin="dense"
              />
              <TextField
                fullWidth
                label="Type"
                name="type"
                value={editAppointment.type}
                onChange={handleEditInputChange}
                margin="dense"
              />
              <Select
                fullWidth
                name="status"
                value={editAppointment.status}
                onChange={handleEditInputChange}
                margin="dense"
                sx={{ mt: 1 }}
              >
                <MenuItem value="Confirmed">Confirmed</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
              </Select>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ m: 1 }}>
          <Button onClick={() => setOpenEditModal(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdateAppointment}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AppointmentSchedule;
