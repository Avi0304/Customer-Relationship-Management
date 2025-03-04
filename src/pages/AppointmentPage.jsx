import React from "react";
import Sidebar from "../components/SideBar";
import TopNav from "../components/TopNav";
import AppointmentScheduling from "../components/AppointmentSchedule";

function AppointmentPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex">
        <Sidebar />

        <div className="flex-1">
          <TopNav title={"Appointment Scheduling"} />

          <main className="p-6 space-y-4">
            <AppointmentScheduling />
          </main>
        </div>
      </div>
    </div>
  );
}

export default AppointmentPage;
