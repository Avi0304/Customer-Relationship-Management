import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

const StatsCard = ({ title, icon: Icon, value, growth }) => {
  return (
    <Card className="shadow-md p-4 flex flex-col justify-between">
      <CardHeader className="flex items-center gap-2">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        {Icon && <Icon className="text-gray-500 text-2xl" />}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold mb-1">{value}</div>
        <p className="text-sm text-green-500">{growth}</p>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
