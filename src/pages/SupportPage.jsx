import React from "react";
import Sidebar from "../components/SideBar";
import TopNav from "../components/TopNav";
import Support from "../components/Support";

function SupportPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex">
        <Sidebar />

        <div className="flex-1">
          <TopNav title="Customer Support Panel" />

          <main className="p-6 space-y-4">
            <Support />
          </main>
        </div>
      </div>
    </div>
  );
}

export default SupportPage;
