import React from "react";
import Sidebar from "../components/SideBar";
import TopNav from "../components/TopNav";
import Market from "../components/Marketing";

const MarketingPage = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex">
        <Sidebar />

        <div className="flex-1">
          <TopNav title={"Marketing"} />

          <main className="p-6 space-y-4">
            <Market />
          </main>
        </div>
      </div>
    </div>
  );
};

export default MarketingPage;
