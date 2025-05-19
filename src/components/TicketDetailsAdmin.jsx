import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import {
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
} from "@mui/material";
import {
  LuClock,
  LuCalendar,
  LuCircleAlert,
  LuArrowLeft,
  LuLink,
  LuPlus,
} from "react-icons/lu";
import AdminSupportChat from "../components/AdminSupportChat";

const Badge = ({ label, type }) => {
  const colors = {
    high: "bg-red-500 text-white",
    medium: "bg-yellow-500 text-white",
    low: "bg-green-500 text-white",
    open: "bg-blue-500 text-white",
    closed: "bg-gray-500 text-white",
    "in progress": "bg-purple-500 text-white",
    withdrawn: "bg-pink-500 text-white",
  };

  return (
    <span
      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
        colors[type?.toLowerCase()] || "bg-gray-100 text-gray-700"
      }`}
    >
      {label}
    </span>
  );
};

const TicketDetailsAdmin = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [resources, setResources] = useState([]);
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentRequest, setCurrentRequest] = useState({ status: "Open" });
  const [isHovered, setIsHovered] = useState(false);
  const [priority, setPriority] = useState(currentRequest?.priority || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentRequest2, setCurrentRequest2] = useState({ priority: "" });

  useEffect(() => {
    if (ticket && ticket.priority) {
      setCurrentRequest2({ priority: ticket.priority });
    }
  }, [ticket]);

  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8080/api/support/${id}`
        );
        setTicket(data);
        setCurrentRequest({ status: data.status });
        console.log(data);
      } catch (err) {
        console.error("Failed to fetch ticket:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTicketDetails();
  }, [id]);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/support/resource/${id}`
        );
        setResources(res.data);
      } catch (error) {
        console.error("Failed to fetch related resources:", error);
      }
    };

    fetchResources();
  }, [id]);

  const handleStatusUpdate = async (newStatus = currentRequest.status) => {
    try {
      setLoading(true);
      const res = await axios.put(
        `http://localhost:8080/api/support/${ticket._id}/status`,
        {
          status: newStatus,
        }
      );

      setTicket((prev) => ({ ...prev, status: res.data.support.status }));
      setCurrentRequest({ status: res.data.support.status });

      Swal.fire({
        icon: "success",
        title: "Status Updated",
        text: `Ticket status updated to "${res.data.support.status}"`,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to update status",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePriorityUpdate = async (e) => {
    e.preventDefault(); // Prevent form default behavior
    try {
      setIsUpdating(true);

      const res = await axios.put(
        `http://localhost:8080/api/support/${ticket._id}/priority`,
        {
          priority: currentRequest2.priority,
        }
      );

      // Update ticket and current request states
      setTicket((prev) => ({ ...prev, priority: res.data.support.priority }));
      setCurrentRequest2({ priority: res.data.support.priority });

      Swal.fire({
        icon: "success",
        title: "Priority Updated",
        text: `Ticket priority updated to "${res.data.support.priority}"`,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to update priority",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleresource = async (e) => {
    e.preventDefault();

    if (!label.trim() || !url.trim()) return;

    try {
      setIsSubmitting(true);

      const response = await axios.post(
        `http://localhost:8080/api/support/resource/add/${id}`,
        {
          label,
          url,
        }
      );

      setResources((prev) => [...prev, { label, url }]);
      setLabel("");
      setUrl("");

      Swal.fire({
        icon: "success",
        title: "Resource Added",
        text: "Your related resource has been saved successfully.",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error submitting resource:", error);

      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Something went wrong while saving the resource.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading)
    return <div className="text-center py-10">Loading ticket details...</div>;
  if (!ticket)
    return (
      <div className="text-center py-10 text-red-500">
        Ticket not found or failed to load.
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="w-[140px] mb-6">
        <Link
          to="/support"
          className="relative group flex items-center gap-3 px-5 py-3 rounded-full 
               bg-gradient-to-r from-blue-50 to-indigo-50 
               hover:from-blue-100 hover:to-indigo-100 
               dark:from-blue-900 dark:to-indigo-900 
               dark:hover:from-blue-800 dark:hover:to-indigo-800 
               border border-blue-100 dark:border-blue-800 
               shadow-sm dark:shadow-md 
               transition-all duration-300 ease-in-out h-[40px]"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="relative">
            <div
              className={`absolute inset-0 bg-blue-500 rounded-full animate-ping 
                    ${isHovered ? "opacity-20" : "opacity-0"} 
                    transition-opacity duration-300`}
            ></div>
            <div
              className="relative flex items-center justify-center w-8 h-8 rounded-full 
                      bg-gradient-to-r from-blue-500 to-indigo-600 
                      shadow-md transform group-hover:-translate-x-1 
                      transition-all duration-300"
            >
              <LuArrowLeft className="h-4 w-4 text-white" />
            </div>
          </div>

          <span
            className="font-medium text-slate-700 group-hover:text-slate-900 
                     dark:text-slate-200 dark:group-hover:text-white 
                     transition-colors duration-300"
          >
            Back
          </span>

          {/* Animated indicator dots */}
          <div className="hidden sm:flex items-center gap-1 ml-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`w-1 h-1 rounded-full bg-blue-400 
                      transition-all duration-300 
                      ${isHovered ? "opacity-100" : "opacity-0"} 
                      ${isHovered ? `delay-${i * 100}` : ""}`}
                style={{
                  transitionDelay: isHovered ? `${i * 100}ms` : "0ms",
                  transform: isHovered ? "scale(1)" : "scale(0)",
                }}
              ></div>
            ))}
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ticket Info */}
          <Card className="dark:bg-[#1B222D] bg-white shadow-md dark:shadow=lg rounded-xl p-4 space-y-3 min-h-[180px] flex flex-col hover:shadow-lg dark:hover:shadow-xl">
            <CardHeader>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-300 mb-1">
                  TICKET-{ticket._id?.slice(-4).toUpperCase()}
                </p>
                <CardTitle>{ticket.subject}</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <Badge label={ticket.priority} type={ticket.priority} />
                <Badge label={ticket.status} type={ticket.status} />
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-4 dark:text-gray-300 ">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">
                    Description
                  </h3>
                  <p className="mt-1 font-semibold">{ticket.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">
                      Created
                    </h3>
                    <p className="mt-1 font-semibold">
                      {new Date(ticket.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">
                      Last Updated
                    </h3>
                    <p className="mt-1 font-semibold">
                      {new Date(ticket.updatedAt).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">
                      Submitted By
                    </h3>
                    <p className="mt-1 font-semibold">
                      {ticket.userName || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="min-h-[368px] bg-white dark:bg-[#111827] shadow-xl rounded-2xl p-6 space-y-6 flex flex-col transition-shadow hover:shadow-2xl">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="text-blue-600 dark:text-blue-400 text-2xl">
                  <LuLink />
                </span>
                Add Related Resource
              </CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col flex-grow justify-center">
              <form onSubmit={handleresource} className="space-y-5">
                <div className="flex flex-col">
                  <label
                    htmlFor="label"
                    className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Label <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="label"
                    type="text"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    placeholder="e.g., API Documentation"
                    className="rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="url"
                    className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    URL <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="url"
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com/resource"
                    className="rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
                    disabled={isSubmitting}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex items-center justify-center gap-2 ${
                    isSubmitting
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
                  } dark:from-blue-500 dark:to-blue-400 dark:hover:from-blue-600 dark:hover:to-blue-500 text-white font-semibold py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all`}
                >
                  <span>
                    <LuPlus />
                  </span>{" "}
                  {isSubmitting ? "Adding..." : "Add Resource"}
                </button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Section */}
        <div className="space-y-6">
          {/* Ticket Status Card */}
          <Card className="h-auto flex flex-col bg-white dark:bg-[#1B222D] shadow-md dark:shadow-lg rounded-xl">
            <CardHeader>
              <CardTitle className="text-black dark:text-white">
                Ticket Status
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-black dark:text-gray-200">
                    Current status:
                  </span>
                  <Badge label={ticket.status} type={ticket.status} />
                </div>

                <FormControl component="fieldset" sx={{ marginTop: 3 }}>
                  <FormLabel
                    component="legend"
                    sx={{
                      fontWeight: 400,
                      color: "#000",
                      "&.Mui-focused": { color: "#000" },
                      ".dark &": {
                        color: "#E5E7EB",
                      },
                    }}
                  >
                    Update Status
                  </FormLabel>

                  <RadioGroup
                    name="status"
                    value={currentRequest.status}
                    onChange={(e) =>
                      setCurrentRequest({
                        ...currentRequest,
                        status: e.target.value,
                      })
                    }
                  >
                    {["Open", "In Progress", "Closed"].map((label) => (
                      <FormControlLabel
                        key={label}
                        value={label}
                        control={
                          <Radio
                            color={
                              label === "Open"
                                ? "primary"
                                : label === "In Progress"
                                ? "warning"
                                : "success"
                            }
                          />
                        }
                        label={
                          <span className="text-black dark:text-gray-200">
                            {label}
                          </span>
                        }
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </div>

              <button
                onClick={() => handleStatusUpdate()}
                disabled={loading}
                className={`mt-6 w-full flex items-center justify-center gap-2 ${
                  loading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
                } dark:from-blue-500 dark:to-blue-400 dark:hover:from-blue-600 dark:hover:to-blue-500 text-white font-semibold py-1.5 rounded-lg shadow-md hover:shadow-lg transition-all`}
              >
                {loading ? "Updating..." : "Update Status"}
              </button>
            </CardContent>
          </Card>

          <Card className="h-auto flex flex-col bg-white dark:bg-[#1B222D] shadow-md dark:shadow-lg rounded-xl mt-6">
            <CardHeader>
              <CardTitle className="text-black dark:text-white">
                Ticket Priority
              </CardTitle>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-black dark:text-gray-200">
                    Current priority:
                  </span>
                  <Badge label={ticket.priority} type={ticket.priority} />
                </div>

                <FormControl component="fieldset" sx={{ marginTop: 3 }}>
                  <FormLabel
                    component="legend"
                    sx={{
                      fontWeight: 400,
                      color: "#000",
                      "&.Mui-focused": { color: "#000" },
                      ".dark &": {
                        color: "#E5E7EB",
                      },
                    }}
                  >
                    Update Priority
                  </FormLabel>

                  <RadioGroup
                    name="priority"
                    value={currentRequest2.priority}
                    onChange={(e) =>
                      setCurrentRequest2({
                        ...currentRequest2,
                        priority: e.target.value,
                      })
                    }
                  >
                    {["Low", "Medium", "High"].map((label) => (
                      <FormControlLabel
                        key={label}
                        value={label}
                        control={
                          <Radio
                            color={
                              label === "Low"
                                ? "primary"
                                : label === "Medium"
                                ? "secondary"
                                : label === "High"
                                ? "warning"
                                : "error"
                            }
                          />
                        }
                        label={
                          <span className="text-black dark:text-gray-200">
                            {label}
                          </span>
                        }
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </div>

              <button
                onClick={handlePriorityUpdate}
                disabled={isUpdating}
                className={`mt-6 w-full flex items-center justify-center gap-2 ${
                  isUpdating
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
                } dark:from-blue-500 dark:to-blue-400 dark:hover:from-blue-600 dark:hover:to-blue-500 text-white font-semibold py-1.5 rounded-lg shadow-md hover:shadow-lg transition-all`}
              >
                {isUpdating ? "Updating..." : "Update Priority"}
              </button>
            </CardContent>
          </Card>
        </div>

        <div className="w-full mt-1 col-span-1 lg:col-span-3">
          <AdminSupportChat ticketId={ticket._id} customerId={ticket.userId} />
        </div>
      </div>
    </div>
  );
};

export default TicketDetailsAdmin;
