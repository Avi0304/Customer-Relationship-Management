import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import Sidebar from "../components/SideBar";
import TopNav from "../components/TopNav";
import { BiPlus } from "react-icons/bi";
import { Button } from "@mui/material";

const CustomerPage = () => {
  const navigate = useNavigate(),
    location = useLocation();
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState(""); // Added search state

  useEffect(() => {
    fetchCustomers();
  }, [location]);

  const fetchCustomers = async () => {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users"
      );
      if (!response.ok) throw new Error("Failed to fetch");
      const apiData = await response.json(),
        localUsers = JSON.parse(localStorage.getItem("customers") || "[]");
      setCustomers(
        Array.from(
          new Map(
            [...apiData, ...localUsers].map((user) => [user.id, user])
          ).values()
        )
      );
    } catch (err) {
      console.error("Error fetching customers: " + err.message);
    }
  };

  const handleDelete = (id) => {
    confirmAlert({
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this customer?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            const localUsers = JSON.parse(
              localStorage.getItem("customers") || "[]"
            ).filter((user) => user.id !== id);
            localStorage.setItem("customers", JSON.stringify(localUsers));
            setCustomers(customers.filter((c) => c.id !== id));
          },
        },
        {
          label: "No",
        },
      ],
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex">
        <Sidebar />

        <div className="flex-1">
          <TopNav title={"Customers"} />

          <main className="p-6 space-y-4">
            <div className="min-h-screen">
              <div className="container mx-auto max-w-7xl">
                {/* Search and Add Button Container */}
                <div className="flex justify-between items-center mb-8">
                  {/* Search Input */}
                  <div className="mt-1 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Search customers..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="px-4 py-2 border rounded w-64"
                    />
                  </div>
                  {/* Add Button */}
                  <Button
                    variant="contained"
                    color="primary"
                    className="flex items-center gap-2 bg-gray-100 text-black hover:bg-gray-200 px-4 py-2 rounded-md"
                    onClick={() => setOpen(true)}
                  >
                    <BiPlus size={20} /> Add Customer
                  </Button>
                </div>

                {/* Filtered Customers Table */}
                <table className="min-w-full bg-white shadow rounded-xl">
                  <thead className="bg-gray-100">
                    <tr>
                      {["Name", "Email", "Phone", "Actions"].map((title) => (
                        <th key={title} className="px-6 py-4 text-left">
                          {title}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {customers
                      .filter(
                        ({ name, email }) =>
                          name.toLowerCase().includes(search.toLowerCase()) ||
                          email.toLowerCase().includes(search.toLowerCase())
                      )
                      .map(({ id, name, email, phone }) => (
                        <tr key={id} className="hover:bg-gray-50">
                          {[name, email, phone].map((text, i) => (
                            <td key={i} className="px-6 py-4">
                              {text}
                            </td>
                          ))}
                          <td className="px-6 py-4 flex gap-3">
                            {["View", "Edit", "Delete"].map((action) => (
                              <button
                                key={action}
                                onClick={() =>
                                  action === "Delete"
                                    ? handleDelete(id)
                                    : navigate(
                                        `/customer/${action.toLowerCase()}/${id}`
                                      )
                                }
                                className={`px-3 py-1.5 text-sm font-medium rounded ${
                                  action === "Delete"
                                    ? "text-red-600"
                                    : action === "Edit"
                                    ? "text-green-600"
                                    : "text-blue-600"
                                }`}
                              >
                                {action}
                              </button>
                            ))}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default CustomerPage;
