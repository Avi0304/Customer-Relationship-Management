import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

const RecentActivityTable = () => {
  const activites = [
    {
      customer: "Acme Inc.",
      status: "Completed",
      date: "2025-01-24",
      value: "₹ 60,000",
      color: "bg-green-500 text-white",
    },
    {
      customer: "Widget Corp",
      status: "Pending",
      date: "2025-01-15",
      value: "₹ 80,000",
      color: "bg-yellow-500 text-white",
    },
    {
      customer: "Tech Solutions.",
      status: "In Progress",
      date: "2025-02-17",
      value: "₹ 40,000",
      color: "bg-blue-500 text-white",
    },
    {
      customer: "Axe IT Solutions",
      status: "In Progress",
      date: "2025-02-13",
      value: "₹ 50,000",
      color: "bg-blue-500 text-white",
    },
  ];
  return (
    <Card className="col-span-4">
      <CardHeader>
        <h1 className='text-2xl font-bold leading-none tracking-tight mb-3'>Recent Activity</h1>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            <TableHead className="text-right">Value</TableHead> 
            </TableRow>
          </TableHeader>
          <TableBody>
            {activites.map(({ customer, status, date, value, color }) => (
              <TableRow key={customer}>
                <TableCell>{customer}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${color}`}
                  >
                    {status}
                  </span>
                </TableCell>
                <TableCell>{date}</TableCell>
                <TableCell className="text-right">{value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RecentActivityTable;
