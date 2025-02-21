import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX, FiHome, FiUsers, FiLogOut } from "react-icons/fi";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white transition-all duration-300 shadow-xl
                  ${isOpen ? "w-64" : "w-16"}`}
    >
      <div className="flex items-center justify-center p-6 border-b border-gray-700 relative">
        <h1
          className={`text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent
                      transition-all duration-300 ${
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

      <nav className="mt-6 space-y-4 px-2">
        <Link
          to="/"
          className="flex items-center p-2 rounded-lg hover:bg-gray-700/50 transition-all duration-200"
        >
          <FiHome className="text-blue-400 mr-3" size={30} />
          <span className={`${isOpen ? "block" : "hidden"} font-medium`}>
            Dashboard
          </span>
        </Link>
        <Link
          to="leads"
          className="flex items-center p-2 rounded-lg hover:bg-gray-700/50 transition-all duration-200"
        >
          <FiUsers className="text-purple-400 mr-3" size={30} />
          <span className={`${isOpen ? "block" : "hidden"} font-medium`}>
            Leads
          </span>
        </Link>
        <Link
          to="/customers"
          className="flex items-center p-2 rounded-lg hover:bg-gray-700/50 transition-all duration-200"
        >
          <FiUsers className="text-green-400 mr-3" size={30} />
          <span className={`${isOpen ? "block" : "hidden"} font-medium`}>
            Customers
          </span>
        </Link>
        <button className="flex items-center p-2 rounded-lg hover:bg-red-500/20 w-full text-left mt-auto transition-all duration-200">
          <FiLogOut className="text-red-400 mr-3" size={30} />
          <span
            className={`${
              isOpen ? "block" : "hidden"
            } font-medium text-red-400`}
          >
            Logout
          </span>
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
