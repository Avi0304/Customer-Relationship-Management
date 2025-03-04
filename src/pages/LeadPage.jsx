import React from "react";
import TopNav from "../components/TopNav";
import Sidebar from "../components/SideBar";
import LeadManagement from "../components/LeadManagement";

const LeadPage = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex">
        <Sidebar />

        <div className="flex-1">
          <TopNav title={"Lead Management"} />

          <main className="p-6 space-y-4">
            <LeadManagement />
          </main>
        </div>
      </div>
    </div>
  );
};

export default LeadPage;
