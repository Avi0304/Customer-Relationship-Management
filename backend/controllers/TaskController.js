const Task = require("../models/Task");
const { createNotification } = require("../utils/notificationService");

const notifyTaskAdded = async (task) => {
  try {
    await createNotification({
      title: "New Task Added",
      message: `Task "${task.title}" has been added.`,
      type: "task",
      userId: task.company,
    });
  } catch (error) {
    console.error("Notification error:", error);
  }
};

// Notify when task priority is updated
const notifyTaskPriorityUpdated = async (
  task,
  previousPriority,
  newPriority
) => {
  try {
    await createNotification({
      title: "Task Priority Updated",
      message: `Task "${task.title}" priority changed from ${previousPriority} to ${newPriority}.`,
      type: "task",
      userId: task.company,
    });
  } catch (error) {
    console.error("Notification error:", error);
  }
};

// Get All Tasks
const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json({ success: true, tasks });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching tasks", error });
  }
};

// Add a New Task
const addTask = async (req, res) => {
  try {
    const { title, dueDate, priority, company } = req.body;

    if (!title || !dueDate || !company) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const newTask = new Task({
      title,
      dueDate,
      priority: priority || "Low",
      company,
    });

    const savedTask = await newTask.save();

    // Try to notify about the task without blocking the response
    notifyTaskAdded(savedTask).catch((error) => {
      console.error("Failed to send notification:", error);
    });
    res.status(201).json({
      success: true,
      message: "Task added successfully",
      task: newTask,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error adding task", error });
  }
};

const updateTask = async (req, res) => {
  try {
    const existingTask = await Task.findById(req.params.id);
    if (!existingTask) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    const previousPriority = existingTask.priority;
    const newPriority = req.body.priority;

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updatedTask) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    // Notify about priority change without blocking the response
    if (newPriority && previousPriority !== newPriority) {
      notifyTaskPriorityUpdated(
        updatedTask,
        previousPriority,
        newPriority
      ).catch((error) => {
        console.error("Failed to send notification:", error);
      });
    }

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({
      success: false,
      message: "Error updating task",
      error: error.message,
    });
  }
};

// Delete Task
const deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error deleting task", error });
  }
};

// Toggle Task Completion
const toggleTaskCompletion = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    task.completed = !task.completed;
    await task.save();

    const statusText = task.completed ? "completed" : "incomplete";
    res
      .status(200)
      .json({ success: true, message: `Task marked as ${statusText}`, task });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error toggling task status", error });
  }
};

module.exports = {
  getAllTasks,
  addTask,
  updateTask,
  deleteTask,
  toggleTaskCompletion,
};
