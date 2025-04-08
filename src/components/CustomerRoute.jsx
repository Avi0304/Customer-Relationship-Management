import React from "react";
import { Navigate } from "react-router-dom";

const CustomerRoute = ({ element }) => {
  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  // Not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but is admin
  if (isAdmin) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h1>🚫 Access Denied</h1>
        <p>You do not have permission to access the Customer Dashboard.</p>
      </div>
    );
  }

  // Logged in and is a customer
  return element;
};

export default CustomerRoute;
