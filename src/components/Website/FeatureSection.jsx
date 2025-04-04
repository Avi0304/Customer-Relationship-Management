import React from "react";
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
import Marketing from "./assets/marketing.png";
import Appointment from "./assets/appointment.png";

const FeatureSection = () => {
  return (
    <section
      id="features"
      className="w-full py-12 md:py-24 lg:py-32  xl:py-25 bg-gray-50"
    >
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center space-y-4">
          <span className="inline-block bg-black text-white px-3 py-1 text-sm rounded-lg">
            Key Features
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-black md:text-4xl lg:text-5xl">
            Everything You Need to Manage Your Business
          </h2>

          <p className="mx-auto max-w-2xl text-gray-600 md:text-lg">
            Our CRM solution provides all the tools you need to manage
            customers, track sales, and grow your business.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-12 grid max-w-5xl mx-auto gap-12 lg:grid-cols-2">
          {/* Left Side (Image) */}
          <img
            src={Dashborad}
            alt="Dashboard Feature"
            className="w-full rounded-lg shadow-md"
          />

          {/* Right Side (Features List) */}
          <div className="space-y-6">
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
                <div className="text-black text-2xl">{feature.icon}</div>
                <div>
                  <h3 className="text-xl font-bold text-black">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Second Features Row */}
        <div className="mt-12 grid max-w-5xl mx-auto gap-12 lg:grid-cols-2">
          {/* Left Side (Text) */}
          <div className="space-y-6">
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
                <div className="text-black text-2xl">{feature.icon}</div>
                <div>
                  <h3 className="text-xl font-bold text-black">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right Side (Image) */}
          <img
            src={Marketing}
            alt="Marketing Feature"
            className="w-full rounded-lg shadow-md"
          />
        </div>

        {/* Third Features Row */}
        <div className="mt-12 grid max-w-5xl mx-auto gap-12 lg:grid-cols-2">
          {/* Left Side (Image) */}
          <img
            src={Appointment}
            alt="Calendar Feature"
            className="w-full rounded-lg shadow-md"
          />

          {/* Right Side (Text) */}
          <div className="space-y-6">
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
                <div className="text-black text-2xl">{feature.icon}</div>
                <div>
                  <h3 className="text-xl font-bold text-black">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.desc}</p>
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
