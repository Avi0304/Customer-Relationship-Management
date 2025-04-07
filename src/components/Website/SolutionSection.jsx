import React from "react";
import {
  FcBarChart,
  FcCheckmark,
  FcBusinessContact,
  FcSalesPerformance,
  FcPrivacy,
  FcCalendar,
  FcSettings,
} from "react-icons/fc";
import { MdEmail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card"; // Importing the card components

function SolutionSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-25  xl:py-25  2xl:py-40">
      {/* Header Section */}
      <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
        <h2 className="text-3xl font-bold leading-[1.1] text-black sm:text-3xl md:text-5xl">
          All-in-One CRM Solution
        </h2>
        <p className="max-w-[85%] leading-normal text-gray-600 sm:text-lg sm:leading-7">
          Streamline your business operations with our comprehensive CRM
          platform. Manage customers, track sales, and grow your business.
        </p>
      </div>

      {/* Features Grid */}
      <div className="mx-auto grid justify-items-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3 lg:gap-8 mt-12">
        {/* Feature Cards */}
        <Card className="transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-3">
          <CardHeader>
            <h3 className="tracking-tight text-sm font-medium text-gray-800">
              Dashboard
            </h3>
            <span className="text-2xl">
              <FcBarChart />
            </span>
          </CardHeader>
          <CardTitle className="text-black text-2xl">Analytics</CardTitle>
          <CardContent>
            Track revenue, sales, and customer metrics in real-time.
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-3">
          <CardHeader>
            <h3 className="tracking-tight text-sm font-medium">
              Task Management
            </h3>
            <span className="text-2xl">
              <FcCheckmark />
            </span>
          </CardHeader>
          <CardTitle className="text-black text-2xl">Productivity</CardTitle>
          <CardContent>Create, update, and track tasks with ease.</CardContent>
        </Card>

        <Card className="transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-3">
          <CardHeader>
            <h3 className="tracking-tight text-sm font-medium">
              Lead Management
            </h3>
            <span className="text-2xl">
              <FcBusinessContact />
            </span>
          </CardHeader>
          <CardTitle className="text-black text-2xl">Conversion</CardTitle>
          <CardContent>
            Convert leads to customers with automated workflows.
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-3">
          <CardHeader>
            <h3 className="tracking-tight text-sm font-medium">Marketing</h3>
            <span className="text-2xl text-green-500">
              <MdEmail />
            </span>
          </CardHeader>
          <CardTitle className="text-black text-2xl">Campaigns</CardTitle>
          <CardContent>
            Send targeted emails and SMS to your customers.
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-3">
          <CardHeader>
            <h3 className="tracking-tight text-sm font-medium">
              Sales Management
            </h3>
            <span className="text-2xl">
              <FcSalesPerformance />
            </span>
          </CardHeader>
          <CardTitle className="text-black text-2xl">Pipeline</CardTitle>
          <CardContent>
            Track deals and optimize your sales process.
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-3">
          <CardHeader>
            <h3 className="tracking-tight text-sm font-medium">
              Authentication
            </h3>
            <span className="text-2xl">
              <FcPrivacy />
            </span>
          </CardHeader>
          <CardTitle className="text-black text-2xl">Security</CardTitle>
          <CardContent>Secure login and user management system.</CardContent>
        </Card>

        <Card className="transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-3">
          <CardHeader>
            <h3 className="tracking-tight text-sm font-medium">
              Customer Management
            </h3>
            <span className="text-2xl text-blue-500">
              <FaUser />
            </span>
          </CardHeader>
          <CardTitle className="text-black text-2xl">Organization</CardTitle>
          <CardContent>
            Organize and manage customer data efficiently.
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-3">
          <CardHeader>
            <h3 className="tracking-tight text-sm font-medium">
              Appointment Scheduling
            </h3>
            <span className="text-2xl">
              <FcCalendar />
            </span>
          </CardHeader>
          <CardTitle className="text-black text-2xl">Meetings</CardTitle>
          <CardContent>
            Book appointments and set reminders via Google Calendar.
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-3">
          <CardHeader>
            <h3 className="tracking-tight text-sm font-medium">
              Customization
            </h3>
            <span className="text-2xl">
              <FcSettings />
            </span>
          </CardHeader>
          <CardTitle className="text-black text-2xl">Flexibility</CardTitle>
          <CardContent>
            Customize your CRM to fit your business needs.
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

export default SolutionSection;
