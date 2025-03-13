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
import Swal from "sweetalert2";
import { Card } from "./ui/card";
import { FaEdit } from "react-icons/fa";
import { IoCheckmarkCircleSharp, IoArrowUndoCircle } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import { HiBuildingOffice } from "react-icons/hi2";

const TaskManagement = () => {
  const [tasks, setTasks] = useState([
    {
      "id": 1,
      "title": "Fix login issue in CRM app",
      "dueDate": "2024-07-25",
      "priority": "High",
      "company": "Tata Consultancy Services",
      "completed": true
    },
    {
      "id": 2,
      "title": "Review PR for frontend bug fixes",
      "dueDate": "2024-07-26",
      "priority": "Medium",
      "company": "Infosys Ltd.",
      "completed": true
    },
    {
      "id": 3,
      "title": "Update API documentation",
      "dueDate": "2024-07-28",
      "priority": "Low",
      "company": "Tech Mahindra",
      "completed": false
    },
    {
      "id": 4,
      "title": "Implement authentication in React project",
      "dueDate": "2024-07-30",
      "priority": "High",
      "company": "HCL Technologies",
      "completed": true
    },
    {
      "id": 5,
      "title": "Deploy backend services to AWS",
      "dueDate": "2024-08-01",
      "priority": "Medium",
      "company": "Wipro Technologies",
      "completed": false
    },
    {
      "id": 6,
      "title": "Optimize database queries",
      "dueDate": "2024-08-05",
      "priority": "High",
      "company": "L&T Infotech",
      "completed": false
    },
    {
      "id": 7,
      "title": "Integrate payment gateway",
      "dueDate": "2024-08-08",
      "priority": "High",
      "company": "Paytm Services",
      "completed": true
    },
    {
      "id": 8,
      "title": "Enhance security protocols",
      "dueDate": "2024-08-12",
      "priority": "Medium",
      "company": "HDFC Bank IT",
      "completed": false
    },
    {
      "id": 9,
      "title": "Refactor frontend components",
      "dueDate": "2024-08-15",
      "priority": "Low",
      "company": "Flipkart Technologies",
      "completed": true
    },
    {
      "id": 10,
      "title": "Set up CI/CD pipeline",
      "dueDate": "2024-08-18",
      "priority": "High",
      "company": "Reliance Digital",
      "completed": false
    }
  ]
  );

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
    
    if (!newTask.title.trim() || !newTask.dueDate || !newTask.company) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Please fill in all fields before adding a task.",
        timer: 3000,
        showConfirmButton: true,
      });
      setOpen(false);
      return; 
    }
  
    // If all fields are filled, add the task
    setTasks([...tasks, { ...newTask, id: Date.now(), completed: false }]);
    setNewTask({ title: "", dueDate: "", company: "", priority: "Low" });
  
    Swal.fire({
      icon: "success",
      title: "Task Added",
      text: "Your new task has been successfully added!",
      timer: 2000,
      showConfirmButton: false,
    });
  
    setOpen(false); 
  };
  

  const startEditing = (task) => setEditingTask({ ...task });

  const saveEdit = () => {
    setTasks(
      tasks.map((task) => (task.id === editingTask.id ? editingTask : task))
    );
    setEditingTask(null);

    Swal.fire({
      icon: "success",
      title: "Task Updated",
      text: "The task has been updated successfully!",
      timer: 2000,
      showConfirmButton: false,
    });
  };

  const toggleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleToggleComplete = (taskId, isCompleted) => {
    Swal.fire({
      title: isCompleted ? "Mark as Complete" : "Mark as InCompleted",
      text: isCompleted
        ? "This task will be marked as Complete."
        : "This task will be marked as Incompleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, proceed!",
    }).then((result) => {
      if (result.isConfirmed) {
       
        toggleComplete(taskId, !isCompleted); 

        Swal.fire({
          title: !isCompleted ? "Task InCompleted" : "Task Complete",
          text: !isCompleted
            ? "The task has been marked as Incompleted."
            : "The task has been marked as Complete.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };
  
  

  const deleteTask = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setTasks(tasks.filter((task) => task.id !== id));
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Your task has been deleted.",
          timer: 2000,
          showConfirmButton: false,
        });
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
        <DialogActions sx={{m:1}}>
          <Button onClick={() => setOpen(false)} sx={{ color: "gray", "&:hover": { color: "darkgray" } }} size="large">
            Cancel
          </Button>
          <Button onClick={addTask} color="primary" size="large" variant="contained">
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
                } light:bg-white dark:bg-gray-800 shadow-lg dark:shadow-md`}
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
                      sx={{mt: 2}}
                    >
                      Save
                    </Button>
                  </div>
                ) : (
                  <>
                    <div>
                      <h4 className="font-semibold">{task.title}</h4>
                      <p className="text-sm  light:text-gray-600 dark:text-gray-300 flex items-center">
                        <BiCalendar className="mr-1 mb-1" size={18} /> {task.dueDate}
                      </p>
                      <p className="text-sm  light:text-gray-600 dark:text-gray-300 flex items-center">
                        <HiBuildingOffice  className="mr-1" size={18} /> {task.company}
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
                        <RiDeleteBin6Line className="h-5 w-5 text-red-600" />
                      </Button>
                      <Button
                        onClick={() => handleToggleComplete(task.id, task.completed)}
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
