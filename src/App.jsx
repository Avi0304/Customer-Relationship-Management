import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useContext } from "react";
import { ThemeProvider, ThemeContext } from "./context/ThemeContext";
import { UserProvider } from "./context/UserContext";
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
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import AdminRoute from "./components/AdminRoute";
import MarketingPage from "./pages/MarketingPage";
import ProfilePage from "./pages/ProfilePage"; // Fixed import issue
import SettingsPage from "./pages/SettingsPage";
import Page from "./components/Website/Page";
import { Support } from "@mui/icons-material";
import SupportPage from "./pages/SupportPage";
import CustomerDashboard from "./pages/CustomerPages/CustomerDashboard";
import CustomerRoute from "./components/CustomerRoute";
import TicketPAge from "./pages/CustomerPages/TicketPage";
import CustomerSetting from "./pages/CustomerPages/CustomerSetting";
import CustomerProfilePAge from "./pages/CustomerPages/CustomerProfilePage";
import TicketDetailPage from "./pages/CustomerPages/TicketDetailPage";
import SocketTest from "./pages/SocketTest";


function AppContent() {
  const { mode } = useContext(ThemeContext);

  return (
    <div className={mode === "dark" ? "dark" : "light"}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/socket" element={<SocketTest />} />

          <Route path="/" element={<Page />} />
          <Route path="/login" element={<PublicRoute element={<Login />} />} />
          <Route
            path="/signup"
            element={<PublicRoute element={<Signup />} />}
          />
          <Route
            path="/forget-password"
            element={<PublicRoute element={<ForgetPassword />} />}
          />
          <Route
            path="/reset-password"
            element={<PublicRoute element={<ResetPassword />} />}
          />

          {/* Private Routes */}
          <Route
            path="/dashboard"
            element={<AdminRoute element={<DashBoard />} />}
          />
          <Route
            path="/profile"
            element={<PrivateRoute element={<ProfilePage />} />}
          />
          <Route
            path="/settings/:tab?"
            element={<PrivateRoute element={<SettingsPage />} />}
          />
          <Route
            path="/leads"
            element={<PrivateRoute element={<LeadPage />} />}
          />
          <Route
            path="/task"
            element={<PrivateRoute element={<TaskManagementPage />} />}
          />
          <Route
            path="/customers"
            element={<PrivateRoute element={<CustomerPage />} />}
          />
          <Route
            path="/customer/view/:id"
            element={<PrivateRoute element={<CustomerDetails />} />}
          />
          <Route
            path="/appointment"
            element={<PrivateRoute element={<AppointmentPage />} />}
          />
          <Route
            path="/sales"
            element={<PrivateRoute element={<SalesPage />} />}
          />
          <Route path="/marketing" element={<MarketingPage />} />
          <Route
            path="/support"
            element={<PrivateRoute element={<SupportPage />} />}
          />
          

          <Route
            path="/customer-dashboard"
            element={<CustomerRoute element={<CustomerDashboard />} />}
          />

          <Route
            path="/customer-ticket"
            element={<CustomerRoute element={<TicketPAge />} />}
          />

          <Route
            path="/customer-setting/:tab?"
            element={<CustomerRoute element={<CustomerSetting />} />}
          />

          <Route
            path="/customer-Profile"
            element={<CustomerRoute element={<CustomerProfilePAge />} />}
          />

          <Route
            path="/ticket-detail/:id"
            element={<CustomerRoute element={<TicketDetailPage />} />}
          />

          <Route
            path="/feedback"
            element={<CustomerRoute element={<CustomerFeedback />} />}
          />
        </Routes>
      </Router>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
