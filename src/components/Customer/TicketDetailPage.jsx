import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";
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
} from "react-icons/lu";
import CustomerSupportChat from "./CustomerSupportChat";
import { BiSupport } from "react-icons/bi";

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

const TicketDetailPage = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentRequest, setCurrentRequest] = useState({ status: "Open" });
  const [isHovered, setIsHovered] = useState(false);

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

  const handleWithdraw = async () => {
    try {
      await axios.put(
        `http://localhost:8080/api/support/${ticket._id}/Withdrawstatus`
      );
      Swal.fire("Withdrawn", "Your ticket has been withdrawn.", "success");
      setTicket((prev) => ({ ...prev, status: "Withdrawn" }));
    } catch (error) {
      Swal.fire("Error", "Failed to withdraw ticket.", "error");
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
          to="/customer-dashboard"
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

          {/* Withdraw or Reopen */}
          <Card className="min-h-[249px] bg-white dark:bg-[#1B222D] shadow-md dark:shadow-lg rounded-xl p-4 space-y-3 flex flex-col hover:shadow-lg dark:hover:shadow-xl">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">
                {ticket.status === "Withdrawn"
                  ? "Ticket Already Withdrawn"
                  : "Withdraw Ticket"}
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                {ticket.status === "Withdrawn" ? (
                  <>
                    <p className="text-sm">
                      This ticket has already been withdrawn. If your issue
                      persists, you can reopen it.
                    </p>
                    <div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 text-yellow-700 dark:text-yellow-200 text-sm rounded-md p-3">
                      🔄 Reopening will allow you to receive support again.
                    </div>
                    <button
                      onClick={() => handleStatusUpdate("Open")}
                      className="w-full text-green-600 dark:text-green-400 border border-green-500 dark:border-green-600 hover:bg-green-100 dark:hover:bg-green-800 font-medium py-2 px-4 rounded transition-colors"
                    >
                      Reopen Ticket
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-sm">
                      If your issue is resolved or no longer relevant, you can
                      withdraw this ticket.
                    </p>
                    <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-200 text-sm rounded-md p-3">
                      ⚠️ Withdrawing a ticket means no further support will be
                      provided unless reopened.
                    </div>
                    <button
                      onClick={handleWithdraw}
                      className="w-full text-red-600 dark:text-red-400 border border-red-500 dark:border-red-600 hover:bg-red-100 dark:hover:bg-red-800 font-medium py-2 px-4 rounded transition-colors"
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
          {/* Related Resources Card */}
          <Card className="bg-white dark:bg-[#1B222D] shadow-md dark:shadow-lg rounded-xl min-h-[182px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-black dark:text-white">
                <LuLink /> Related Resources
              </CardTitle>
            </CardHeader>

            <CardContent>
              {resources.length > 0 ? (
                <ul className="space-y-2 text-sm text-blue-600 dark:text-blue-400">
                  {resources.map((resource) => (
                    <li key={resource._id}>
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline-offset-2"
                      >
                        {resource.label}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-sm capitalize">
                  No related resources added by support agent.
                </p>
              )}
            </CardContent>
          </Card>
          <div className="h-auto max-h-[370px] flex flex-col bg-white dark:bg-[#1B222D] shadow-md dark:shadow-lg rounded-xl">
            <Card className="w-full overflow-hidden border-0 shadow-lg rounded-xl dark:bg-[#1B222D]">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold dark:text-white">
                  <BiSupport /> Support Hours
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-1">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-2 rounded-md bg-indigo-50 dark:bg-indigo-900 border border-indigo-100 dark:border-indigo-800">
                      <LuCalendar className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          Monday - Friday
                        </p>
                        <p className="text-sm text-indigo-600 dark:text-indigo-300 font-semibold">
                          9am - 8pm
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-2 rounded-md bg-indigo-50 dark:bg-indigo-900 border border-indigo-100 dark:border-indigo-800">
                      <LuCalendar className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          Saturday
                        </p>
                        <p className="text-sm text-indigo-600 dark:text-indigo-300 font-semibold">
                          10am - 6pm
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-2 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                      <LuCalendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          Sunday
                        </p>
                        <p className="text-sm text-red-500 dark:text-red-400 font-semibold">
                          Closed
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-start gap-3 p-3 rounded-md bg-amber-50 dark:bg-amber-900 border border-amber-100 dark:border-amber-800">
                      <LuCircleAlert className="h-4 w-4 text-amber-600 dark:text-amber-300 mt-0.5" />
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-tight">
                        For urgent issues outside of these hours, please use the{" "}
                        <Link
                          href="#"
                          className="text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-800 dark:hover:text-indigo-300 hover:underline transition-colors"
                        >
                          emergency contact form
                        </Link>
                        .
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="w-full mt-1 col-span-1 lg:col-span-3">
          <CustomerSupportChat
            ticketId={ticket._id}
            customerId={ticket.userId}
          />
        </div>
      </div>
    </div>
  );
};

export default TicketDetailPage;
