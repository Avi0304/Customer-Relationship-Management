// TicketDetailPage.jsx
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { RadioGroup, FormControlLabel, Radio, FormControl, FormLabel } from '@mui/material';
import { LuClock, LuCalendar, LuCircleAlert, LuArrowLeft } from "react-icons/lu";

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
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colors[type?.toLowerCase()] || "bg-gray-100 text-gray-700"}`}>
      {label}
    </span>
  );
};

const TicketDetailPage = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentRequest, setCurrentRequest] = useState({ status: "Open" });
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        const { data } = await axios.get(`http://localhost:8080/api/support/${id}`);
        setTicket(data);
        setCurrentRequest({ status: data.status });
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
        const res = await axios.get(`http://localhost:8080/api/support/resource/${id}`);
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
      const res = await axios.put(`http://localhost:8080/api/support/${ticket._id}/status`, {
        status: newStatus,
      });

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

  const handleWithdraw = async () => {
    try {
      await axios.put(`http://localhost:8080/api/support/${ticket._id}/Withdrawstatus`);
      Swal.fire("Withdrawn", "Your ticket has been withdrawn.", "success");
      setTicket((prev) => ({ ...prev, status: "Withdrawn" }));
    } catch (error) {
      Swal.fire("Error", "Failed to withdraw ticket.", "error");
    }
  };

  if (loading) return <div className="text-center py-10">Loading ticket details...</div>;
  if (!ticket) return <div className="text-center py-10 text-red-500">Ticket not found or failed to load.</div>;

  return (
    <div className="container mx-auto px-4 py-6">

      <div className="w-[140px] mb-6">
        <Link
          to="/customer-dashboard"
          className="relative group flex items-center gap-3 px-5 py-3 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-100 shadow-sm transition-all duration-300 ease-in-out h-[40px]"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="relative">
            <div
              className={`absolute inset-0 bg-blue-500 rounded-full animate-ping ${isHovered ? "opacity-20" : "opacity-0"} transition-opacity duration-300`}
            ></div>
            <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 shadow-md transform group-hover:-translate-x-1 transition-all duration-300">
              <LuArrowLeft className="h-4 w-4 text-white" />
            </div>
          </div>

          <span className="font-medium text-slate-700 group-hover:text-slate-900 transition-colors duration-300">
            Back
          </span>

          {/* Animated indicator dots */}
          <div className="hidden sm:flex items-center gap-1 ml-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`w-1 h-1 rounded-full bg-blue-400 transition-all duration-300 ${isHovered ? "opacity-100" : "opacity-0"
                  } ${isHovered ? `delay-${i * 100}` : ""}`}
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
          <Card>
            <CardHeader>
              <div>
                <p className="text-sm text-gray-500 mb-1">
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
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Description</h3>
                  <p className="mt-1 font-semibold">{ticket.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Created</h3>
                    <p className="mt-1 font-semibold">{new Date(ticket.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
                    <p className="mt-1 font-semibold">{new Date(ticket.updatedAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Submitted By</h3>
                    <p className="mt-1 font-semibold">{ticket.userName || "N/A"}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Withdraw or Reopen */}
          <Card className="min-h-[235px] ">
            <CardHeader>
              <CardTitle>
                {ticket.status === "Withdrawn" ? "Ticket Already Withdrawn" : "Withdraw Ticket"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ticket.status === "Withdrawn" ? (
                  <>
                    <p className="text-sm text-gray-700">
                      This ticket has already been withdrawn. If your issue persists, you can reopen it.
                    </p>
                    <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 text-sm rounded-md p-3">
                      🔄 Reopening will allow you to receive support again.
                    </div>
                    <button
                      onClick={() => handleStatusUpdate("Open")}
                      className="w-full text-green-600 border border-green-500 hover:bg-green-100 font-medium py-2 px-4 rounded transition-colors"
                    >
                      Reopen Ticket
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-gray-700">
                      If your issue is resolved or no longer relevant, you can withdraw this ticket.
                    </p>
                    <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md p-3">
                      ⚠️ Withdrawing a ticket means no further support will be provided unless reopened.
                    </div>
                    <button
                      onClick={handleWithdraw}
                      className="w-full text-red-600 border border-red-500 hover:bg-red-100 font-medium py-2 px-4 rounded transition-colors"
                    >
                      Withdraw Ticket
                    </button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Section */}
        <div className="space-y-6">
          <Card className="h-auto flex flex-col">
            <CardHeader>
              <CardTitle>Ticket Status</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-black">Current status:</span>
                  <Badge label={ticket.status} type={ticket.status} />
                </div>

                <FormControl component="fieldset" sx={{ marginTop: 3 }}>
                  <FormLabel component="legend" sx={{ color: 'black', fontWeight: 400 }}>
                    Update Status
                  </FormLabel>
                  <RadioGroup
                    name="status"
                    value={currentRequest.status}
                    onChange={(e) => setCurrentRequest({ ...currentRequest, status: e.target.value })}
                  >
                    <FormControlLabel value="Open" control={<Radio color="primary" />} label="Open" />
                    <FormControlLabel value="In Progress" control={<Radio color="warning" />} label="In Progress" />
                    <FormControlLabel value="Closed" control={<Radio color="success" />} label="Closed" />
                  </RadioGroup>
                </FormControl>
              </div>

              <button
                onClick={() => handleStatusUpdate()}
                disabled={loading}
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm rounded disabled:opacity-50"
              >
                {loading ? "Updating..." : "Update Status"}
              </button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Related Resources</CardTitle>
            </CardHeader>
            <CardContent>
              {resources.length > 0 ? (
                <ul className="space-y-2 text-sm text-blue-600">
                  {resources.map((resource) => (
                    <li key={resource._id}>
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {resource.label}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">No related resources found.</p>
              )}
            </CardContent>
          </Card>

          {/* <Card>
            <CardHeader>
              <CardTitle>Support Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-1">
                <li>Monday - Friday: 9am - 8pm ET</li>
                <li>Saturday: 10am - 6pm ET</li>
                <li>Sunday: Closed</li>
              </ul>
              <hr className="my-4" />
              <p className="text-sm text-gray-600">
                For urgent issues outside of these hours, please use the emergency contact form.
              </p>
            </CardContent>
          </Card> */}
        </div>

        {/* Full Width Support Hours Card */}
        <div className="w-full mt-1 col-span-1 lg:col-span-3">
          <Card className="w-full overflow-hidden border-0 shadow-lg rounded-xl">
            <CardHeader>
              <div className="flex items-center gap-2">
                {/* <LuClock className="h-5 w-5" /> */}
                <CardTitle className="text-xl font-bold">Support Hours</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-indigo-50 border border-indigo-100">
                    <LuCalendar className="h-5 w-5 text-indigo-600" />
                    <div>
                      <p className="font-medium text-gray-800">Monday - Friday</p>
                      <p className="text-indigo-600 font-semibold">9am - 8pm </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-indigo-50 border border-indigo-100">
                    <LuCalendar className="h-5 w-5 text-indigo-600" />
                    <div>
                      <p className="font-medium text-gray-800">Saturday</p>
                      <p className="text-indigo-600 font-semibold">10am - 6pm </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                    <LuCalendar className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-800">Sunday</p>
                      <p className="text-red-500 font-semibold">Closed</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-gray-100">
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-50 border border-amber-100">
                    <LuCircleAlert className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <p className="text-gray-700">
                        For urgent issues outside of these hours, please use the{" "}
                        <Link
                          href="#"
                          className="text-indigo-600 font-medium hover:text-indigo-800 hover:underline transition-colors"
                        >
                          emergency contact form
                        </Link>
                        .
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default TicketDetailPage;
