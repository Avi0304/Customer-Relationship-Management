import React, { useState, useEffect } from "react";
import axios from "axios";
import { LuPlus } from "react-icons/lu";
import { Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";
import { Button } from "@mui/material";

// Priority badge styling
function getPriorityBadge(priority) {
  const base = "text-xs font-medium px-2 py-0.5 rounded-full";
  switch (priority?.toLowerCase()) {
    case "high":
      return <span className={`${base} bg-red-500 text-white`}>High</span>;
    case "medium":
      return <span className={`${base} bg-yellow-500 text-white`}>Medium</span>;
    case "low":
      return <span className={`${base} bg-green-500 text-white`}>Low</span>;
    default:
      return null;
  }
}

export default function CustomerDashBoard() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    fetchTicket();
  }, []);

  const fetchTicket = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/support/all");
      setTickets(response.data.data);
    } catch (error) {
      console.error("Error in Fetching Tickets: ", error);
    }
  };

  const renderTicketCards = (status) => {
    const filtered = tickets.filter(
      (ticket) => ticket.status?.toLowerCase().replace(/\s+/g, "-") === status
    );

    return (
      <>
        <Card className="shadow=2xl dark:bg-[#1B222D]">
          <h2 className="text-lg font-bold capitalize text-black mb-2 dark:text-white">
            {status === "in-progress" ? "In Progress" : status}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((ticket) => {
              const ticketId = ticket._id?.$oid || ticket._id;
              const updatedAt = ticket.updatedAt?.$date || ticket.updatedAt;

              return (
                <Card
                  key={ticketId}
                  className="dark:bg-[#1B222D] bg-white shadow-md dark:shadow=lg rounded-xl p-4 space-y-3 min-h-[180px] flex flex-col transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-xl"
                >
                  <div className="flex justify-between items-start">
                    {/* Fixed height for consistent subject alignment */}
                    <CardTitle className="text-base text-lg font-semibold dark:text-white truncate h-[30px]">
                      {ticket.subject}
                    </CardTitle>

                    {getPriorityBadge(ticket.priority)}
                  </div>

                  <CardContent className="p-0 text-sm dark:text-gray-300 flex-1 flex flex-col">
                    {/* Ticket ID */}
                    <div className="text-gray-700 text-xs dark:text-gray-400">
                      TICKET-{ticket._id.slice(-4).toUpperCase()}
                    </div>

                    {/* Description + Date block */}
                    <div className="flex flex-col justify-between min-h-[48px]">
                      <div className="text-sm text-gray-800 dark:text-gray-300 truncate">
                        {ticket.description}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(ticket.updatedAt).toLocaleDateString()}
                      </div>
                    </div>

                    {/* View Ticket pinned to bottom */}
                    <Link
                      to={`/ticket-detail/${ticket._id}`}
                      className="text-sm font-medium text-blue-600 hover:underline mt-auto"
                    >
                      View Ticket →
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </Card>
      </>
    );
  };

  return (
    <div className="container mx-auto  space-y-8">
      <div className="flex justify-end">
        <Button
          component={Link}
          to="/customer-ticket"
          variant="contained"
          color="primary"
          startIcon={<LuPlus />}
        >
          New Ticket
        </Button>
      </div>

      {renderTicketCards("open")}
      {renderTicketCards("in-progress")}
      {renderTicketCards("closed")}
    </div>
  );
}
