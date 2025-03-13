import React from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
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
      color: "bg-green-500 text-white dark:bg-green-600",
    },
    {
      customer: "Widget Corp",
      status: "Pending",
      date: "2025-01-15",
      value: "₹ 80,000",
      color: "bg-yellow-500 text-white dark:bg-yellow-600",
    },
    {
      customer: "Tech Solutions.",
      status: "In Progress",
      date: "2025-02-17",
      value: "₹ 40,000",
      color: "bg-blue-500 text-white dark:bg-blue-600",
    },
    {
      customer: "Axe IT Solutions",
      status: "In Progress",
      date: "2025-02-13",
      value: "₹ 50,000",
      color: "bg-blue-500 text-white dark:bg-blue-600",
    },
  ];
  
  return (
    <Card className="col-span-4   bg-white dark:bg-[#1B222D] shadow-lg dark:shadow-md">
      <CardHeader>
        <h1 className="text-2xl font-bold light:text-gray-900 dark:text-gray-100 leading-none tracking-tight mb-3">
          Recent Activity
        </h1>
      </CardHeader>
      <CardContent>
        <Table className="w-full border border-gray-200 dark:border-gray-700">
          <TableHeader className="light:bg-gray-100 dark:bg-gray-700">
            <TableRow className="dark:bg-gray-900 dark:hover:bg-gray-700">
              <TableHead className="light:text-gray-800 dark:text-gray-200">
                Customer
              </TableHead>
              <TableHead className="light:text-gray-800 dark:text-gray-200">
                Status
              </TableHead>
              <TableHead className="light:text-gray-800 dark:text-gray-200">
                Date
              </TableHead>
              <TableHead className="text-right light:text-gray-800 dark:text-gray-200">
                Value
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activites.map(({ customer, status, date, value, color }) => (
              <TableRow key={customer} className="light:bg-white dark:bg-gray-900 dark:hover:bg-gray-700 ">
                <TableCell className="light:text-gray-700 dark:text-gray-300">
                  {customer}
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${color}`}
                  >
                    {status}
                  </span>
                </TableCell>
                <TableCell className="light:text-gray-700 dark:text-gray-300">
                  {date}
                </TableCell>
                <TableCell className="text-right light:text-gray-700 dark:text-gray-300">
                  {value}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RecentActivityTable;
