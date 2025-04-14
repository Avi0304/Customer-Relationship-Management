import React from "react";
import { useState, useContext } from "react";
import {
  FaUsers,
  FaChartBar,
  FaClock,
  FaUserPlus,
  FaRupeeSign,
  FaCalendar,
} from "react-icons/fa";
import { BiPlus, BiCalendar } from "react-icons/bi";
import { FaEdit, FaSearch } from "react-icons/fa";
import { BsCameraVideo } from "react-icons/bs";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoCheckmarkCircleSharp } from "react-icons/io5";
import { HiBuildingOffice } from "react-icons/hi2";
import SalegraphDark from "./assets/dark-sale.png";
import SalegraphLight from "./assets/light-sale.png";
import CustomerLight from "./assets/light-customer.png";
import CustomerDark from "./assets/dark-customer.png";
import { ThemeContext } from "../../context/ThemeContext";
import {
  Button,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  Tabs,
  Tab,
} from "@mui/material";

function PowerfulDash() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [tabValue, setTabValue] = useState(0);
  const handleTabChange = (event, newValue) => setTabValue(newValue);

  const tasks = [
    {
      title: "Fix login issue in CRM app",
      date: "25-03-2025",
      company: "Tata Consultancy Services",
      status: "pending",
    },
    {
      title: "Implement authentication in React project",
      date: "29-03-2025",
      company: "HCL Technologies",
      status: "in-progress",
    },
    {
      title: "Deploy backend services to AWS",
      date: "01-04-2025",
      company: "Wipro Technologies",
      status: "pending",
    },
  ];

  const getBorderClass = (status) => {
    switch (status) {
      case "pending":
        return "border-yellow-500";
      case "in-progress":
        return "border-red-500";
      case "completed":
        return "border-green-500";
      default:
        return "border-gray-300";
    }
  };

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
   const { mode } = useContext(ThemeContext);

  const leads = [
    {
      name: "Amit Sharma",
      email: "amit.sharma@example.com",
      phone: "9876543210",
      status: "New",
    },
    {
      name: "Priya Verma",
      email: "priya.verma@example.com",
      phone: "9865432198",
      status: "Contacted",
    },
    {
      name: "Rajesh Kumar",
      email: "rajesh.kumar@example.com",
      phone: "8765432109",
      status: "Converted",
    },
    {
      name: "Neha Gupta",
      email: "neha.gupta@example.com",
      phone: "9754321098",
      status: "New",
    },
    {
      name: "Vikram Singh",
      email: "vikram.singh@example.com",
      phone: "8643210987",
      status: "Contacted",
    },
    {
      name: "Anjali Mehta",
      email: "anjali.mehta@example.com",
      phone: "7532109876",
      status: "Converted",
    },
    {
      name: "Suresh Patel",
      email: "suresh.patel@example.com",
      phone: "6421098765",
      status: "New",
    },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case "New":
        return "bg-blue-500";
      case "Contacted":
        return "bg-yellow-500";
      case "Converted":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const appointments = [
    {
      customer: "L&T Infotech",
      contact: "Rahul Kapoor",
      type: "Strategy Session",
      date: "2025-02-20",
      time: "4:00 PM",
      duration: "30 min",
      status: "Confirmed",
    },
    {
      customer: "TCS",
      contact: "John Smith",
      type: "Sales Demos",
      date: "2025-03-10",
      time: "4:28 AM",
      duration: "20 min",
      status: "Pending",
    },
    {
      customer: "Mahindra IT",
      contact: "Anjali Desai",
      type: "Technical Review",
      date: "2025-02-25",
      time: "1:30 PM",
      duration: "45 min",
      status: "Confirmed",
    },
    {
      customer: "Wipro Tech",
      contact: "Sandeep Menon",
      type: "Business Meeting",
      date: "2025-02-28",
      time: "9:00 AM",
      duration: "60 min",
      status: "Confirmed",
    },
  ];

  const filteredAppointments = appointments.filter((appt) => {
    const appointmentDate = new Date(appt.date);
    const today = new Date();

    if (tabValue === 1) return appointmentDate < today; // Past appointments
    if (tabValue === 2) return appointmentDate >= today; // Upcoming appointments
    return true; // "All" appointments
  });

  return (
    <section className="w-full mx-auto py-12 md:py-24 lg:py-25  xl:py-15  2xl:py-40 bg-gray-50 dark:bg-gray-900/60">
      <div className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-4 text-center">
        <h2 className="text-3xl font-bold leading-[1.1] text-black sm:text-3xl md:text-5xl dark:text-white">
          Powerful Dashboard
        </h2>
        <p className="max-w-[85%] text-gray-600 sm:text-lg dark:text-gray-400">
          Get a complete overview of your business with our intuitive dashboard.
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="mx-auto max-w-4xl mt-12">
        <div className="grid grid-cols-4 bg-white dark:bg-gray-900/60 shadow-md rounded-lg overflow-hidden">
          {["dashboard", "tasks", "leads", "appointments",].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 text-center font-medium transition-all duration-300 ${activeTab === tab
                  ? "bg-green-600 text-white shadow-md rounded-md" // Active Tab
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="mt-6 bg-white dark:bg-gray-800 dark:border-gray-700 p-6 rounded-lg shadow-lg">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  title: "Total Revenue",
                  value: "$45,231.89",
                  change: "+20.1%",
                  icon: <FaRupeeSign />,
                },
                {
                  title: "Sales",
                  value: "+12,234",
                  change: "+19%",
                  icon: <FaChartBar />,
                },
                {
                  title: "Active Customers",
                  value: "+573",
                  change: "+201",
                  icon: <FaUsers />,
                },
                {
                  title: "Active Deals",
                  value: "+24",
                  change: "+4",
                  icon: <FaUserPlus />,
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="p-4 bg-white dark:bg-[#1B222D] rounded-lg shadow-md"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-medium dark:text-gray-100">{item.title}</h3>
                    <div className="text-xl text-gray-500 dark:text-gray-300">{item.icon}</div>
                  </div>
                  <p className="text-2xl font-bold mt-2 dark:text-gray-100">{item.value}</p>
                  <p className="text-xs text-green-500">
                    {item.change} from last month
                  </p>
                </div>
              ))}
            </div>

            {/* Sales Overview */}
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {/* Sales Overview */}
              <div className="bg-white dark:bg-[#1B222D] p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-bold">Sales Overview</h3>
                <div className="w-full h-40 mt-3 rounded-lg flex items-center justify-center overflow-hidden">
                  <img
                    src={mode === 'dark' ? SalegraphDark : SalegraphLight}
                    alt="Sales Graph"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Customer Segments */}
              <div className="bg-white p-6 rounded-lg shadow-md dark:bg-[#1B222D]">
                <h3 className="text-lg font-bold">Customer Segments</h3>
                <div className="w-full h-40 mt-3 rounded-lg flex items-center justify-center overflow-hidden">
                  <img
                    src={mode === 'dark' ? CustomerDark : CustomerLight}
                    alt="Customer Segments"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === "tasks" && (
          <div className="mt-6 bg-white dark:bg-gray-800 dark:border-gray-700 p-6 rounded-lg shadow-lg">
            {/* Header Section */}
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">Task List</h3>
              <Button
                variant="contained"
                color="primary"
                size="medium"
                startIcon={<BiPlus />}
              >
                Add Task
              </Button>
            </div>

            {/* Filter Buttons */}
            <div className="mt-4 flex justify-center  gap-4">
              <button className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md">
                All
              </button>
              <button className="px-4 py-2 bg-gray-400 text-white rounded-md shadow-md">
                Pending
              </button>
              <button className="px-4 py-2 bg-gray-400 text-white rounded-md shadow-md">
                Completed
              </button>
            </div>

            {/* Task List */}
            <div className="mt-4 space-y-4 ">
              {tasks.map((task, index) => (
                <div
                  key={index}
                  className={`p-4 border-l-4 rounded-lg shadow-md flex justify-between items-center dark:bg-[#1B222D] ${getBorderClass(
                    task.status
                  )}`}
                >
                  <div>
                    <h4 className="text-lg font-semibold">{task.title}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-300 flex items-center gap-2">
                      <BiCalendar /> {task.date}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-300 flex items-center gap-2">
                      {" "}
                      <HiBuildingOffice /> {task.company}
                    </p>
                  </div>
                  <div className="flex gap-5">
                    <button className="text-blue-500 hover:text-blue-700 text-lg">
                      <FaEdit />
                    </button>
                    <button className="text-red-500 hover:text-red-700 text-lg">
                      <RiDeleteBin6Line />
                    </button>
                    <button className="text-green-500 hover:text-green-700 text-lg">
                      <IoCheckmarkCircleSharp />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Leads Tab */}
        {activeTab === "leads" && (
          <div className="mt-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            {/* Top Bar */}
            <div className="flex justify-between items-center mb-4">
              {/* Search and Filter */}
              <div className="flex gap-4">
                {/* Material-UI Search Input */}
                <TextField
                  variant="outlined"
                  placeholder="Search Leads"
                  size="small"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FaSearch className="text-gray-500" />
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Material-UI Dropdown for Status */}
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  size="small"
                  className="w-40"
                >
                  <MenuItem value="All Status">All Status</MenuItem>
                  <MenuItem value="New">New</MenuItem>
                  <MenuItem value="Contacted">Contacted</MenuItem>
                  <MenuItem value="Converted">Converted</MenuItem>
                </Select>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="contained"
                  color="primary"
                  size="medium"
                  startIcon={<BiPlus />}
                >
                  Add Task
                </Button>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: "#9C27B0", color: "white" }}
                >
                  EXPORT TO EXCEL
                </Button>
              </div>
            </div>

            {/* Leads Table */}
            <div className="overflow-x-auto">
              <table className="w-full rounded-lg dark:bg-[#1B222D]">
                <thead className="bg-gray-200 dark:bg-gray-700">
                  <tr>
                    <th className="p-3 text-center">Name</th>
                    <th className="p-3 text-center">Email</th>
                    <th className="p-3 text-center">Phone</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leads
                    .filter(
                      (lead) =>
                        lead.name
                          .toLowerCase()
                          .includes(search.toLowerCase()) ||
                        lead.email
                          .toLowerCase()
                          .includes(search.toLowerCase()) ||
                        lead.phone.includes(search)
                    )
                    .filter(
                      (lead) =>
                        statusFilter === "All Status" ||
                        lead.status === statusFilter
                    )
                    .map((lead, index) => (
                      <tr key={index} className="border-b  border-gray-300 dark:border-gray-700">
                        <td className="p-3 text-center dark:text-gray-300">{lead.name}</td>
                        <td className="p-3 text-center dark:text-gray-300">{lead.email}</td>
                        <td className="p-3 text-center dark:text-gray-300">{lead.phone}</td>
                        <td className="p-3 text-center dark:text-gray-300">
                          <span
                            className={`px-3 py-1 text-white rounded-full text-sm ${getStatusBadge(
                              lead.status
                            )}`}
                          >
                            {lead.status}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex gap-4 justify-center">
                            <button className="text-blue-500 hover:text-blue-700 text-lg">
                              <FaEdit />
                            </button>
                            <button className="text-red-500 hover:text-red-700 text-lg">
                              <RiDeleteBin6Line />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Calendar Tab */}
        {activeTab === "appointments" && (
          <div className="mt-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            {/* Search and Add Button */}
            <div className="flex justify-between items-center mb-4">
              <TextField
                variant="outlined"
                placeholder="Search Appointments"
                size="small"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaSearch className="text-gray-500" />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                variant="contained"
                color="primary"
                size="medium"
                startIcon={<BiPlus />}
              >
                ADD APPOINTMENT
              </Button>
            </div>

            {/* Tabs */}
            <Tabs value={0} indicatorColor="primary">
              <Tab label="ALL" className="font-bold" />
              <Tab label="PAST" />
              <Tab label="UPCOMING" />
            </Tabs>

            {/* Table */}
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full bg-white dark:bg-[#1B222D]">
                <thead className="bg-gray-200 dark:bg-gray-700">
                  <tr>
                    <th className="py-3 px-4 text-left">Customer</th>
                    <th className="py-3 px-4 text-left">Contact</th>
                    <th className="py-3 px-4 text-left">Type</th>
                    <th className="py-3 px-4 text-left">Date</th>
                    <th className="py-3 px-4 text-left">Time</th>
                    <th className="py-3 px-4 text-left">Duration</th>
                    <th className="py-3 px-4 text-left">Status</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map((appt, index) => (
                    <tr key={index} className="border-b  border-gray-300 border-gray-700">
                      <td className="py-3 px-4 dark:text-gray-300">{appt.customer}</td>
                      <td className="py-3 px-4 dark:text-gray-300">{appt.contact}</td>
                      <td className="py-3 px-4 dark:text-gray-300">{appt.type}</td>
                      <td className="py-3 px-4 dark:text-gray-300">{appt.date}</td>
                      <td className="py-3 px-4 dark:text-gray-300">{appt.time}</td>
                      <td className="py-3 px-4 dark:text-gray-300">{appt.duration}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-white text-xs ${appt.status === "Confirmed"
                              ? "bg-green-500"
                              : "bg-yellow-500"
                            }`}
                        >
                          {appt.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center ">
                        <div className="flex gap-4 justify-center">
                          <button className="text-blue-500 hover:text-blue-700 text-lg">
                            <FaEdit />
                          </button>
                          <button className="text-green-500 hover:text-green-700 text-lg">
                            <BsCameraVideo />
                          </button>
                          <button className="text-red-500 hover:text-red-700 text-lg">
                            <RiDeleteBin6Line />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default PowerfulDash;
