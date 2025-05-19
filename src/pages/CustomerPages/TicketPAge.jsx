import React from "react";
import CustomerTopNav from "../../components/Customer/CustomerTopNav";
import CustomerSidebar from "../../components/Customer/CustomerSidebar";
import Tickets from "../../components/Customer/Tickets";

function TicketPAge() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex">
        <CustomerSidebar />

        <div className="flex-1">
          <CustomerTopNav title={"Tickets"} />

          <main className="p-6 space-y-4">
            <Tickets />
          </main>
        </div>
      </div>
    </div>
  );
}

export default TicketPAge;
