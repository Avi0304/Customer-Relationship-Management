import React from "react";
import Sidebar from "../components/SideBar";
import TopNav from "../components/TopNav";
import CustomerTopNav from "../components/Customer/CustomerTopNav";
import CustomerSidebar from "../components/Customer/CustomerSidebar";


function CustomerDashboard() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex">
        <CustomerSidebar />

        <div className="flex-1">
          <CustomerTopNav title={"Customer Dashboard"} />

          <main className="p-6 space-y-4">
          <h2>Customer Dashboard</h2>
          </main>
        </div>
      </div>
    </div>
  );
}

export default CustomerDashboard;
