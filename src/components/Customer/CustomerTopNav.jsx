import React, { useState, useContext } from "react";
import ThemeToggle from "../ThemeToggle";
import NotificationBell from "../NoticationBell";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { Avatar } from "@mui/material";
import { FaUser } from "react-icons/fa";

const CustomerTopNav = ({ title }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  if (!user) return null;

  return (
    <div className="light:bg-white dark:bg-[#161B22] dark:backdrop-blur-xl shadow-lg flex items-center justify-between p-6 h-16 sticky top-0 z-50 dark:z-[60]">
      <h1 className="text-2xl font-bold text-gray-800 tracking-tight light:text-gray-800 dark:text-gray-200">
        {title}
      </h1>

      <div className="flex items-center gap-6">
        <ThemeToggle />

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="rounded-full light:bg-gray-100 dark:bg-gray-800 transition-transform duration-300 group-hover:scale-105 group-hover:ring-2 group-hover:ring-purple-500/30">
              <Avatar
                src={user?.photo ? `http://localhost:8080${user.photo}` : ""}
                alt={user?.name}
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: "transparent",
                  color: "black",
                }}
              >
                {!user?.photo && user?.name?.charAt(0).toUpperCase()}
              </Avatar>
            </div>
            <span className="text-gray-700 dark:text-gray-300 font-medium hidden md:block transition-colors duration-300">
              {user?.name || "Loading..."}
            </span>
          </button>

          {isOpen && (
            <div
              className="absolute right-0 mt-3 w-48 
              light:bg-white dark:bg-gray-800 dark:backdrop-blur-xl 
              rounded-lg shadow-xl dark:shadow-lg 
              p-3 transform transition-all duration-300 
              border border-gray-100 dark:border-gray-600 
              z-50 dark:z-[60]"
            >
              <button
                className="flex items-center gap-2 w-full text-left px-4 py-2 
                light:text-gray-700 dark:text-gray-100 
                light:hover:bg-blue-50 dark:hover:bg-gray-600/50 
                hover:text-purple-500 rounded-md transition-colors duration-200"
                onClick={() => navigate("/customer-Profile")}
              >
                <FaUser /> Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerTopNav;
