import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button, Menu, MenuItem } from "@mui/material";
import { BiPlus, BiChevronDown } from "react-icons/bi";
import { Link } from "react-router-dom";

const Task = () => {
  const [filter, setFilter] = useState("All Tasks");
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const handleFilterChange = (value) => {
    setFilter(value);
    handleCloseMenu();
  };

  const tasks = [
    {
      id: 1,
      title: "Fix login issue in CRM app",
      company: "Acme Inc.",
      due: "Today",
      color: "bg-red-500",
    },
    {
      id: 2,
      title: "Review PR for frontend bug fixes",
      company: "Widget Corp",
      due: "Due Tomorrow",
      color: "bg-yellow-500",
    },
    {
      id: 3,
      title: "Update API documentation",
      company: "Tech Solutions",
      due: "Due Next Week",
      color: "bg-green-500",
    },
    // {
    //   id: 4,
    //   title: "Implement authentication in React project",
    //   company: "Axe IT Solutions",
    //   due: "Due Next Week",
    //   color: "bg-green-500",
    // },
    // {
    //   id: 5,
    //   title: "Deploy backend services to AWS",
    //   company: "Cloud Services Ltd.",
    //   due: "Due Next Week",
    //   color: "bg-green-500",
    // },
  ];

  const filteredTasks = tasks.filter((task) => {
    if (filter === "All Tasks") return true;
    return task.due.toLowerCase().includes(filter.toLowerCase());
  });

  return (
    <Card className="col-span-3 min-h-83.5 bg-white dark:bg-[#1B222D] shadow-lg dark:shadow-md">
      <CardHeader>
        <h1 className="text-2xl font-bold leading-none tracking-tight mb-3">
          Tasks
        </h1>
      </CardHeader>

      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          <Link to='/task'>
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

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
          >
            <MenuItem onClick={() => handleFilterChange("All Tasks")}>
              All Tasks
            </MenuItem>
            <MenuItem onClick={() => handleFilterChange("Today")}>
              Today
            </MenuItem>
            <MenuItem onClick={() => handleFilterChange("Tomorrow")}>
              Tomorrow
            </MenuItem>
            <MenuItem onClick={() => handleFilterChange("Next Week")}>
              Next Week
            </MenuItem>
          </Menu>
        </div>

        <div className="space-y-4">
          {filteredTasks.length > 0 ? (
            filteredTasks.map(({ id, title, company, due, color }) => (
              <div key={id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
                  <div>
                    <p className="text-sm font-medium light:text-gray-800 dark:text-gray-200">{title}</p>
                    <p className="text-xs light:text-gray-500 dark:text-gray-300">{company}</p>
                    <p className="text-xs light:text-gray-500 dark:text-gray-300">{due}</p>
                  </div>
                </div>
                <button className="text-blue-600 dark:text-blue-300 hover:underline text-sm">
                  Mark Complete
                </button>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No tasks found.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Task;
