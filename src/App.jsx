import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DashBoard from "./pages/DashBoard";
import TaskManagementPage from './pages/TaskManagementPage'
import CustomerDetails from "./components/CustomerDetails";
import CustomerPage from "./pages/CustomerPage";
import Login from './components/Login'
import Signup from './components/SignUp'

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<DashBoard />} />
        <Route path="/task" element={<TaskManagementPage />} />
        <Route path="/customers" element={<CustomerPage />} />
        <Route path="/customer/view/:id" element={<CustomerDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
