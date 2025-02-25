import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DashBoard from "./pages/DashBoard";
import TaskManagement from "./components/TaskManagement";
import CustomerDetails from "./components/CustomerDetails";
import CustomerPage from "./pages/CustomerPage";
function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<DashBoard />} />
        <Route path="/task" element={<TaskManagement />} />
        <Route path="/customers" element={<CustomerPage />} />
        <Route path="/customer/view/:id" element={<CustomerDetails />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
