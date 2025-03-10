import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DashBoard from "./pages/DashBoard";
import TaskManagementPage from './pages/TaskManagementPage'
import CustomerDetails from "./components/CustomerDetails";
import CustomerPage from "./pages/CustomerPage";
import Login from './components/Login'
import Signup from './components/SignUp'
import LeadPage from "./pages/LeadPage";
import AppointmentPage from "./pages/AppointmentPage";
import SalesPage from "./pages/SalesPage";
import ResetPassword from "./components/ResetPassword";
import ForgetPassword from "./components/ForgetPassword";

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<DashBoard />} />
        <Route path="/leads" element={<LeadPage />} />
        <Route path="/task" element={<TaskManagementPage />} />
        <Route path="/customers" element={<CustomerPage />} />
        <Route path="/customer/view/:id" element={<CustomerDetails />} />
        <Route path="/appointment" element={<AppointmentPage />} />
        <Route path="/sales" element={<SalesPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
