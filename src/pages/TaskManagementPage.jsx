import React from "react";
import Sidebar from "../components/SideBar";
import TopNav from "../components/TopNav";
import TaskManagement from "../components/TaskManagement";

function TasksPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex">
        <Sidebar />

        <div className="flex-1">
          <TopNav title={"Task Management"} />

          <main className="p-6 space-y-4">
            <TaskManagement />
          </main>
        </div>
      </div>
    </div>
  );
}

export default TasksPage;
