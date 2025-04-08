import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    FiMenu,
    FiX,
    FiMessageCircle,
    FiPhoneCall,
    FiUser,
    FiLogOut,
    FiHelpCircle,
} from "react-icons/fi";
import { MdSupportAgent } from "react-icons/md";
import { LuLayoutDashboard, LuTicketCheck,LuMessageCircle, LuSettings } from "react-icons/lu";
import Swal from "sweetalert2";

const CustomerSidebar = () => {
    const [isOpen, setIsOpen] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const currentTheme = localStorage.getItem("theme") || "light";

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

    return (
        <div
            className={`flex flex-col h-screen bg-black text-white transition-all duration-300 shadow-xl sticky top-0 ${isOpen ? "w-64" : "w-16"
                }`}
        >
            {/* Header */}
            <div className="flex items-center justify-center h-16 px-4 border-b border-gray-700 sticky top-0">
                <h1
                    className={`text-2xl font-bold bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent transition-all duration-300 ${isOpen ? "block" : "hidden"
                        }`}
                >
                    Support
                </h1>
                <button
                    className="text-gray-500 hover:text-white transition-colors absolute right-4"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </button>
            </div>

            <nav className="flex-1 overflow-y-auto mt-6 space-y-3 px-2">
                <Link
                    to="/customer-dashboard"
                    className={`flex items-center p-2 rounded-lg transition-all duration-200 ${location.pathname === "/customer-dashboard"
                            ? "bg-blue-700 text-white"
                            : "hover:bg-gray-700/50 hover:text-blue-400"
                        }`}
                >
                    <div className="flex items-center justify-center w-10">
                        <LuLayoutDashboard size={24} />
                    </div>
                    <span className={`${isOpen ? "block" : "hidden"} font-medium`}>
                        Dashboard
                    </span>
                </Link>

                <Link
                    to="/customer-ticket"
                    className={`flex items-center p-2 rounded-lg transition-all duration-200 ${location.pathname === "/customer-ticket"
                            ? "bg-blue-700 text-white"
                            : "hover:bg-gray-700/50 hover:text-green-400"
                        }`}
                >
                    <div className="flex items-center justify-center w-10">
                        <LuTicketCheck size={24} />
                    </div>
                    <span className={`${isOpen ? "block" : "hidden"} font-medium`}>
                        Tickets
                    </span>
                </Link>

                <Link
                    to="/customer-message"
                    className={`flex items-center p-2 rounded-lg transition-all duration-200 ${location.pathname === "/customer-message"
                            ? "bg-blue-700 text-white"
                            : "hover:bg-gray-700/50 hover:text-purple-400"
                        }`}
                >
                    <div className="flex items-center justify-center w-10">
                        <LuMessageCircle size={24} />
                    </div>
                    <span className={`${isOpen ? "block" : "hidden"} font-medium`}>
                        Message
                    </span>
                </Link>

                <Link
                    to="/customer-settings"
                    className={`flex items-center p-2 rounded-lg transition-all duration-200 ${location.pathname === "/customer-settings"
                            ? "bg-blue-700 text-white"
                            : "hover:bg-gray-700/50 hover:text-yellow-400"
                        }`}
                >
                    <div className="flex items-center justify-center w-10">
                        <LuSettings size={24} />
                    </div>
                    <span className={`${isOpen ? "block" : "hidden"} font-medium`}>
                        Settings
                    </span>
                </Link>
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
                        className={`${isOpen ? "block" : "hidden"
                            } font-medium text-red-400`}
                    >
                        Logout
                    </span>
                </button>
            </div>
        </div>
    );
};

export default CustomerSidebar;
