import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader } from "./ui/card";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const CustomerSegmentation = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomerSegmentation = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/Customer/segmentation"
        );
        console.log("Fetched customer data:", response.data);

        const segmentationData = response.data.data || [];

        if (!Array.isArray(segmentationData) || segmentationData.length === 0) {
          console.warn("No customer segmentation data received.");
          setData([]);
          return;
        }

        // Convert percentage string to number for the PieChart
        const formattedData = segmentationData.map((item) => ({
          name: item.label,
          value: parseFloat(item.percentage),
          color: item.color,
        }));

        setData(formattedData);
      } catch (error) {
        console.error("Error fetching segmentation data:", error);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerSegmentation();
  }, []);

  return (
    <Card className="col-span-3 bg-white dark:bg-[#1B222D] shadow-lg dark:shadow-md  shadow-lg rounded-lg p-6 w-full">
      <CardHeader>
        <h1 className="text-2xl font-bold leading-none tracking-tight light:text-gray-900 dark:text-gray-100 mb-3 text-gray-800">
          Customer Segmentation
        </h1>
      </CardHeader>
      <CardContent className="flex flex-col items-center h-auto">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="w-full h-auto">
            <ResponsiveContainer width="100%" minHeight={350}>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={40}
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={entry.color}
                      stroke="#fff"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip  contentStyle={{
                backgroundColor: 'var(--light-bg, #fff)',
                borderColor: 'var(--light-border, #e5e7eb)',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                '@media (prefers-color-scheme: dark)': {
                  backgroundColor: 'hsl(var(--card))',
                  borderColor: 'hsl(var(--border))',
                }
              }}
              labelStyle={{
                color: 'var(--light-text, #111827)',
                fontWeight: 600,
                '@media (prefers-color-scheme: dark)': {
                  color: 'hsl(var(--foreground))',
                }
              }}
              itemStyle={{
                '@media (prefers-color-scheme: dark)': {
                  color: 'hsl(var(--muted-foreground))',
                }
              }}/>
                <Legend layout="horizontal" align="center" verticalAlign="bottom"   wrapperStyle={{
                paddingLeft: '2rem',
              }}
              formatter={(value) => (
                <span className="light:text-gray-700 dark:text-gray-300">
                  {value}
                </span>
              )}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CustomerSegmentation;
