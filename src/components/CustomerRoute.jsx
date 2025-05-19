import React from "react";
import { Navigate } from "react-router-dom";
import NotFoundPage from "../pages/NotFoundPage";

const CustomerRoute = ({ element }) => {
  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (isAdmin) {
    return <NotFoundPage />;
  }

  return element;
};

export default CustomerRoute;
