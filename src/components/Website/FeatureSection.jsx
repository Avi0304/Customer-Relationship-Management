import React, { useContext } from "react";
import {
  FiBarChart2,
  FiCalendar,
  FiCheckCircle,
  FiLock,
  FiMail,
  FiMessageSquare,
  FiUserPlus,
  FiUsers,
} from "react-icons/fi";
import Dashborad from "./assets/dashborad.png";
import DarkDash from "./assets/dark-dash.png";
import Marketing from "./assets/marketing.png";
import DarkMark from "./assets/dark-mark.png";
import Appointment from "./assets/appointment.png";
import DarkAppointment from "./assets/dark-appt.png";
import { ThemeContext } from "../../context/ThemeContext";

const FeatureSection = () => {
  const { mode } = useContext(ThemeContext);
  return (
    <section
      id="features"
      className="w-full py-12 md:py-24 lg:py-32 xl:py-25  2xl:py-40 bg-gray-50 dark:bg-gray-900/60"
    >
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center space-y-4">
          <span className="inline-block bg-black light:text-white px-3 py-1 text-sm rounded-full dark:bg-indigo-900/30 dark:text-indigo-400">
            Key Features
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-black md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl dark:text-white">
            Everything You Need to Manage Your Business
          </h2>

          <p className="mx-auto max-w-2xl text-gray-600 md:text-lg xl:text-xl 2xl:text-2xl dark:text-gray-400">
            Our CRM solution provides all the tools you need to manage
            customers, track sales, and grow your business.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-12 grid max-w-5xl mx-auto gap-12 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3">
          {/* Left Side (Image) */}
          <div className="h-full w-full">
            <img
              src={mode === 'light' ? Dashborad : DarkDash}
              alt="Dashboard Feature"
              className="w-full h-full object-cover rounded-lg shadow-md"
            />
          </div>

          {/* Right Side (Features List) */}
          <div className="flex flex-col justify-center space-y-6">
            {[
              {
                icon: <FiBarChart2 />,
                title: "Comprehensive Dashboard",
                desc: "Get real-time analytics, sales graphs, and customer insights.",
              },
              {
                icon: <FiCheckCircle />,
                title: "Task Management",
                desc: "Create, track, and complete tasks easily.",
              },
              {
                icon: <FiUserPlus />,
                title: "Lead Management",
                desc: "Manage leads and convert them into customers in one click.",
              },
            ].map((feature, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="text-black text-2xl dark:text-indigo-400">{feature.icon}</div>
                <div>
                  <h3 className="text-xl font-bold text-black dark:text-white">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Second Features Row */}
        <div className="mt-12 grid max-w-5xl mx-auto gap-12 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3">
          {/* Left Side (Text) */}
          <div className="flex flex-col justify-center space-y-6">
            {[
              {
                icon: <FiMail />,
                title: "Marketing Tools",
                desc: "Send targeted emails and track conversions.",
              },
              {
                icon: <FiLock />,
                title: "Secure Authentication",
                desc: "Protect your data with role-based access control.",
              },
              {
                icon: <FiUsers />,
                title: "Customer Management",
                desc: "Organize and track customer interactions and history.",
              },
            ].map((feature, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="text-black text-2xl dark:text-indigo-400">{feature.icon}</div>
                <div>
                  <h3 className="text-xl font-bold text-black dark:text-white">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right Side (Image) */}
          <div className="h-full w-full">
            <img
              src={mode === 'light' ? Marketing : DarkMark}
              alt="Marketing Feature"
              className="w-full h-full object-cover rounded-lg shadow-md"
            />
          </div>
        </div>

        {/* Third Features Row */}
        <div className="mt-12 grid max-w-5xl mx-auto gap-12 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3">
          {/* Left Side (Image) */}
         <div className="h-full w-full">
         <img
            src={mode === 'light' ? Appointment : DarkAppointment}
            alt="Calendar Feature"
            className="w-full h-full object-cover rounded-lg shadow-md"
          />
         </div>

          {/* Right Side (Text) */}
          <div className="flex flex-col justify-center space-y-6">
            {[
              {
                icon: <FiCalendar />,
                title: "Appointment Scheduling",
                desc: "Schedule meetings and sync with Google Calendar.",
              },
              {
                icon: <FiMessageSquare />,
                title: "Communication Tools",
                desc: "Stay in touch with customers via chat and email.",
              },
              {
                icon: <FiBarChart2 />,
                title: "Sales Management",
                desc: "Track deals and analyze sales performance.",
              },
            ].map((feature, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="text-black text-2xl dark:text-indigo-400">{feature.icon}</div>
                <div>
                  <h3 className="text-xl font-bold text-black dark:text-white">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
