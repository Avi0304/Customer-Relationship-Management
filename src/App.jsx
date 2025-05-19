import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Swal from "sweetalert2";
import { useContext, useEffect } from "react";
import { ThemeProvider, ThemeContext } from "./context/ThemeContext";
import { UserProvider } from "./context/UserContext";
import { NotificationProvider } from "./context/NotificationContext";
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
import ProfilePage from "./pages/ProfilePage";
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
import TicketDetailAdmin from "./pages/AdminTicketDetail";
import CustomerFeedback from "./pages/CustomerPages/CustomerFeedbackPage";

function AppContent() {
  const { mode } = useContext(ThemeContext);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkSessionExpiration = () => {
      const token = localStorage.getItem("token");
      const expiresAt = localStorage.getItem("expiresAt");

      if (!token || !expiresAt) return;

      const remainingTime = expiresAt - Date.now();
      console.log("Remaining time in autoLogout: ", remainingTime);

      if (remainingTime <= 0) {
        logoutUser();
      } else {
        // Auto logout after remaining time
        setTimeout(() => {
          logoutUser();
        }, remainingTime);
      }
    };

    const logoutUser = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("isAdmin");
      localStorage.removeItem("expiresAt");

      Swal.fire({
        title: "Session Expired",
        text: "You have been logged out due to inactivity.",
        icon: "warning",
        iconColor: "red",
        confirmButtonText: "OK",
      });

      navigate("/login");
    };

    // Run check when app mounts
    checkSessionExpiration();

    // Also run check on tab switch (user returns to app)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkSessionExpiration();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [navigate, location]);

  return (
    <div className={mode === "dark" ? "dark" : "light"}>
      {/* <Router> */}
      <Routes>
        {/* Public Routes */}
        <Route path="/socket" element={<SocketTest />} />

        <Route path="/" element={<Page />} />
        <Route path="/login" element={<PublicRoute element={<Login />} />} />
        <Route path="/signup" element={<PublicRoute element={<Signup />} />} />
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
          path="/ticket/:id"
          element={<PrivateRoute element={<TicketDetailAdmin />} />}
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
      {/* </Router> */}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <UserProvider>
          <Router>
            <AppContent />
          </Router>
        </UserProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
