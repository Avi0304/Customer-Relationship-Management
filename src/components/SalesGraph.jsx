import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import {
  ResponsiveContainer,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
} from "recharts";
import axios from "axios";

const SalesGraph = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/sales/all");

        const data = response.data;

        // Correcting Data Formatting
        const formattedData = data.map((item) => ({
          date: new Date(item.createdAt).toISOString().split("T")[0],
          revenue: Number(item.amount),
        }));

        setRevenueData(formattedData);
      } catch (error) {
        console.error("Error fetching revenue data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenueData();
  }, []);


  return (
    <Card className="col-span-3 bg-white dark:bg-[#1B222D] shadow-lg rounded-xl p-6 w-full ">
      <CardHeader>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">
          Sales Overview
        </h1>
      </CardHeader>
      <CardContent className="flex flex-col items-center h-auto">
        {loading ? (
          <p className="text-gray-500 dark:text-gray-400">Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : revenueData.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No data available</p>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1E88E5" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#90CAF9" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ddd" opacity={0.7} />
              <XAxis
                dataKey="date"
                tickFormatter={(str) => str.slice(5)}
                stroke="#1565C0"
                angle={-20}
                textAnchor="end"
                tick={{ fontSize: 13, fontWeight: "bold" }}
                label={{
                  value: "Date",
                  position: "insideBottom",
                  offset: -25,
                  fontSize: 15,
                  fontWeight: "bold",
                  fill: "#4CAF50"
                }}

              />
              <YAxis
                stroke="#1976D2"
                tick={{ fontSize: 13, fontWeight: "bold" }}
                label={{ value: "Revenue", angle: -90, position: "insideLeft", offset: -14, fontSize: 15, fontWeight: "bold", fill: "#4CAF50" }}
              />
              <Tooltip />
              <Legend
                iconType="circle"
                align="right"
                verticalAlign="top"
                wrapperStyle={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  color: "#0D47A1",  // Dark Blue
                  // marginRight: "20px",
                  textTransform: "capitalize",
                }}
              />

              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#1E88E5"
                fill="url(#colorRevenue)"
                strokeWidth={3}
                dot={{ r: 7, fill: "#1E88E5", strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 10, stroke: "#1565C0", strokeWidth: 3 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default SalesGraph;
