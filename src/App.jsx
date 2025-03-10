import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashBoard from "./pages/DashBoard";
import TaskManagementPage from "./pages/TaskManagementPage";
import CustomerDetails from "./components/CustomerDetails";
import CustomerPage from "./pages/CustomerPage";
import Login from "./components/Login";
import Signup from "./components/SignUp";
import LeadPage from "./pages/LeadPage";
import AppointmentPage from "./pages/AppointmentPage";
import SalesPage from "./pages/SalesPage";
import ResetPassword from "./components/ResetPassword";
import ForgetPassword from "./components/ForgetPassword";
import PrivateRoute from "./components/PrivateRoute"; // For protected routes
import PublicRoute from "./components/PublicRoute"; // For public routes

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<PublicRoute element={<Login />} />} />
        <Route path="/signup" element={<PublicRoute element={<Signup />} />} />
        <Route path="/forget-password" element={<PublicRoute element={<ForgetPassword />} />} />
        <Route path="/reset-password" element={<PublicRoute element={<ResetPassword />} />} />

      
        <Route path="/" element={<PrivateRoute element={<DashBoard />} />} />
        <Route path="/leads" element={<PrivateRoute element={<LeadPage />} />} />
        <Route path="/task" element={<PrivateRoute element={<TaskManagementPage />} />} />
        <Route path="/customers" element={<PrivateRoute element={<CustomerPage />} />} />
        <Route path="/customer/view/:id" element={<PrivateRoute element={<CustomerDetails />} />} />
        <Route path="/appointment" element={<PrivateRoute element={<AppointmentPage />} />} />
        <Route path="/sales" element={<PrivateRoute element={<SalesPage />} />} />
      </Routes>
    </Router>
  );
}

export default App;
