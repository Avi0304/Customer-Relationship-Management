import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card"

const StatsCard = ({ title, icon: Icon, value, growth }) => {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {Icon && <Icon className="text-gray-500 text-xl" />} {/* Ensure icon renders */}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold ">{value}</div>
        <p className="text-sm text-gray-500">{growth}</p>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
