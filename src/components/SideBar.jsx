import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiMenu, FiX, FiHome, FiUsers, FiLogOut } from "react-icons/fi";
import { FaUserPlus,FaTasks } from "react-icons/fa";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  return (
    <div
      className={`min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white transition-all duration-300 shadow-xl
                  ${isOpen ? "w-64" : "w-16"} `}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-center h-16 px-4 border-b border-gray-700 relative sticky top-0">
        <h1
          className={`text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent
                      transition-all duration-300 ${isOpen ? "block" : "hidden"}`}
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

      {/* Navigation Links */}
      <nav className="mt-6 space-y-4 px-2 sticky top-22 z-50">
        <Link
          to="/"
          className={`flex items-center p-2 rounded-lg transition-all duration-200 
            ${location.pathname === '/' ? "bg-blue-700 text-white" : "hover:bg-gray-700/50 hover:text-blue-400"}`}
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
          className={`flex items-center p-2 rounded-lg transition-all duration-200 
            ${location.pathname === '/leads' ? "bg-blue-700 text-white" : "hover:bg-gray-700/50 hover:text-purple-400"}`}
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
          className={`flex items-center p-2 rounded-lg transition-all duration-200 
            ${location.pathname === '/customers' ? "bg-blue-700 text-white" : "hover:bg-gray-700/50 hover:text-green-400"}`}
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
          className={`flex items-center p-2 rounded-lg transition-all duration-200 
            ${location.pathname === '/task' ? "bg-blue-700 text-white" : "hover:bg-gray-700/50 hover:text-green-400"}`}
        >
          <div className="flex items-center justify-center w-10">
            <FaTasks size={24} />
          </div>
          <span className={`${isOpen ? "block" : "hidden"} font-medium`}>
            Task Management
          </span>
        </Link>

        {/* Logout Button */}
        <button
          className="flex items-center p-2 rounded-lg hover:bg-red-500/20 w-full text-left mt-auto transition-all duration-200"
        >
          <div className="flex items-center justify-center w-10">
            <FiLogOut size={24} className="text-red-400" />
          </div>
          <span className={`${isOpen ? "block" : "hidden"} font-medium text-red-400`}>
            Logout
          </span>
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
