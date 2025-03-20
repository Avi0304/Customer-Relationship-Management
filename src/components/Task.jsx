import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button, Menu, MenuItem, CircularProgress } from "@mui/material";
import { BiPlus, BiChevronDown } from "react-icons/bi";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";


const Task = () => {
  const [filter, setFilter] = useState("All Tasks");
  const [anchorEl, setAnchorEl] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTask();
  }, []);

  const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const handleFilterChange = (value) => {
    setFilter(value);
    handleCloseMenu();
  };

  const priorityColor = {
    High: "bg-red-500",
    Medium: "bg-yellow-500",
    Low: "bg-green-500",
  };

  const fetchTask = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8080/api/tasks/all");

      if (response.data.success) {
        setTasks(response.data.tasks);
      }
    } catch (error) {
      console.error("Error in Fetching Tasks:", error);
      setError("Error in Fetching Tasks");
    } finally {
      setLoading(false);
    }
  };

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
          const { data } = await axios.patch(
            `http://localhost:8080/api/tasks/toggle/${id}`,
            { completed: !completed }
          );

          setTasks((prevTasks) =>
            prevTasks.map((task) =>
              task.id === data.task.id ? { ...task, completed: data.task.completed } : task
            )
          );

          Swal.fire({
            icon: "success",
            title: "Updated!",
            text: `Task has been ${data.task.completed ? "completed" : "marked incomplete"}.`,
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


  const filterTasks = () => {
    const today = new Date();
    const Tomorrow = new Date();
    Tomorrow.setDate(today.getDate() + 1);

    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    return tasks
      .filter((task) => {
        if (!task.dueDate) return filter === 'All Tasks';

        const taskDate = new Date(task.dueDate);
        if (filter === 'Today') {
          return (
            taskDate.getFullYear() === today.getFullYear() &&
            taskDate.getMonth() === today.getMonth() &&
            taskDate.getDate() === today.getDate()
          )
        } else if (filter === 'Tomorrow') {
          return (
            taskDate.getFullYear() === today.getFullYear() &&
            taskDate.getMonth() === today.getMonth() &&
            taskDate.getDate() === today.getDate()
          )
        } else if (filter === 'Next Week') {
          return taskDate >= Tomorrow && taskDate <= nextWeek;
        }
        return true;
      })
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 3);
  }

  const filteredTasks = filterTasks();

  return (
    <Card className="col-span-3 min-h-83.5 bg-white dark:bg-[#1B222D] shadow-lg dark:shadow-md">
      <CardHeader>
        <h1 className="text-2xl font-bold leading-none tracking-tight mb-3">
          Tasks
        </h1>
      </CardHeader>

      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          <Link to="/task">
            <Button
              variant="contained"
              color="primary"
              className="flex items-center gap-2 text-black px-4 py-2 rounded-md"
            >
              <BiPlus size={20} /> Add Task
            </Button>
          </Link>

          <Button
            variant="outlined"
            className="flex items-center gap-2 bg-gray-100 text-black hover:bg-gray-200 px-4 py-2 rounded-md"
            onClick={handleOpenMenu}
          >
            <BiChevronDown size={20} /> {filter}
          </Button>

          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
            <MenuItem onClick={() => handleFilterChange("All Tasks")}>All Tasks</MenuItem>
            <MenuItem onClick={() => handleFilterChange("Today")}>Today</MenuItem>
            <MenuItem onClick={() => handleFilterChange("Tomorrow")}>Tomorrow</MenuItem>
            <MenuItem onClick={() => handleFilterChange("Next Week")}>Next Week</MenuItem>
          </Menu>
        </div>

        {loading ? (
          <div className="flex justify-center my-4">
            <CircularProgress size={32} color="primary" />
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTasks.length > 0 ? (
              filteredTasks.map(({ _id, title, company, dueDate, priority, completed, }) => {
                return (
                  <div key={_id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5  rounded-full ${priorityColor[priority?.charAt(0).toUpperCase() + priority?.slice(1).toLowerCase()] || "bg-gray-400"}`} />
                      <div>
                        <p className="text-sm font-medium light:text-gray-800 dark:text-gray-200">{title}</p>
                        <p className="text-xs light:text-gray-500 dark:text-gray-300">{company}</p>
                        <p className="text-xs light:text-gray-500 dark:text-gray-300">{dueDate ? new Date(dueDate).toLocaleString("en-US", {
                          weekday: 'short',
                          month: 'short',
                          day: '2-digit',
                          year: "numeric",
                        }) : "No Due Date"}</p>
                      </div>
                    </div>
                    <button className="text-blue-600 dark:text-blue-300 hover:underline text-sm" onClick={() => toggleComplete(_id, completed)}>
                      {completed ? "Mark InComplete" : "Mark Complete"}
                    </button>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-gray-500">No tasks found.</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Task;
