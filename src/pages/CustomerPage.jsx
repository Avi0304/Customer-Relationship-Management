import React from "react";
import Sidebar from "../components/SideBar";
import TopNav from "../components/TopNav";
import CustomerDetails from "../components/CustomerDetails";

function CustomerPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex">
        <Sidebar />

        <div className="flex-1">
          <TopNav title={"Customer Management"} />

          <main className="p-6 space-y-4">
            <CustomerDetails />
          </main>
        </div>
      </div>
    </div>
  );
}

export default CustomerPage;
