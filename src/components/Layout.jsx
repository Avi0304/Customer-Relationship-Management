import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SideBar from "./components/SideBar"; // ✅ Corrected import path
import TaskManagement from "./components/TaskManagement"; // ✅ Correct path
import Dashboard from "./pages/DashBoard";

function App() {
  return (
    <Router>
      <div className="flex">
        {/* Sidebar */}
        <SideBar />

        {/* Main Content */}
        <div className="flex-1 p-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/task" element={<TaskManagement />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
