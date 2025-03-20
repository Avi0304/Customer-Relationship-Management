import React, { useEffect, useState } from "react";
import TopNav from "../components/TopNav";
import Sidebar from "../components/SideBar";
import StatsCard from "../components/StatsCard";
import RecentActivityTable from "../components/RecentActivityTable";
import Tasks from "../components/Task";
import CustomerSegmentation from "../components/CustomerSegmentation";
import CalendarWidget from "../components/CalendarWidget";
import {
  FaUsers,
  FaChartBar,
  FaClock,
  FaUserPlus,
  FaRupeeSign,
} from "react-icons/fa";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";

const DashBoard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    activeCustomers: 0,
    totalSales: 0,
    activeDeals: 0,
    revenueChange: "0",
    customerChange: "0",
    salesChange: "0",
    dealsChange: "0",
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/Dashboard/stats");
      setStats(response.data); // Directly set the fetched data
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Sidebar Navigation */}
      <div className="flex">
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1">
          <TopNav title={"DashBoard"} />
          <main className="p-6 space-y-4">
            <div className="flex justify-end z-10">
              <Link to="/leads">
                <Button
                  variant="contained"
                  color="primary"
                  className="flex items-center gap-2 px-4 py-2 rounded-md"
                >
                  <FaUserPlus size={20} /> New Lead
                </Button>
              </Link>
            </div>

            {/* Stats Cards Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatsCard
                title="Total Revenue"
                icon={FaRupeeSign}
                value={`₹ ${stats.totalRevenue.toLocaleString()}`}
                // growth="+ 20.1% from last month"
                growth={`+ ${stats.revenueChange}% from last month`}
              />
              <StatsCard
                title="Active Customers"
                icon={FaUsers}
                value={`+${stats.activeCustomers.toLocaleString()}`}
                // growth="+ 90.1% from last month"
                growth={`+ ${stats.customerChange}% from last month`}
              />
              <StatsCard
                title="Sales"
                icon={FaChartBar}
                value={`+${stats.totalSales.toLocaleString()}`}
                // growth="+ 19% from last month"
                growth={`+ ${stats.salesChange}% from last month`}
              />
              <StatsCard
                title="Active Deals"
                icon={FaClock}
                value={`+${stats.activeDeals.toLocaleString()}`}
                // growth="+ 201 since last hour"
                growth={`${stats.dealsChange}% from last month`}
              />
            </div>

            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
              <div className="lg:col-span-4">
                <RecentActivityTable />
              </div>
              <div className="lg:col-span-3">
                <Tasks />
              </div>
              <div className="lg:col-span-4">
                <CustomerSegmentation />
              </div>
              <div className="lg:col-span-3">
                <CalendarWidget />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
