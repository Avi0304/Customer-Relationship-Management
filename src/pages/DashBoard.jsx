import React from "react";
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

const DashBoard = () => {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Sidebar Navigation */}
      <div className="flex">
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1">
          <TopNav  title={"DashBoard"}/>

          <main className="p-6 space-y-4">
            <div className="flex justify-end z-10">
              <Link to="/Addlead">
                <Button
                  variant="contained"
                  color="primary"
                  className="flex items-center gap-2 bg-gray-100 text-black hover:bg-gray-200 px-4 py-2 rounded-md"
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
                value="₹ 45,231.89"
                growth="+ 20.1% from last month"
              />
              <StatsCard
                title="Active Customers"
                icon={FaUsers}
                value="+ 2,350"
                growth="+ 90.1% from last month"
              />
              <StatsCard
                title="Sales"
                icon={FaChartBar}
                value="+ 12,234"
                growth="+ 19% from last month"
              />
              <StatsCard
                title="Active Deals"
                icon={FaClock}
                value="+ 573"
                growth="+ 201 since last hour"
              />
            </div>

            {/* Recent Activity & Tasks Section */}
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
