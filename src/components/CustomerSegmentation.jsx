import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const CustomerSegmentation = () => {
  const data = [
    { name: "High-Value", value: 50, color: "#16A34A" }, 
    { name: "Medium-Value", value: 120, color: "#EAB308" },
    { name: "Low-Value", value: 230, color: "#DC2626" }, 
  ];

  const totalCustomers = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="col-span-3 bg-white shadow-lg rounded-lg p-6 w-full">
      <CardHeader>
        <h1 className="text-2xl font-bold leading-none tracking-tight mb-3">
          Customer Segmentation
        </h1>
      </CardHeader>
      <CardContent className="flex justify-center items-center">
        <ResponsiveContainer width="100%" height={300}> 
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100} // Reduced size
              innerRadius={50} // Donut-style, reduced size
              label={({ name, value }) =>
                `${name}: ${(value / totalCustomers * 100).toFixed(1)}%`
              }
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="#fff" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip />
            <Legend layout="vertical" align="right" verticalAlign="bottom" />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default CustomerSegmentation;
