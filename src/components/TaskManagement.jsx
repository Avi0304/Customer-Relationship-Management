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
    if (savedTasks.length > 0) setTasks(savedTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  const addTask = () => {
    if (newTask.title.trim() === "") return;
    setTasks([...tasks, { ...newTask, id: Date.now(), completed: false }]);
    setNewTask({ title: "", dueDate: "", company: "", priority: "Low" });
    setOpen(false);
  };

  const startEditing = (task) => setEditingTask({ ...task });

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

  const deleteTask = (id) => setTasks(tasks.filter((task) => task.id !== id));

  const filteredTasks = tasks.filter((task) => {
    if (filter === "All") return true;
    return filter === "Completed" ? task.completed : !task.completed;
  });

  return (
    <div className="flex flex-col justify-center items-center">
      {/* Header */}
      <div className="flex justify-end w-full">
        <Button
          variant="contained"
          color="primary"
          size="medium"
          onClick={() => setOpen(true)}
        >
          <BiPlus size={20} /> Add Task
        </Button>
      </div>

      {/* Add Task Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>
          <h1 className="font-bold">Add New Task</h1>
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Task Title"
            name="title"
            value={newTask.title}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Due Date"
            type="date"
            name="dueDate"
            value={newTask.dueDate}
            onChange={handleChange}
            fullWidth
            margin="dense"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Company Name"
            name="company"
            value={newTask.company}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <Select
            name="priority"
            value={newTask.priority}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value="Low">Low</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="High">High</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary" size="large">
            Cancel
          </Button>
          <Button onClick={addTask} color="primary" size="large">
            Add Task
          </Button>
        </DialogActions>
      </Dialog>

      {/* Filters */}
      <div className="mt-4 flex justify-center gap-4">
        {["All", "Pending", "Completed"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-5 py-2 rounded text-white text-lg transition ${
              filter === status ? "bg-blue-500" : "bg-gray-400"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="w-full mt-6">
        <h2 className="text-xl font-semibold mb-3">Task List</h2>
        {filteredTasks.length === 0 ? (
          <p className="text-gray-600 text-center text-lg">
            No tasks available.
          </p>
        ) : (
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <Card
                key={task.id}
                className={`p-5 shadow-md border-l-8 flex justify-between items-center bg-white text-lg ${
                  task.priority === "High"
                    ? "border-red-400"
                    : task.priority === "Medium"
                    ? "border-yellow-400"
                    : "border-green-400"
                }`}
              >
                {editingTask && editingTask.id === task.id ? (
                  <div className="w-full">
                    <TextField
                      label="Title"
                      name="title"
                      value={editingTask.title}
                      onChange={(e) =>
                        setEditingTask({
                          ...editingTask,
                          title: e.target.value,
                        })
                      }
                      fullWidth
                      margin="dense"
                    />
                    <TextField
                      label="Due Date"
                      type="date"
                      name="dueDate"
                      value={editingTask.dueDate}
                      onChange={(e) =>
                        setEditingTask({
                          ...editingTask,
                          dueDate: e.target.value,
                        })
                      }
                      fullWidth
                      margin="dense"
                      InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                      label="Company"
                      name="company"
                      value={editingTask.company}
                      onChange={(e) =>
                        setEditingTask({
                          ...editingTask,
                          company: e.target.value,
                        })
                      }
                      fullWidth
                      margin="dense"
                    />
                    <Select
                      name="priority"
                      value={editingTask.priority}
                      onChange={(e) =>
                        setEditingTask({
                          ...editingTask,
                          priority: e.target.value,
                        })
                      }
                      fullWidth
                    >
                      <MenuItem value="Low">Low</MenuItem>
                      <MenuItem value="Medium">Medium</MenuItem>
                      <MenuItem value="High">High</MenuItem>
                    </Select>
                    <Button
                      onClick={saveEdit}
                      variant="contained"
                      color="success"
                      size="large"
                      fullWidth
                      className="mt-2"
                    >
                      Save
                    </Button>
                  </div>
                ) : (
                  <>
                    <div>
                      <h4 className="font-semibold">{task.title}</h4>
                      <p className="text-sm text-gray-600 flex items-center">
                        <BiCalendar className="mr-1" size={18} /> {task.dueDate}
                      </p>
                    </div>
                    <div className="flex space-x-3">
                      <Button onClick={() => startEditing(task)} size="large">
                        <FaEdit size={22} />
                      </Button>
                      <Button
                        onClick={() => deleteTask(task.id)}
                        color="error"
                        size="large"
                      >
                        <MdDelete size={22} />
                      </Button>
                      <Button
                        onClick={() => toggleComplete(task.id)}
                        size="large"
                      >
                        {task.completed ? (
                          <IoArrowUndoCircle size={22} />
                        ) : (
                          <IoCheckmarkCircleSharp size={22} />
                        )}
                      </Button>
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
