import React from "react";
import { LuPlus } from "react-icons/lu";
import { Link } from "react-router-dom"
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card"
import { Button } from "@mui/material";


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
]

function getPriorityBadge(priority) {
    const base = "text-xs font-medium px-2 py-0.5 rounded-full"
    switch (priority) {
        case "high":
            return <span className={`${base} bg-red-500 text-white`}>High</span>
        case "medium":
            return <span className={`${base} bg-yellow-500 text-white`}>Medium</span>
        case "low":
            return <span className={`${base} bg-green-500 text-white`}>Low</span>
        default:
            return null
    }
}

export default function CustomerDashBoard() {
    return (
        <div className="container mx-auto py-6 space-y-8">
            <div className="flex justify-end">
                <Button
                    component={Link}
                    to="/tickets/new"
                    variant="contained"
                    color="primary"
                    startIcon={<LuPlus />}
                >
                    New Ticket
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Open Tickets */}
                <Card className="dark:bg-[#1B222D]">
                    <CardHeader>
                        <CardTitle>Open</CardTitle>
                        {getPriorityBadge(
                            tickets.find(ticket => ticket.status === "open")?.priority
                        )}
                    </CardHeader>
                    <CardContent className="space-y-3 dark:text-gray-300">
                        {tickets.filter(ticket => ticket.status === "open").map(ticket => (
                            <Link key={ticket.id} href={`/tickets/${ticket.id}`} className="block p-3 rounded-md">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-medium text-sm">{ticket.id}</span>
                                    {/* {getPriorityBadge(ticket.priority)} */}
                                </div>
                                <h3 className="font-medium mb-1">{ticket.title}</h3>
                                <div className="text-xs text-gray-500 dark:text-gray-300">{new Date(ticket.created).toLocaleDateString()}</div>
                            </Link>
                        ))}
                    </CardContent>
                </Card>

                {/* In Progress Tickets */}
                <Card className="dark:bg-[#1B222D]">
                    <CardHeader>
                        <CardTitle>In Progress</CardTitle>
                        {getPriorityBadge(
                            tickets.find(ticket => ticket.status === "in-progress")?.priority
                        )}
                    </CardHeader>
                    <CardContent className="space-y-3 dark:text-gray-300">
                        {tickets.filter(ticket => ticket.status === "in-progress").map(ticket => (
                            <Link
                                key={ticket.id}
                                to={`/tickets/${ticket.id}`}
                                className="block p-3  rounded-md"
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-medium text-sm">{ticket.id}</span>
                                </div>
                                <h3 className="font-medium mb-1">{ticket.title}</h3>
                                <div className="text-xs text-gray-500 dark:text-gray-300">
                                    {new Date(ticket.updated).toLocaleDateString()}
                                </div>
                            </Link>
                        ))}
                    </CardContent>
                </Card>

                {/* Closed Tickets */}
                <Card className="dark:bg-[#1B222D]">
                    <CardHeader>
                        <CardTitle>Closed</CardTitle>
                        {getPriorityBadge(
                            tickets.find(ticket => ticket.status === "closed")?.priority
                        )}
                    </CardHeader>
                    <CardContent className="space-y-3 dark:text-gray-300">
                        {tickets.filter(ticket => ticket.status === "closed").map(ticket => (
                            <Link
                                key={ticket.id}
                                to={`/tickets/${ticket.id}`}
                                className="block p-3 rounded-md "
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-medium text-sm">{ticket.id}</span>
                                   
                                </div>
                                <h3 className="font-medium mb-1">{ticket.title}</h3>
                                <div className="text-xs text-gray-500 dark:text-gray-300">
                                    {new Date(ticket.updated).toLocaleDateString()}
                                </div>
                            </Link>
                        ))}
                    </CardContent>
                </Card>

            </div>
        </div>
    )
}
