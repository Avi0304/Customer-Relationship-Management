import React from "react";
import Sidebar from "../components/SideBar";
import TopNav from "../components/TopNav";
import SalesManagement from "../components/SalesManagement";

function AppointmentPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex">
        <Sidebar />

        <div className="flex-1">
          <TopNav title={"Sales Management"} />

          <main className="p-6 space-y-4">
            <SalesManagement />
          </main>
        </div>
      </div>
    </div>
  );
}

export default AppointmentPage;
