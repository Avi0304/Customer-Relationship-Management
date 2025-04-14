import React from "react";
import { Navigate } from "react-router-dom";
import NotFoundPage from "../pages/NotFoundPage";

const CustomerRoute = ({ element }) => {
  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  // Not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but is admin
  if (isAdmin) {
    return <NotFoundPage/>
  }

  // Logged in and is a customer
  return element;
};

export default CustomerRoute;
