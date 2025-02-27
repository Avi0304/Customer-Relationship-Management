import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import { BiPlus, BiCalendar } from "react-icons/bi";
import { Card } from "./ui/card";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { IoCheckmarkCircleSharp, IoArrowUndoCircle } from "react-icons/io5";
import { GrOrganization } from "react-icons/gr";

const TaskManagement = () => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Fix login issue in CRM app",
      dueDate: "2024-07-25",
      priority: "High",
      company: "Acme Inc.",
      completed: true,
    },
    {
      id: 2,
      title: "Review PR for frontend bug fixes",
      dueDate: "2024-07-26",
      priority: "Medium",
      company: "Widget Corp",
      completed: true,
    },
    {
      id: 3,
      title: "Update API documentation",
      dueDate: "2024-07-28",
      company: "Tech Solutions",
      priority: "Low",
      completed: false,
    },
    {
      id: 4,
      title: "Implement authentication in React project",
      dueDate: "2024-07-30",
      company: "Axe IT Solutions",
      priority: "High",
      completed: true,
    },
    {
      id: 5,
      title: "Deploy backend services to AWS",
      dueDate: "2024-08-01",
      priority: "Medium",
      company: "Cloud Services Ltd.",
      completed: false,
    },
  ]);

  const [newTask, setNewTask] = useState({
    title: "",
    dueDate: "",
    company: "",
    priority: "Low",
  });

  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState("All");
  const [open, setOpen] = useState(false);

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
    setNewTask({ title: "", dueDate: "", company: "", priority: "Low" });
    setOpen(false); // Close modal after adding task
  };

  const startEditing = (task) => {
    setEditingTask({ ...task });
  };

  const saveEdit = () => {
    setTasks(
      tasks.map((task) => (task.id === editingTask.id ? editingTask : task))
    );
    setEditingTask(null);
  };

  const toggleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
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
    <div className="flex flex-col justify-center item-center ">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-600 mb-1">
            Manage and Track Tasks
          </h1>
        </div>

        <Button
          variant="contained"
          color="primary"
          className="flex items-center gap-2 bg-gray-100 text-black hover:bg-gray-200 px-4 py-2 rounded-md"
          onClick={() => setOpen(true)}
        >
          <BiPlus size={20} /> Add Task
        </Button>
      </div>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>
          <h1 className="font-bold">Add New Tasks</h1>
          <p className="text-sm font-semibold text-gray-700">
            Create a new task with details.
          </p>
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Task Title"
            name="title"
            value={newTask.title}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Due Date"
            type="date"
            name="dueDate"
            value={newTask.dueDate}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Company Name"
            name="company"
            value={newTask.company}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <Select
            label="Priority"
            name="priority"
            value={newTask.priority}
            onChange={handleChange}
            fullWidth
            margin="normal"
          >
            <MenuItem value="Low">Low</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="High">High</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={addTask} color="primary">
            Add Task
          </Button>
        </DialogActions>
      </Dialog>

      {/* Task Input Section */}
      {/* <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md">
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
          <select
            name="priority"
            value={newTask.priority}
            onChange={handleChange}
            className="p-3 border rounded-md"
          >
            <option value="Low">Low Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="High">High Priority</option>
          </select>
        </div>
        <button
          onClick={addTask}
          className="mt-4 w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700"
        >
          Add Task
        </button>
      </div> */}

      {/* Filters */}
      <div className="mt-4 flex justify-center gap-4">
        <button
          onClick={() => setFilter("All")}
          className={`px-4 py-2 rounded text-white transition ${
            filter === "All"
              ? "bg-blue-500 hover:bg-blue-700"
              : "bg-gray-400 hover:bg-gray-500"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("Pending")}
          className={`px-4 py-2 rounded text-white transition ${
            filter === "Pending"
              ? "bg-yellow-400 hover:bg-yellow-600"
              : "bg-gray-400 hover:bg-gray-500"
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setFilter("Completed")}
          className={`px-4 py-2 rounded text-white transition ${
            filter === "Completed"
              ? "bg-green-400 hover:bg-green-600"
              : "bg-gray-400 hover:bg-gray-500"
          }`}
        >
          Completed
        </button>
      </div>

      {/* Task List */}
      <div className="w-full  mt-6">
        <h2 className="text-xl font-semibold mb-3">Task List</h2>
        {filteredTasks.length === 0 ? (
          <p className="text-gray-600 text-center">No tasks available.</p>
        ) : (
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <Card
                key={task.id}
                className={`p-4 shadow-md bg-white border-l-8 flex justify-between items-center ${
                  task.priority === "High"
                    ? "border-red-400"
                    : task.priority === "Medium"
                    ? "border-yellow-400"
                    : "border-green-400"
                }`}
              >
                {editingTask && editingTask.id === task.id ? (
                  // Edit Form
                  <div className="w-full">
                    <input
                      type="text"
                      name="title"
                      value={editingTask.title}
                      onChange={(e) =>
                        setEditingTask({
                          ...editingTask,
                          title: e.target.value,
                        })
                      }
                      className="w-full p-2 border rounded-md mb-2"
                    />
                    <input
                      type="date"
                      name="dueDate"
                      value={editingTask.dueDate}
                      onChange={(e) =>
                        setEditingTask({
                          ...editingTask,
                          dueDate: e.target.value,
                        })
                      }
                      className="w-full p-2 border rounded-md mb-2"
                    />
                     <input
                      type="text"
                      name="company"
                      value={editingTask.company}
                      onChange={(e) =>
                        setEditingTask({
                          ...editingTask,
                          company: e.target.value,
                        })
                      }
                      className="w-full p-2 border rounded-md mb-2"
                    />
                    <select
                      name="priority"
                      value={editingTask.priority}
                      onChange={(e) =>
                        setEditingTask({
                          ...editingTask,
                          priority: e.target.value,
                        })
                      }
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                    <button
                      onClick={saveEdit}
                      className="mt-2 w-full bg-green-500 text-white p-2 rounded-md"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  // Task View
                  <>
                    <div className="flex justify-between items-center w-full">
                      <div>
                        <h4 className="font-semibold text-lg">{task.title}</h4>
                        <p className="text-sm text-gray-600 flex items-center">
                          <BiCalendar className="mr-1" size={18} />:{" "}
                          {task.dueDate}
                        </p>
                        <p className="text-sm text-gray-600 flex items-center">
                          <GrOrganization className="mr-1" size={16} />:{" "}
                          {task.company}
                        </p>
                        <span className="text-sm font-semibold text-gray-700">
                          {task.priority} Priority
                        </span>
                      </div>
                      <div className="flex space-x-4 min-[w]-120 justify-end">
                        <button
                          onClick={() => startEditing(task)}
                          className="px-3 py-2 rounded-md"
                        >
                          <FaEdit className="text-yellow-500" size={25} />
                        </button>
                        <button
                          onClick={() => toggleComplete(task.id)}
                          className="px-3 py-2 rounded-md"
                        >
                          {task.completed ? (
                            <IoArrowUndoCircle
                              size={25}
                              className="text-blue-500"
                            />
                          ) : (
                            <IoCheckmarkCircleSharp
                              size={25}
                              className="text-green-500"
                            />
                          )}
                        </button>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="px-3 py-2 rounded-md"
                        >
                          <MdDelete size={25} className="text-red-500" />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskManagement;
