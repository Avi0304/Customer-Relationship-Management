import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import axios from "axios";

const RecentActivityTable = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/Customer/all"
        );
        const data = response.data;

        // Sort by createdAt (most recent first), then take top 4
        const sorted = data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 4);

        const statusColors = {
          completed: "bg-green-500 text-white dark:bg-green-600",
          pending: "bg-yellow-500 text-white dark:bg-yellow-600",
          cancelled: "bg-red-500 text-white dark:bg-red-600",
        };

        const enhanced = sorted.map((item) => ({
          name: item.name,
          status: item.status || "Pending",
          date: new Date(item.createdAt).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
          value: `₹ ${item.amount?.toLocaleString("en-IN") || "0"}`,
          color: statusColors[item.status] || "bg-gray-500 text-white",
        }));

        setActivities(enhanced);
      } catch (error) {
        console.error("Failed to fetch activities:", error);
      }
    };

    fetchActivities();
  }, []);

  return (
    <Card className="col-span-4 bg-white dark:bg-[#1B222D] shadow-lg dark:shadow-md">
      <CardHeader>
        <h1 className="text-2xl font-bold light:text-gray-900 dark:text-gray-100 leading-none tracking-tight mb-3">
          Recent Activity
        </h1>
      </CardHeader>
      <CardContent>
        <Table className="w-full border border-gray-200 dark:border-gray-700">
          <TableHeader className="light:bg-gray-300 dark:bg-gray-700">
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
            {activities.map(({ name, status, date, value, color }, index) => (
              <TableRow
                key={index}
                className="light:bg-white dark:bg-gray-900 dark:hover:bg-gray-700"
              >
                <TableCell className="light:text-gray-700 dark:text-gray-300">
                  {name}
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium capitalize  ${color}`}
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
