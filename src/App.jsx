import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DashBoard from "./pages/DashBoard";
import TaskManagement from "./components/TaskManagement";

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<DashBoard />} />
        <Route path="/task" element={<TaskManagement />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
