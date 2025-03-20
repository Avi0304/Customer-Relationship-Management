import React, { useState, useEffect } from "react";
import axios from "axios";
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
import Swal from "sweetalert2";
import { Card } from "./ui/card";
import { FaEdit } from "react-icons/fa";
import { IoCheckmarkCircleSharp, IoArrowUndoCircle } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import { HiBuildingOffice } from "react-icons/hi2";

const API_URL = "http://localhost:8080/api/tasks";

const TaskManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    dueDate: "",
    company: "",
    priority: "Low",
  });

  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState("All");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch Tasks from Backend
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/all`);
      setTasks(data.tasks);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch tasks";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (editingTask) {
      setEditingTask((prev) => ({ ...prev, [name]: value }));
    } else {
      setNewTask((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Add Task
  const addTask = async () => {
    try {
      const { data } = await axios.post(`${API_URL}/add`, newTask);
      setTasks([...tasks, data.task]);

      Swal.fire({
        icon: "success",
        title: "Task Added",
        text: "Your new task has been successfully added!",
        timer: 2000,
        showConfirmButton: false,
      });

      setNewTask({ title: "", dueDate: "", company: "", priority: "Low" });
      setOpen(false);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to add task",
      });

      setOpen(false);
    }
  };

  // Edit Task
  const startEditing = (task) => setEditingTask({ ...task });

  const saveEdit = async () => {
    if (!editingTask.title || !editingTask.dueDate || !editingTask.company) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Input",
        text: "All fields are required to update the task.",
      });
      return;
    }

    // Format the date to "yyyy-MM-dd"
    const formattedTask = {
      ...editingTask,
      dueDate: new Date(editingTask.dueDate).toISOString().split("T")[0],
    };

    try {
      const { data } = await axios.patch(
        `${API_URL}/update/${editingTask._id}`,
        formattedTask
      );

      setTasks(
        tasks.map((task) => (task._id === data.task._id ? data.task : task))
      );
      setEditingTask(null);

      Swal.fire({
        icon: "success",
        title: "Task Updated",
        text: "Task details have been successfully updated!",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error Response:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to update task";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
      });
    }
  };

  // Toggle Complete
  const toggleComplete = async (id, completed) => {
    Swal.fire({
      title: completed ? "Mark as Incomplete?" : "Mark as Complete?",
      text: `Are you sure you want to ${completed ? "undo" : "complete"} this task?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { data } = await axios.patch(`${API_URL}/toggle/${id}`, {
            completed: !completed,
          });
  
          setTasks((prevTasks) =>
            prevTasks.map((task) => (task._id === id ? data.task : task))
          );
  
          Swal.fire({
            icon: "success",
            title: "Updated!",
            text: `Task has been ${completed ? "marked incomplete" : "completed"}.`,
          });
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to toggle task completion",
          });
        }
      }
    });
  };
  

  // Delete Task
  const deleteTask = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_URL}/delete/${id}`);
          setTasks(tasks.filter((task) => task._id !== id));

          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "Your task has been deleted.",
            timer: 2000,
            showConfirmButton: false,
          });
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to delete task",
          });
        }
      }
    });
  };

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
          startIcon={<BiPlus size={20} />}
        >
          Add Task
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
            value={
              newTask.dueDate
                ? new Date(newTask.dueDate).toISOString().split("T")[0]
                : "" // Ensures date is shown in "yyyy-MM-dd"
            }
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
        <DialogActions sx={{ m: 1 }}>
          <Button
            onClick={() => setOpen(false)}
            sx={{ color: "gray", "&:hover": { color: "darkgray" } }}
            size="large"
          >
            Cancel
          </Button>
          <Button
            onClick={addTask}
            color="primary"
            size="large"
            variant="contained"
          >
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
                key={task._id}
                className={`p-5 shadow-md border-l-8 flex justify-between items-center bg-white text-lg ${
                  task.priority === "High"
                    ? "border-red-400"
                    : task.priority === "Medium"
                    ? "border-yellow-400"
                    : "border-green-400"
                } light:bg-white dark:bg-gray-800 shadow-lg dark:shadow-md`}
              >
                {editingTask && editingTask._id === task._id ? (
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
                      value={
                        editingTask.dueDate
                          ? new Date(editingTask.dueDate)
                              .toISOString()
                              .split("T")[0]
                          : "" // Ensures date is shown in "yyyy-MM-dd"
                      }
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
                      sx={{ mt: 2 }}
                    >
                      Save
                    </Button>
                  </div>
                ) : (
                  <>
                    <div>
                      <h4 className="font-semibold">{task.title}</h4>
                      <p className="text-sm light:text-gray-600 dark:text-gray-300 flex items-center">
                        <BiCalendar className="mr-1 mb-1" size={18} />{" "}
                        {task.dueDate
                          ? new Date(task.dueDate)
                              .toLocaleDateString("en-GB") // Formats date as "dd/MM/yyyy"
                              .replace(/\//g, "-") // Replaces slashes with dashes
                          : ""}
                      </p>
                      <p className="text-sm  light:text-gray-600 dark:text-gray-300 flex items-center">
                        <HiBuildingOffice className="mr-1" size={18} />{" "}
                        {task.company}
                      </p>
                    </div>
                    <div className="flex space-x-3">
                      <Button onClick={() => startEditing(task)} size="large">
                        <FaEdit size={22} />
                      </Button>
                      <Button
                        onClick={() => deleteTask(task._id)}
                        color="error"
                        size="large"
                      >
                        <RiDeleteBin6Line className="h-5 w-5 text-red-600" />
                      </Button>
                      <Button
                        onClick={() => toggleComplete(task._id, task.completed)}
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
