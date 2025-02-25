import { useState,useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaTrash, FaEdit, FaSearch } from "react-icons/fa";

const CustomerDetails = () => {
  const { id } = useParams(), navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true), [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const userRes = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
        if (!userRes.ok) throw new Error("Customer not found");
        const userData = await userRes.json();
        setCustomer(userData);

        const invoiceData = [
          { id: 923, date: "Sun Nov 26 2023", amount: 719, status: "Pending" },
          { id: 42, date: "Thu Nov 23 2023", amount: 674, status: "Done" },
          { id: 23, date: "Tue Sep 12 2023", amount: 393, status: "Done" },
          { id: 64, date: "Sun Apr 21 2024", amount: 197, status: "Pending" },
          { id: 334, date: "Thu Feb 15 2024", amount: 970, status: "Failed" },
          { id: 754, date: "Wed Nov 22 2023", amount: 448, status: "Pending" },
        ];
        setInvoices(invoiceData);
        setFilteredInvoices(invoiceData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredInvoices(
      invoices.filter((invoice) =>
        invoice.id.toString().includes(query) || invoice.amount.toString().includes(query)
      )
    );
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending": return "bg-yellow-200 text-yellow-700";
      case "Done": return "bg-green-200 text-green-700";
      case "Failed": return "bg-red-200 text-red-700";
      default: return "bg-gray-200 text-gray-700";
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="h-screen flex items-center justify-center text-red-600">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow-md">
        
        {/* Back Button */}
        <button onClick={() => navigate("/customers")} className="mb-4 px-4 py-2 bg-gray-200 rounded-lg">
          ← Back to Customers
        </button>

        <div className="flex flex-wrap">
          {/* Left Panel - Profile */}
          <div className="w-full md:w-1/3 pr-6 border-r text-center">
            <img src={`https://i.pravatar.cc/150?u=${customer.id}`} alt="Profile" className="w-24 h-24 rounded-full mx-auto mb-4" />
            <h2 className="text-xl font-semibold">{customer.name}</h2>
            <p className="text-gray-500">@{customer.username}</p>
            <p className="text-gray-600">{customer.email}</p>
            <p className="text-gray-600">{customer.phone}</p>
            <button className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg w-full">Send Message</button>
            <h3 className="mt-6 font-semibold">Address</h3>
            <p className="text-gray-600">{customer.address.street}, {customer.address.city}, {customer.address.zipcode}</p>
          </div>

          {/* Right Panel - Invoices */}
          <div className="w-full md:w-2/3 pl-6">
            <h2 className="text-xl font-bold mt-4">Invoices</h2>
            <div className="flex justify-between items-center my-4">
              <div className="relative w-64">
                <input type="text" placeholder="Search number or amount" value={searchQuery} onChange={handleSearch} className="w-full px-4 py-2 pl-10 border rounded-lg" />
                <FaSearch className="absolute left-3 top-3 text-gray-500" />
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">+ Create Invoice</button>
            </div>

            {/* Invoice List */}
            <div className="mt-6">
              <div className="flex justify-between font-semibold text-gray-600 border-b pb-2">
                <span>Invoice</span><span>Status</span><span>Amount</span><span>Manage</span>
              </div>
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((invoice) => (
                  <div key={invoice.id} className="flex justify-between items-center py-2 border-b text-gray-700">
                    <div>
                      <p className="font-semibold">Invoice #{invoice.id}</p>
                      <p className="text-sm text-gray-500">{invoice.date}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-lg text-sm ${getStatusBadge(invoice.status)}`}>
                      {invoice.status}
                    </span>
                    <p>${invoice.amount.toFixed(2)}</p>
                    <div className="flex gap-2">
                      <FaEdit className="text-blue-600 cursor-pointer" />
                      <FaTrash className="text-red-600 cursor-pointer" />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 mt-4">No invoices found</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;
