import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiMenu,
  FiX,
  FiHome,
  FiUsers,
  FiLogOut,
  FiUser,
  FiShield,
  FiBell,
  FiDatabase,
  FiHelpCircle,
} from "react-icons/fi";
import {
  FaUserPlus,
  FaTasks,
  FaCalendar,
  FaChartLine,
  FaBullseye,
} from "react-icons/fa";
import Swal from "sweetalert2";
import { BiSupport } from "react-icons/bi";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout",
      cancelButtonText: "Cancel",
      background: currentTheme === "dark" ? "#1e293b" : "#fff",
      color: currentTheme === "dark" ? "#f8fafc" : "#000",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
  
        Swal.fire({
          title: "Logout Successful!",
          text: "Redirecting to login page",
          icon: "success",
          iconColor: currentTheme === "dark" ? "#4ade80" : "green",
          background: currentTheme === "dark" ? "#1e293b" : "#fff",
          color: currentTheme === "dark" ? "#f8fafc" : "#000",
          timer: 1500,
          showConfirmButton: false,
          allowOutsideClick: false,
        });
  
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    });
  };
  

  // Check if the user is on the settings page
  const isSettingsPage = location.pathname.startsWith("/settings");
  const currentTheme = localStorage.getItem("theme") || "light";

  return (
    <div
      className={`flex flex-col h-screen bg-black text-white transition-all duration-300 shadow-xl sticky top-0 ${
        isOpen ? "w-64" : "w-16"
      }`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-center h-16 px-4 border-b border-gray-700 sticky top-0">
        <h1
          className={`text-2xl font-bold bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent transition-all duration-300 ${
            isOpen ? "block" : "hidden"
          }`}
        >
          CRM
        </h1>
        <button
          className="text-gray-500 hover:text-white transition-colors absolute right-4"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      <nav className=" flex-1 overflow-y-auto mt-6 space-y-3 px-2 sticky top-22 z-50">
        {/* Main Navigation (Hidden on Settings Page) */}
        {!isSettingsPage && (
          <>
            <Link
              to="/dashboard"
              className={`flex items-center p-2 rounded-lg transition-all duration-200 ${
                location.pathname === "/dashboard"
                  ? "bg-blue-700 text-white"
                  : "hover:bg-gray-700/50 hover:text-blue-400"
              }`}
            >
              <div className="flex items-center justify-center w-10">
                <FiHome size={24} />
              </div>
              <span className={`${isOpen ? "block" : "hidden"} font-medium`}>
                Dashboard
              </span>
            </Link>

            <Link
              to="/leads"
              className={`flex items-center p-2 rounded-lg transition-all duration-200 ${
                location.pathname === "/leads"
                  ? "bg-blue-700 text-white"
                  : "hover:bg-gray-700/50 hover:text-purple-400"
              }`}
            >
              <div className="flex items-center justify-center w-10">
                <FaUserPlus size={24} />
              </div>
              <span className={`${isOpen ? "block" : "hidden"} font-medium`}>
                Leads
              </span>
            </Link>

            <Link
              to="/customers"
              className={`flex items-center p-2 rounded-lg transition-all duration-200 ${
                location.pathname === "/customers"
                  ? "bg-blue-700 text-white"
                  : "hover:bg-gray-700/50 hover:text-green-400"
              }`}
            >
              <div className="flex items-center justify-center w-10">
                <FiUsers size={24} />
              </div>
              <span className={`${isOpen ? "block" : "hidden"} font-medium`}>
                Customers
              </span>
            </Link>

            <Link
              to="/task"
              className={`flex items-center p-2 rounded-lg transition-all duration-200 ${
                location.pathname === "/task"
                  ? "bg-blue-700 text-white"
                  : "hover:bg-gray-700/50 hover:text-green-400"
              }`}
            >
              <div className="flex items-center justify-center w-10">
                <FaTasks size={24} />
              </div>
              <span className={`${isOpen ? "block" : "hidden"} font-medium`}>
                Task Management
              </span>
            </Link>

            <Link
              to="/sales"
              className={`flex items-center p-2 rounded-lg transition-all duration-200 ${
                location.pathname === "/sales"
                  ? "bg-blue-700 text-white"
                  : "hover:bg-gray-700/50 hover:text-green-400"
              }`}
            >
              <div className="flex items-center justify-center w-10">
                <FaChartLine size={24} />
              </div>
              <span className={`${isOpen ? "block" : "hidden"} font-medium`}>
                Sales
              </span>
            </Link>

            <Link
              to="/appointment"
              className={`flex items-center p-2 rounded-lg transition-all duration-200 ${
                location.pathname === "/appointment"
                  ? "bg-blue-700 text-white"
                  : "hover:bg-gray-700/50 hover:text-green-400"
              }`}
            >
              <div className="flex items-center justify-center w-10">
                <FaCalendar size={24} />
              </div>
              <span className={`${isOpen ? "block" : "hidden"} font-medium`}>
                Appointments
              </span>
            </Link>

            <Link
              to="/marketing"
              className={`flex items-center p-2 rounded-lg transition-all duration-200 ${
                location.pathname === "/marketing"
                  ? "bg-blue-700 text-white"
                  : "hover:bg-gray-700/50 hover:text-green-400"
              }`}
            >
              <div className="flex items-center justify-center w-10">
                <FaBullseye size={24} />
              </div>
              <span className={`${isOpen ? "block" : "hidden"} font-medium`}>
                Marketing
              </span>
            </Link>

            <Link
              to="/support"
              className={`flex items-center p-2 rounded-lg transition-all duration-200 ${
                location.pathname === "/support"
                  ? "bg-blue-700 text-white"
                  : "hover:bg-gray-700/50 hover:text-green-400"
              }`}
            >
              <div className="flex items-center justify-center w-10">
                <BiSupport size={24} />
              </div>{" "}
              {/* ✅ FIXED: Changed icon */}
              <span className={`${isOpen ? "block" : "hidden"} font-medium`}>
                Customer Support
              </span>
            </Link>
          </>
        )}

        {/* Settings Navigation (Visible only on /settings pages) */}
        {isSettingsPage && (
          <>
            <Link
              to="/settings/profile"
              className={`flex items-center p-2 rounded-lg transition-all duration-200 ${
                location.pathname === "/settings/profile"
                  ? "bg-blue-700 text-white"
                  : "hover:bg-gray-700/50 hover:text-blue-400"
              }`}
            >
              <div className="flex items-center justify-center w-10">
                <FiUser size={24} />
              </div>
              <span className={`${isOpen ? "block" : "hidden"} font-medium`}>
                Profile
              </span>
            </Link>

            <Link
              to="/settings/security"
              className={`flex items-center p-2 rounded-lg transition-all duration-200 ${
                location.pathname === "/settings/security"
                  ? "bg-blue-700 text-white"
                  : "hover:bg-gray-700/50 hover:text-purple-400"
              }`}
            >
              <div className="flex items-center justify-center w-10">
                <FiShield size={24} />
              </div>
              <span className={`${isOpen ? "block" : "hidden"} font-medium`}>
                Security
              </span>
            </Link>

            <Link
              to="/settings/notifications"
              className={`flex items-center p-2 rounded-lg transition-all duration-200 ${
                location.pathname === "/settings/notifications"
                  ? "bg-blue-700 text-white"
                  : "hover:bg-gray-700/50 hover:text-green-400"
              }`}
            >
              <div className="flex items-center justify-center w-10">
                <FiBell size={24} />
              </div>
              <span className={`${isOpen ? "block" : "hidden"} font-medium`}>
                Notifications
              </span>
            </Link>

            <Link
              to="/settings/data"
              className={`flex items-center p-2 rounded-lg transition-all duration-200 ${
                location.pathname === "/settings/data"
                  ? "bg-blue-700 text-white"
                  : "hover:bg-gray-700/50 hover:text-green-400"
              }`}
            >
              <div className="flex items-center justify-center w-10">
                <FiDatabase size={24} />
              </div>
              <span className={`${isOpen ? "block" : "hidden"} font-medium`}>
                Data Management
              </span>
            </Link>

            <Link
              to="/dashboard"
              className={`flex items-center p-2 rounded-lg transition-all duration-200 ${
                location.pathname === "/dashboard"
                  ? "bg-blue-700 text-white"
                  : "hover:bg-gray-700/50 hover:text-blue-400"
              }`}
            >
              <div className="flex items-center justify-center w-10">
                <FiHome size={24} />
              </div>
              <span className={`${isOpen ? "block" : "hidden"} font-medium`}>
                Home
              </span>
            </Link>
          </>
        )}

        {/* Logout Button */}
        {/* <button
          className="flex items-center p-2 rounded-lg hover:bg-red-500/20 w-full text-left mt-auto transition-all duration-200"
          onClick={handleLogout}
        >
          <div className="flex items-center justify-center w-10">
            <FiLogOut size={24} className="text-red-400" />
          </div>
          <span
            className={`${
              isOpen ? "block" : "hidden"
            } font-medium text-red-400`}
          >
            Logout
          </span>
        </button> */}
      </nav>

      <div className="p-2 mt-auto">
        <hr className="border-t border-white/30 mb-2" />
        <button
          className="flex items-center p-2 rounded-lg hover:bg-red-500/20 w-full text-left transition-all duration-200"
          onClick={handleLogout}
        >
          <div className="flex items-center justify-center w-10">
            <FiLogOut size={24} className="text-red-400" />
          </div>
          <span
            className={`${
              isOpen ? "block" : "hidden"
            } font-medium text-red-400`}
          >
            Logout
          </span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
