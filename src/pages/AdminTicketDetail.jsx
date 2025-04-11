import React from "react";
import TopNav from "../components/TopNav";
import Sidebar from "../components/SideBar";
import TicketDetailsAdmin from "../components/TicketDetailsAdmin";



function AdminTicketDetail() {
    return (
        <div className="flex min-h-screen flex-col">
            <div className="flex">
                <Sidebar />

                <div className="flex-1">
                    <TopNav title={"Ticket Details"} />

                    <main className="p-6 space-y-4">
                        <TicketDetailsAdmin />
                    </main>
                </div>
            </div>
        </div>
    );
}

export default AdminTicketDetail;
