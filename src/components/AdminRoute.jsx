import { Navigate } from "react-router-dom";

const AdminRoute = ({ element }) => {
  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        backgroundColor: "#f8f8f8",
        color: "#333"
      }}>
        <h1>🚫 Access Denied</h1>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }

  return element;
};

export default AdminRoute;
