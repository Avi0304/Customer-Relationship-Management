import React, { useState, useEffect } from "react";
import {
  Typography,
  TextField,
  Button,
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
} from "@mui/material";
import { Search } from "@mui/icons-material"; // Added icons
import { BiPlus } from "react-icons/bi";
import { FaEdit } from "react-icons/fa";
import { PiVideoCameraBold } from "react-icons/pi";
import { RiDeleteBin6Line } from "react-icons/ri";
import dayjs from "dayjs";
import { gapi } from "gapi-script";

const AppointmentSchedule = () => {
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
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [openModal, setOpenModal] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    customer: "",
    contact: "",
    date: "",
    time: "",
    duration: "",
    status: "Pending",
    type: "",
  });
  const [editAppointment, setEditAppointment] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [tabValue, setTabValue] = useState(0);

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
    setAppointments(
      appointments.filter((appointment) => appointment.id !== id)
    );
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  // Get today's date for comparison
  const today = new Date().toISOString().split("T")[0];

  // Filtered appointments based on customer, contact, and type
  const filteredAppointments = appointments.filter(
    (appointment) =>
      (appointment.customer.toLowerCase().includes(filter.toLowerCase()) ||
        appointment.contact.toLowerCase().includes(filter.toLowerCase())) &&
      (statusFilter === "All Status" || appointment.status === statusFilter)
  );

  const upcomingAppointments = filteredAppointments.filter(
    (appointment) => appointment.date >= today
  );
  // Filter for past appointments (date < today)
  const pastAppointments = filteredAppointments.filter(
    (appointment) => appointment.date < today
  );

  const CLIENT_ID =
    "147226171626-paikqrlke6klt0qv9knh21hkmnf8dmph.apps.googleusercontent.com";
  const API_KEY = "AIzaSyDhCX4zzrbsMr-c3Ot92ywLNv-IhUDBLsY";
  const SCOPES = "https://www.googleapis.com/auth/calendar.events";

  useEffect(() => {
    function start() {
      gapi.load("client:auth2", async () => {
        try {
          await gapi.client.init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            discoveryDocs: [
              "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
            ],
            scope: SCOPES,
          });

          // Ensure the Calendar API is loaded
          await gapi.client.load("calendar", "v3");
          console.log("Google API Initialized and Calendar API loaded.");
        } catch (error) {
          console.error("Error initializing Google API:", error);
        }
      });
    }
    start();
  }, []);

  const scheduleGoogleMeet = async (appointment) => {
    try {
      if (!gapi.client || !gapi.client.calendar) {
        alert(
          "Google Calendar API is not loaded yet. Please wait and try again."
        );
        return;
      }

      if (!gapi.auth2 || !gapi.auth2.getAuthInstance()) {
        alert("Google API authentication is not initialized.");
        return;
      }

      const authInstance = gapi.auth2.getAuthInstance();
      const user = await authInstance.signIn();

      if (!user) {
        alert("Sign-in failed. Please try again.");
        return;
      }

      // Convert times and log them for debugging
      const startDateTime = `${appointment.date}T${convertTo24HourFormat(
        appointment.time
      )}`;
      const endDateTime = calculateEndTime(
        appointment.date,
        appointment.time,
        appointment.duration
      );

      console.log("Start Time:", startDateTime);
      console.log("End Time:", endDateTime);

      // Insert event into Google Calendar
      const response = await gapi.client.calendar.events.insert({
        calendarId: "primary",
        resource: {
          summary: `Meeting with ${appointment.contact}`,
          description: `Appointment Type: ${appointment.type}`,
          start: {
            dateTime: startDateTime,
            timeZone: "Asia/Kolkata",
          },
          end: {
            dateTime: endDateTime,
            timeZone: "Asia/Kolkata",
          },
          attendees: [{ email: "client@example.com" }],
          conferenceData: {
            createRequest: {
              requestId: `${appointment.id}-meet`,
              conferenceSolutionKey: { type: "hangoutsMeet" },
            },
          },
        },
        conferenceDataVersion: 1,
      });

      // Extract and open the Google Meet link
      const meetLink = response.result?.hangoutLink;
      if (meetLink) {
        alert(`Google Meet Scheduled: ${meetLink}`);
        console.log("Meeting Link:", meetLink);
        window.open(meetLink, "_blank", "noopener,noreferrer");
      } else {
        throw new Error("Failed to generate Meet link.");
      }
    } catch (error) {
      console.error("Error scheduling meeting:", error);
      alert("Failed to schedule meeting. Check console for details.");
    }
  };

  const convertTo24HourFormat = (time) => {
    console.log("Original Time:", time); // Debugging log
    const [hours, minutes, period] = time.match(/(\d+):(\d+) (\w+)/).slice(1);
    let hours24 =
      period === "PM" && hours !== "12" ? parseInt(hours) + 12 : hours;
    hours24 = period === "AM" && hours === "12" ? "00" : hours24;
    const formattedTime = `${hours24}:${minutes}:00`;
    console.log("Converted Time (24-hour format):", formattedTime); // Debugging log
    return formattedTime;
  };

  const calculateEndTime = (date, time, duration) => {
    const startTime = new Date(`${date}T${convertTo24HourFormat(time)}`);
    console.log(
      "Start Time for End Time Calculation:",
      startTime.toISOString()
    ); // Debugging log

    const durationMinutes = parseInt(duration.split(" ")[0]);
    startTime.setMinutes(startTime.getMinutes() + durationMinutes);

    console.log("Calculated End Time:", startTime.toISOString()); // Debugging log
    return startTime.toISOString();
  };

  return (
    <div className="mt-0">
      {/* Search and Filter Section */}
      <div className="mb-5 flex flex-wrap items-center gap-4">
        {/* Search Input */}
        <div className="w-full sm:w-1/2 md:w-1/3">
          <TextField
            label="Search Appointments"
            variant="outlined"
            value={filter}
            onChange={handleFilterChange}
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

        {/* Buttons */}
        <div className="w-full sm:w-auto flex items-center gap-3 justify-end flex-1 mt-0 pt-0">
          <Button
            variant="contained"
            color="primary"
            startIcon={<BiPlus size={20} />}
            onClick={() => setOpenModal(true)}
          >
            Add Appointment
          </Button>
        </div>
      </div>

      <Tabs
        value={tabValue}
        onChange={(e, newValue) => setTabValue(newValue)}
        sx={{ mb: 2 }}
      >
        <Tab label="Upcoming" />
        <Tab label="Past" />
        <Tab label="All" />
      </Tabs>

      {/* Appointment Table */}
      {tabValue === 0 && (
        <TableContainer component={Paper}>
          {upcomingAppointments.length === 0 ? (
            <Box p={3} display="flex" justifyContent="center">
              <Typography variant="h6" color="textSecondary">
                No upcoming appointments.
              </Typography>
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#e0e0e0" }}>
                  {" "}
                  {/* Light gray background */}
                  <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>
                    Customer
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>
                    Contact
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>
                    Date
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>
                    Time
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>
                    Duration
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>
                    Status
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      fontSize: "1rem",
                      textAlign: "center",
                    }}
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {upcomingAppointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>{appointment.customer}</TableCell>
                    <TableCell>{appointment.contact}</TableCell>
                    <TableCell>{appointment.date}</TableCell>
                    <TableCell>{appointment.time}</TableCell>
                    <TableCell>{appointment.duration}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
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
                      <div className="flex flex-wrap gap-3 justify-start sm:flex-row">
                        <Button
                          variant="outlined"
                          size="small"
                          className="w-8 h-8 rounded-md p-1 border-gray-300 hover:bg-gray-100 flex items-center justify-center"
                          onClick={() => handleEditClick(appointment)}
                        >
                          <FaEdit className="h-4 w-4 text-blue-600" />
                        </Button>

                        <Button
                          variant="outlined"
                          size="small"
                          className="w-8 h-8 rounded-md p-1 border-gray-300 hover:bg-gray-100 flex items-center justify-center"
                          onClick={() => scheduleGoogleMeet(appointment)}
                        >
                          <PiVideoCameraBold className="h-4 w-4 text-green-600" />
                        </Button>

                        <Button
                          variant="outlined"
                          size="small"
                          className="w-8 h-8 rounded-md p-1 border-gray-300 hover:bg-gray-100 flex items-center justify-center"
                          onClick={() =>
                            handleDeleteAppointment(appointment.id)
                          }
                        >
                          <RiDeleteBin6Line className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TableContainer>
      )}

      {tabValue === 1 && (
        <TableContainer component={Paper}>
          {pastAppointments.length === 0 ? (
            <Box p={3} display="flex" justifyContent="center">
              <Typography variant="h6" color="textSecondary">
                No past appointments.
              </Typography>
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#e0e0e0" }}>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>
                    Customer
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>
                    Contact
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>
                    Date
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>
                    Time
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>
                    Duration
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>
                    Status
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "1rem", textAlign: 'center' }}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pastAppointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>{appointment.customer}</TableCell>
                    <TableCell>{appointment.contact}</TableCell>
                    <TableCell>{appointment.date}</TableCell>
                    <TableCell>{appointment.time}</TableCell>
                    <TableCell>{appointment.duration}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
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
                      <div className="flex flex-wrap gap-3 justify-start sm:flex-row">
                        <Button
                          variant="outlined"
                          size="small"
                          className="w-8 h-8 rounded-md p-1 border-gray-300 hover:bg-gray-100 flex items-center justify-center"
                          onClick={() => handleEditClick(appointment)}
                        >
                          <FaEdit className="h-4 w-4 text-blue-600" />
                        </Button>

                        <Button
                          variant="outlined"
                          size="small"
                          className="w-8 h-8 rounded-md p-1 border-gray-300 hover:bg-gray-100 flex items-center justify-center"
                          onClick={() => scheduleGoogleMeet(appointment)}
                        >
                          <PiVideoCameraBold className="h-4 w-4 text-green-600" />
                        </Button>

                        <Button
                          variant="outlined"
                          size="small"
                          className="w-8 h-8 rounded-md p-1 border-gray-300 hover:bg-gray-100 flex items-center justify-center"
                          onClick={() =>
                            handleDeleteAppointment(appointment.id)
                          }
                        >
                          <RiDeleteBin6Line className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TableContainer>
      )}

      {tabValue === 2 && (
        <TableContainer component={Paper}>
          {filteredAppointments.length === 0 ? (
            <Box p={3} display="flex" justifyContent="center">
              <Typography variant="h6" color="textSecondary">
                No appointments available.
              </Typography>
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#e0e0e0" }}>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>
                    Customer
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>
                    Contact
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>
                    Date
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>
                    Time
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>
                    Duration
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "1rem", }}>
                    Status
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "1rem", textAlign: 'center' }}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAppointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>{appointment.customer}</TableCell>
                    <TableCell>{appointment.contact}</TableCell>
                    <TableCell>{appointment.date}</TableCell>
                    <TableCell>{appointment.time}</TableCell>
                    <TableCell>{appointment.duration}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
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
                      <div className="flex flex-wrap gap-3 justify-start sm:flex-row">
                        <Button
                          variant="outlined"
                          size="small"
                          className="w-8 h-8 rounded-md p-1 border-gray-300 hover:bg-gray-100 flex items-center justify-center"
                          onClick={() => handleEditClick(appointment)}
                        >
                          <FaEdit className="h-4 w-4 text-blue-600" />
                        </Button>

                        <Button
                          variant="outlined"
                          size="small"
                          className="w-8 h-8 rounded-md p-1 border-gray-300 hover:bg-gray-100 flex items-center justify-center"
                          onClick={() => scheduleGoogleMeet(appointment)}
                        >
                          <PiVideoCameraBold className="h-4 w-4 text-green-600" />
                        </Button>

                        <Button
                          variant="outlined"
                          size="small"
                          className="w-8 h-8 rounded-md p-1 border-gray-300 hover:bg-gray-100 flex items-center justify-center"
                          onClick={() =>
                            handleDeleteAppointment(appointment.id)
                          }
                        >
                          <RiDeleteBin6Line className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TableContainer>
      )}

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
