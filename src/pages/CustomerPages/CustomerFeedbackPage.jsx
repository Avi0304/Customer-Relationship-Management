import React from "react";
import Sidebar from "../../components/SideBar";
import TopNav from "../../components/TopNav";
import CustomerTopNav from "../../components/Customer/CustomerTopNav";
import CustomerSidebar from "../../components/Customer/CustomerSidebar";
import CustomerFeedback from "../../components/Customer/CustomerFeedback";

function CustomerDashboard() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex">
        <CustomerSidebar />

        <div className="flex-1">
          <CustomerTopNav title={"Customer Feedback"} />

          <main className="p-6 space-y-4">
            <CustomerFeedback />
          </main>
        </div>
      </div>
    </div>
  );
}

export default CustomerDashboard;
