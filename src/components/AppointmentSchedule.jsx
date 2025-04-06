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
import { useMediaQuery } from "@mui/material";
import { gapi } from "gapi-script";
import Swal from "sweetalert2";
import axios from "axios";

const AppointmentSchedule = () => {
  const [appointments, setAppointments] = useState([]);
  const [pastappointments, setpastappointment] = useState([]);
  const [upcomigappointment, setupcomingappointment] = useState([]);

  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [openModal, setOpenModal] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    customer: "",
    contact: "",
    date: "",
    time: "",
    email: "",
    duration: "",
    status: "Pending",
    type: "",
  });
  const [editAppointment, setEditAppointment] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const isSmallScreen = useMediaQuery("(max-width: 820px)");
  const isMediumScreen = useMediaQuery("(max-width: 1024px)");
  const currentTheme = localStorage.getItem("theme") || "light";

  useEffect(() => {
    fetchAll();
    fetchPast();
    fetchUpcoming();
  }, []);

  const fetchAll = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/Appointment/"
      );

      if (Array.isArray(response.data)) {
        setAppointments(response.data);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setAppointments([]);
    }
  };

  const fetchPast = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/Appointment/past"
      );

      if (Array.isArray(response.data.pastappointment)) {
        setpastappointment(response.data.pastappointment);
      } else {
        setpastappointment([]);
      }
    } catch (error) {
      console.error("Error in fetching past appointments:", error);
      setpastappointment([]);
    }
  };

  const fetchUpcoming = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/Appointment/upcoming"
      );

      if (Array.isArray(response.data.upcomingappointment)) {
        setupcomingappointment(response.data.upcomingappointment);
      } else {
        setupcomingappointment([]);
      }
    } catch (error) {
      console.error("Error in fetching the upcoming appointments: ", error);
      setupcomingappointment([]);
    }
  };

  const handleInputChange = (e) => {
    setNewAppointment({ ...newAppointment, [e.target.name]: e.target.value });
  };

  const handleAddAppointment = async () => {
    if (
      !newAppointment.customer ||
      !newAppointment.contact ||
      !newAppointment.date ||
      !newAppointment.time ||
      !newAppointment.duration ||
      !newAppointment.type ||
      !newAppointment.type
    ) {
      Swal.fire(
        "Oops!",
        "Please fill in all fields before adding the Appointment.",
        "error"
      );
      setOpenModal(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/Appointment/add",
        {
          customer: newAppointment.customer,
          contact: newAppointment.contact,
          date: newAppointment.date,
          email: newAppointment.email,
          time: newAppointment.time,
          duration: newAppointment.duration,
          status: "Pending",
          type: newAppointment.type,
        }
      );
      setAppointments([
        ...appointments,
        { id: response.data.id, ...newAppointment },
      ]);

      setOpenModal(false);

      setNewAppointment({
        customer: "",
        contact: "",
        date: "",
        email: "",
        time: "",
        duration: "",
        status: "Pending",
        type: "",
      });

      Swal.fire({
        title: "Added!",
        text: "New Appointment has been added successfully.",
        icon: "success",
        iconColor: currentTheme === "dark" ? "#4ade80" : "green",
        background: currentTheme === "dark" ? "#1e293b" : "#fff",
        color: currentTheme === "dark" ? "#f8fafc" : "#000",
        timer: 4000,
        timerProgressBar: true,
        showConfirmButton: false,
      });

      fetchAll();
      fetchPast();
      fetchUpcoming();
    } catch (error) {
      console.error(
        "Error adding appointment:",
        error.response?.data || error.message
      );
      Swal.fire(
        "Error",
        error.response?.data?.message ||
          "Failed to add appointment. Try again later.",
        "error"
      );
    }
  };

  const handleEditClick = (appointment) => {
    setEditAppointment(appointment);
    setOpenEditModal(true);
  };

  const handleEditInputChange = (e) => {
    setEditAppointment({ ...editAppointment, [e.target.name]: e.target.value });
  };

  const handleUpdateAppointment = async () => {
    try {
      if (!editAppointment._id) {
        Swal.fire("Error", "Invalid appointment ID.", "error");
        return;
      }

      const response = await axios.put(
        `http://localhost:8080/api/Appointment/update/${editAppointment._id}`,
        editAppointment
      );

      setAppointments(
        appointments.map((appt) =>
          appt._id === editAppointment._id ? response.data.appointment : appt
        )
      );

      setOpenEditModal(false);

      Swal.fire({
        title: "Updated!",
        text: "Appointment has been updated successfully.",
        icon: "success",
        iconColor: currentTheme === "dark" ? "#4ade80" : "green",
        background: currentTheme === "dark" ? "#1e293b" : "#fff",
        color: currentTheme === "dark" ? "#f8fafc" : "#000",
        timer: 4000,
        timerProgressBar: true,
        showConfirmButton: false,
      });

      fetchAll();
      fetchPast();
      fetchUpcoming();
    } catch (error) {
      console.error(
        "Error updating appointment:",
        error.response?.data || error.message
      );
      Swal.fire(
        "Error",
        error.response?.data?.message ||
          "Failed to update appointment. Try again later.",
        "error"
      );
    }
  };

  const handleDeleteAppointment = async (id) => {
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
          await axios.delete(
            `http://localhost:8080/api/Appointment/delete/${id}`
          );

          setAppointments((prev) =>
            prev.filter((appointment) => appointment._id !== id)
          );

          fetchAll();
          fetchPast();
          fetchUpcoming();

          Swal.fire({
            title: "Deleted!",
            text: "The Appointment has been deleted.",
            icon: "success",
            iconColor: currentTheme === "dark" ? "#4ade80" : "green",
            background: currentTheme === "dark" ? "#1e293b" : "#fff",
            color: currentTheme === "dark" ? "#f8fafc" : "#000",
            timer: 4000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
        } catch (error) {
          console.error(
            "Error deleting appointment:",
            error.response?.data || error.message
          );
          Swal.fire(
            "Error",
            error.response?.data?.message ||
              "Failed to delete appointment. Try again later.",
            "error"
          );
        }
      }
    });
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  // Get today's date for comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filteredAppointments = appointments.filter(
    (appointment) =>
      (appointment.customer.toLowerCase().includes(filter.toLowerCase()) ||
        appointment.contact.toLowerCase().includes(filter.toLowerCase())) &&
      (statusFilter === "All Status" || appointment.status === statusFilter)
  );

  const filteredPastAppointments = pastappointments.filter((appointment) => {
    const matchesText =
      appointment.customer.toLowerCase().includes(filter.toLowerCase()) ||
      appointment.contact.toLowerCase().includes(filter.toLowerCase());

    const matchesStatus =
      statusFilter === "All Status" || appointment.status === statusFilter;

    return matchesText && matchesStatus;
  });

  // Filter function for upcoming appointments
  const filteredUpcomingAppointments = upcomigappointment.filter(
    (appointment) => {
      const matchesText =
        appointment.customer.toLowerCase().includes(filter.toLowerCase()) ||
        appointment.contact.toLowerCase().includes(filter.toLowerCase());

      const matchesStatus =
        statusFilter === "All Status" || appointment.status === statusFilter;

      return matchesText && matchesStatus;
    }
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
        Swal.fire(
          "Error",
          "Google Calendar API is not loaded yet. Please wait and try again.",
          "error"
        );
        return;
      }

      if (!gapi.auth2 || !gapi.auth2.getAuthInstance()) {
        Swal.fire(
          "Error",
          "Google API authentication is not initialized.",
          "error"
        );
        return;
      }

      const authInstance = gapi.auth2.getAuthInstance();
      const user = await authInstance.signIn();

      if (!user) {
        Swal.fire("Error", "Sign-in failed. Please try again.", "error");
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
          attendees: [{ email: appointment.email }],
          conferenceData: {
            createRequest: {
              requestId: `${appointment._id}-meet`,
              conferenceSolutionKey: { type: "hangoutsMeet" },
            },
          },
        },
        conferenceDataVersion: 1,
      });

      // Extract and open the Google Meet link
      const meetLink = response.result?.hangoutLink;
      if (meetLink) {

        await axios.post("http://localhost:8080/api/Appointment/send-meeting", {
          email: appointment.email,
          customer: appointment.customer,
          contact: appointment.contact,
          type: appointment.type,
          date: appointment.date,
          time: appointment.time,
          duration: appointment.duration,
          meetLink: meetLink,
        });


        Swal.fire({
          title: "Google Meet Scheduled!",
          text: `Meeting link: ${meetLink}`,
          icon: "success",
          iconColor: currentTheme === "dark" ? "#4ade80" : "green",
          background: currentTheme === "dark" ? "#1e293b" : "#fff",
          color: currentTheme === "dark" ? "#f8fafc" : "#000",
          showCancelButton: true,
          confirmButtonText: "Open Meeting",
          cancelButtonText: "Close",
        }).then((result) => {
          if (result.isConfirmed) {
            window.open(meetLink, "_blank", "noopener,noreferrer");
          }
        });
      } else {
        throw new Error("Failed to generate Meet link.");
      }
    } catch (error) {
      console.error("Error scheduling meeting:", error);
      Swal.fire(
        "Error",
        "Failed to schedule meeting. Check console for details.",
        "error"
      );
    }
  };

  const convertTo24HourFormat = (time) => {
    console.log("Original Time:", time); // Debugging log

    if (!time) {
      console.error("Error: Time is null or undefined.");
      return "";
    }

    const match = time.match(/(\d+):(\d+) (\w+)/);
    if (!match) {
      console.error("Error: Time format is incorrect:", time);
      return "";
    }

    let [hours, minutes, period] = match.slice(1);
    hours = parseInt(hours, 10);
    minutes = minutes.padStart(2, "0");

    if (period.toUpperCase() === "PM" && hours !== 12) {
      hours += 12;
    } else if (period.toUpperCase() === "AM" && hours === 12) {
      hours = 0;
    }

    const formattedTime = `${String(hours).padStart(2, "0")}:${minutes}:00`;
    console.log("Converted Time (24-hour format):", formattedTime);

    return formattedTime;
  };

  const calculateEndTime = (date, time, duration) => {
    const formattedTime = convertTo24HourFormat(time);
    if (!formattedTime) {
      console.error("Error: Unable to convert time format.");
      return "";
    }

    const startTime = new Date(`${date}T${formattedTime}+05:30`); // Explicit IST Offset
    if (isNaN(startTime.getTime())) {
      console.error("Error: Invalid date or time value:", date, formattedTime);
      return "";
    }

    console.log(
      "Start Time for End Time Calculation:",
      startTime.toISOString()
    );

    const durationMinutes = parseInt(duration.split(" ")[0], 10) || 0;
    startTime.setMinutes(startTime.getMinutes() + durationMinutes);

    const endTimeISO = startTime.toISOString();
    console.log("Calculated End Time:", endTimeISO);

    return endTimeISO;
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
        sx={{ mb: 3, display: "flex", justifyContent: "center" }}
      >
        <Tab
          label="All"
          sx={{ fontWeight: tabValue === 0 ? "bold" : "normal" }}
        />
        <Tab
          label="Past"
          sx={{ fontWeight: tabValue === 1 ? "bold" : "normal" }}
        />
        <Tab
          label="Upcoming"
          sx={{ fontWeight: tabValue === 2 ? "bold" : "normal" }}
        />
      </Tabs>

      {/* Appointment Table */}

      {tabValue === 0 && (
        <TableContainer component={Paper} className="overflow-x-auto">
          {filteredAppointments.length === 0 ? (
            <Box p={3} display="flex" justifyContent="center">
              <Typography variant="h6" color="textSecondary">
                No appointments available.
              </Typography>
            </Box>
          ) : (
            <Table className="min-w-full">
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: (theme) =>
                      theme.palette.mode === "dark" ? "#2d2d2d" : "#e0e0e0",
                  }}
                >
                  <TableCell
                    sx={{ fontWeight: "bold", fontSize: "1rem" }}
                    align="center"
                  >
                    Company
                  </TableCell>
                  {!isSmallScreen && (
                    <TableCell
                      sx={{ fontWeight: "bold", fontSize: "1rem" }}
                      align="center"
                    >
                      Contact
                    </TableCell>
                  )}
                  {!isSmallScreen && (
                    <TableCell
                      sx={{ fontWeight: "bold", fontSize: "1rem" }}
                      align="center"
                    >
                      Type
                    </TableCell>
                  )}
                  <TableCell
                    sx={{ fontWeight: "bold", fontSize: "1rem" }}
                    align="center"
                  >
                    Date
                  </TableCell>
                  {!isSmallScreen && !isMediumScreen && (
                    <TableCell
                      sx={{ fontWeight: "bold", fontSize: "1rem" }}
                      align="center"
                    >
                      Time
                    </TableCell>
                  )}
                  {!isSmallScreen && !isMediumScreen && (
                    <TableCell
                      sx={{ fontWeight: "bold", fontSize: "1rem" }}
                      align="center"
                    >
                      Duration
                    </TableCell>
                  )}
                  <TableCell
                    sx={{ fontWeight: "bold", fontSize: "1rem" }}
                    align="center"
                  >
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
                {filteredAppointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell align="center">{appointment.customer}</TableCell>
                    {!isSmallScreen && (
                      <TableCell align="center">
                        {appointment.contact}
                      </TableCell>
                    )}
                    {!isSmallScreen && (
                      <TableCell align="center">{appointment.type}</TableCell>
                    )}
                    <TableCell align="center">{appointment.date}</TableCell>
                    {!isSmallScreen && !isMediumScreen && (
                      <TableCell align="center">{appointment.time}</TableCell>
                    )}
                    {!isSmallScreen && !isMediumScreen && (
                      <TableCell align="center">
                        {appointment.duration}
                      </TableCell>
                    )}
                    <TableCell align="center">
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
                    <TableCell className="whitespace-nowrap" align="center">
                      <div className="flex flex-wrap gap-1 justify-start sm:flex-nowrap">
                        <Button
                          size="small"
                          className="w-8 h-8 rounded-md p-1 border-gray-300 hover:bg-gray-100 flex items-center justify-center"
                          onClick={() => handleEditClick(appointment)}
                        >
                          <FaEdit className="h-5 w-5" />
                        </Button>

                        <Button
                          size="small"
                          className="w-8 h-8 rounded-md p-1 border-gray-300 hover:bg-gray-100 flex items-center justify-center"
                          onClick={() => scheduleGoogleMeet(appointment)}
                        >
                          <PiVideoCameraBold className="h-5 w-5 text-green-600" />
                        </Button>

                        <Button
                          size="small"
                          className="w-8 h-8 rounded-md p-1 border-gray-300 hover:bg-gray-100 flex items-center justify-center"
                          onClick={() =>
                            handleDeleteAppointment(appointment._id)
                          }
                        >
                          <RiDeleteBin6Line className="h-5 w-5 text-red-600" />
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
          {filteredPastAppointments.length === 0 ? (
            <Box p={3} display="flex" justifyContent="center">
              <Typography variant="h6" color="textSecondary">
                No past appointments.
              </Typography>
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: (theme) =>
                      theme.palette.mode === "dark" ? "#2d2d2d" : "#e0e0e0",
                  }}
                >
                  <TableCell
                    sx={{ fontWeight: "bold", fontSize: "1rem" }}
                    align="center"
                  >
                    Company
                  </TableCell>
                  {!isSmallScreen && (
                    <TableCell
                      sx={{ fontWeight: "bold", fontSize: "1rem" }}
                      align="center"
                    >
                      Contact
                    </TableCell>
                  )}
                  {!isSmallScreen && (
                    <TableCell
                      sx={{ fontWeight: "bold", fontSize: "1rem" }}
                      align="center"
                    >
                      Type
                    </TableCell>
                  )}
                  <TableCell
                    sx={{ fontWeight: "bold", fontSize: "1rem" }}
                    align="center"
                  >
                    Date
                  </TableCell>
                  {!isSmallScreen && !isMediumScreen && (
                    <TableCell
                      sx={{ fontWeight: "bold", fontSize: "1rem" }}
                      align="center"
                    >
                      Time
                    </TableCell>
                  )}
                  {!isSmallScreen && !isMediumScreen && (
                    <TableCell
                      sx={{ fontWeight: "bold", fontSize: "1rem" }}
                      align="center"
                    >
                      Duration
                    </TableCell>
                  )}
                  <TableCell
                    sx={{ fontWeight: "bold", fontSize: "1rem" }}
                    align="center"
                  >
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
                {filteredPastAppointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell align="center">{appointment.customer}</TableCell>
                    {!isSmallScreen && (
                      <TableCell align="center">
                        {appointment.contact}
                      </TableCell>
                    )}
                    {!isSmallScreen && (
                      <TableCell align="center">{appointment.type}</TableCell>
                    )}
                    <TableCell align="center">{appointment.date}</TableCell>
                    {!isSmallScreen && !isMediumScreen && (
                      <TableCell align="center">{appointment.time}</TableCell>
                    )}
                    {!isSmallScreen && !isMediumScreen && (
                      <TableCell align="center">
                        {appointment.duration}
                      </TableCell>
                    )}
                    <TableCell align="center">
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
                    <TableCell className="whitespace-nowrap" align="center">
                      <div className="flex flex-wrap gap-1 justify-start sm:flex-nowrap">
                        <Button
                          size="small"
                          className="w-8 h-8 rounded-md p-1 border-gray-300 hover:bg-gray-100 flex items-center justify-center"
                          onClick={() => handleEditClick(appointment)}
                        >
                          <FaEdit className="h-5 w-5" />
                        </Button>

                        <Button
                          size="small"
                          className="w-8 h-8 rounded-md p-1 border-gray-300 hover:bg-gray-100 flex items-center justify-center"
                          onClick={() => scheduleGoogleMeet(appointment)}
                        >
                          <PiVideoCameraBold className="h-5 w-5 text-green-600" />
                        </Button>

                        <Button
                          size="small"
                          className="w-8 h-8 rounded-md p-1 border-gray-300 hover:bg-gray-100 flex items-center justify-center"
                          onClick={() =>
                            handleDeleteAppointment(appointment._id)
                          }
                        >
                          <RiDeleteBin6Line className="h-5 w-5 text-red-600" />
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
          {filteredUpcomingAppointments.length === 0 ? (
            <Box p={3} display="flex" justifyContent="center">
              <Typography variant="h6" color="textSecondary">
                No upcoming appointments.
              </Typography>
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: (theme) =>
                      theme.palette.mode === "dark" ? "#2d2d2d" : "#e0e0e0",
                  }}
                >
                  <TableCell
                    sx={{ fontWeight: "bold", fontSize: "1rem" }}
                    align="center"
                  >
                    Company
                  </TableCell>
                  {!isSmallScreen && (
                    <TableCell
                      sx={{ fontWeight: "bold", fontSize: "1rem" }}
                      align="center"
                    >
                      Contact
                    </TableCell>
                  )}
                  {!isSmallScreen && (
                    <TableCell
                      sx={{ fontWeight: "bold", fontSize: "1rem" }}
                      align="center"
                    >
                      Type
                    </TableCell>
                  )}
                  <TableCell
                    sx={{ fontWeight: "bold", fontSize: "1rem" }}
                    align="center"
                  >
                    Date
                  </TableCell>
                  {!isSmallScreen && !isMediumScreen && (
                    <TableCell
                      sx={{ fontWeight: "bold", fontSize: "1rem" }}
                      align="center"
                    >
                      Time
                    </TableCell>
                  )}
                  {!isSmallScreen && !isMediumScreen && (
                    <TableCell
                      sx={{ fontWeight: "bold", fontSize: "1rem" }}
                      align="center"
                    >
                      Duration
                    </TableCell>
                  )}
                  <TableCell
                    sx={{ fontWeight: "bold", fontSize: "1rem" }}
                    align="center"
                  >
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
                {filteredUpcomingAppointments.map((appointment) => (
                  <TableRow key={appointment._id}>
                    <TableCell align="center">{appointment.customer}</TableCell>
                    {!isSmallScreen && (
                      <TableCell align="center">
                        {appointment.contact}
                      </TableCell>
                    )}
                    {!isSmallScreen && (
                      <TableCell align="center">{appointment.type}</TableCell>
                    )}
                    <TableCell align="center">{appointment.date}</TableCell>
                    {!isSmallScreen && !isMediumScreen && (
                      <TableCell align="center">{appointment.time}</TableCell>
                    )}
                    {!isSmallScreen && !isMediumScreen && (
                      <TableCell align="center">
                        {appointment.duration}
                      </TableCell>
                    )}
                    <TableCell align="center">
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
                    <TableCell className="whitespace-nowrap" align="center">
                      <div className="flex flex-wrap gap-1 justify-start sm:flex-nowrap">
                        <Button
                          size="small"
                          className="w-8 h-8 rounded-md p-1 border-gray-300 hover:bg-gray-100 flex items-center justify-center"
                          onClick={() => handleEditClick(appointment)}
                        >
                          <FaEdit className="h-5 w-5" />
                        </Button>

                        <Button
                          size="small"
                          className="w-8 h-8 rounded-md p-1 border-gray-300 hover:bg-gray-100 flex items-center justify-center"
                          onClick={() => scheduleGoogleMeet(appointment)}
                        >
                          <PiVideoCameraBold className="h-5 w-5 text-green-600" />
                        </Button>

                        <Button
                          size="small"
                          className="w-8 h-8 rounded-md p-1 border-gray-300 hover:bg-gray-100 flex items-center justify-center"
                          onClick={() =>
                            handleDeleteAppointment(appointment._id)
                          }
                        >
                          <RiDeleteBin6Line className="h-5 w-5 text-red-600" />
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
        <DialogTitle>
          <h2 className="font-bold">Add New Appointment</h2>
        </DialogTitle>
        <DialogContent className="space-y-4">
          <TextField
            fullWidth
            label="Company Name"
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
            label="Email"
            name="email"
            value={newAppointment.email}
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
          <Button
            onClick={() => setOpenModal(false)}
            sx={{ color: "gray", "&:hover": { color: "darkgray" } }}
          >
            Cancel
          </Button>
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
        <DialogTitle>
          {" "}
          <h2 className="font-bold">Edit Appointment</h2>
        </DialogTitle>
        <DialogContent className="space-y-4">
          {editAppointment && (
            <>
              <TextField
                fullWidth
                label="Company Name"
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
                label="email"
                name="email"
                value={editAppointment.email}
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
          <Button
            onClick={() => setOpenEditModal(false)}
            sx={{ color: "gray", "&:hover": { color: "darkgray" } }}
          >
            Cancel
          </Button>
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
