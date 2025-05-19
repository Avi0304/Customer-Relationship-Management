import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

const StatsCard = ({ title, icon: Icon, value, growth }) => {
  return (
    <Card
      className="shadow-md p-4 flex flex-col justify-between 
                 bg-white dark:bg-[#1B222D] shadow-lg 
                 dark:shadow-md"
    >
      <CardHeader className="flex items-center gap-2">
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </CardTitle>
        {Icon && <Icon className="text-gray-600 dark:text-gray-300 text-2xl" />}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold mb-1 text-gray-900 dark:text-gray-100">
          {value}
        </div>
        <p className="text-sm text-green-500 dark:text-green-400">{growth}</p>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
