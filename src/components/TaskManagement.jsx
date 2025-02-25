import React, { useState, useEffect } from "react";

const TaskManagement = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Fix login issue in CRM app", dueDate: "2024-07-25", priority: "High", completed: true },
    { id: 2, title: "Review PR for frontend bug fixes", dueDate: "2024-07-26", priority: "Medium", completed: true },
    { id: 3, title: "Update API documentation", dueDate: "2024-07-28", priority: "Low", completed: false },
    { id: 4, title: "Implement authentication in React project", dueDate: "2024-07-30", priority: "High", completed: true },
    { id: 5, title: "Deploy backend services to AWS", dueDate: "2024-08-01", priority: "Medium", completed: false },
  ]);

  const [newTask, setNewTask] = useState({
    title: "",
    dueDate: "",
    priority: "Low",
  });

  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(savedTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const addTask = () => {
    if (newTask.title.trim() === "") return;
    setTasks([...tasks, { ...newTask, id: Date.now(), completed: false }]);
    setNewTask({ title: "", dueDate: "", priority: "Low" });
  };

  const startEditing = (task) => {
    setEditingTask({ ...task });
  };

  const saveEdit = () => {
    setTasks(tasks.map((task) => (task.id === editingTask.id ? editingTask : task)));
    setEditingTask(null);
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "All") return true;
    if (filter === "Completed") return task.completed;
    if (filter === "Pending") return !task.completed;
    return false;
  });

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      {/* Header */}
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Task Manager</h1>

      {/* Task Input Section */}
      <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Add New Task</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            name="title"
            value={newTask.title}
            onChange={handleChange}
            placeholder="Task Title"
            className="p-3 border rounded-md"
          />
          <input
            type="date"
            name="dueDate"
            value={newTask.dueDate}
            onChange={handleChange}
            className="p-3 border rounded-md"
          />
          <select name="priority" value={newTask.priority} onChange={handleChange} className="p-3 border rounded-md">
            <option value="Low">Low Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="High">High Priority</option>
          </select>
        </div>
        <button onClick={addTask} className="mt-4 w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700">
          Add Task
        </button>
      </div>

      {/* Filters */}
      <div className="mt-6">
        <button
          onClick={() => setFilter("All")}
          className={`mx-2 px-4 py-2 rounded ${filter === "All" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("Pending")}
          className={`mx-2 px-4 py-2 rounded ${filter === "Pending" ? "bg-yellow-500 text-white" : "bg-gray-200"}`}
        >
          Pending
        </button>
        <button
          onClick={() => setFilter("Completed")}
          className={`mx-2 px-4 py-2 rounded ${filter === "Completed" ? "bg-green-500 text-white" : "bg-gray-200"}`}
        >
          Completed
        </button>
      </div>

      {/* Task List */}
      <div className="w-full max-w-4xl mt-6">
        <h2 className="text-xl font-semibold mb-3">Task List</h2>
        {filteredTasks.length === 0 ? (
          <p className="text-gray-600 text-center">No tasks available.</p>
        ) : (
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center border-l-8"
                style={{
                  borderLeftColor: task.priority === "High" ? "#dc2626" : task.priority === "Medium" ? "#facc15" : "#22c55e",
                }}
              >
                {editingTask && editingTask.id === task.id ? (
                  // Edit Form
                  <div className="w-full">
                    <input
                      type="text"
                      name="title"
                      value={editingTask.title}
                      onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                      className="w-full p-2 border rounded-md mb-2"
                    />
                    <input
                      type="date"
                      name="dueDate"
                      value={editingTask.dueDate}
                      onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })}
                      className="w-full p-2 border rounded-md mb-2"
                    />
                    <select
                      name="priority"
                      value={editingTask.priority}
                      onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value })}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                    <button onClick={saveEdit} className="mt-2 w-full bg-green-500 text-white p-2 rounded-md">
                      Save
                    </button>
                  </div>
                ) : (
                  // Task View
                  <>
                    <div>
                      <h4 className="font-semibold text-lg">{task.title}</h4>
                      <p className="text-sm text-gray-600">Due: {task.dueDate}</p>
                      <span className="text-sm font-semibold text-gray-700">{task.priority} Priority</span>
                    </div>
                    <div className="flex space-x-2">
                      <button onClick={() => startEditing(task)} className="px-3 py-2 bg-yellow-500 text-white rounded-md">
                        Edit
                      </button>
                      <button onClick={() => toggleComplete(task.id)} className="px-3 py-2 bg-blue-600 text-white rounded-md">
                        {task.completed ? "Undo" : "Complete"}
                      </button>
                      <button onClick={() => deleteTask(task.id)} className="px-3 py-2 bg-red-500 text-white rounded-md">
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskManagement;