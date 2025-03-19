const Task = require('../models/Task');

// Get All Tasks
const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find();
        res.status(200).json({ success: true, tasks });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching tasks", error });
    }
};

// Add a New Task
const addTask = async (req, res) => {
    try {
        const { title, dueDate, priority, company } = req.body;

        if (!title || !dueDate || !company) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const newTask = new Task({
            title,
            dueDate,
            priority: priority || "Low",
            company
        });

        await newTask.save();
        res.status(201).json({ success: true, message: "Task added successfully", task: newTask });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error adding task", error });
    }
};

// Update Task
const updateTask = async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!updatedTask) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        res.status(200).json({ success: true, message: "Task updated successfully", task: updatedTask });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating task", error });
    }
};

// Delete Task
const deleteTask = async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);

        if (!deletedTask) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        res.status(200).json({ success: true, message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting task", error });
    }
};

// Toggle Task Completion
const toggleTaskCompletion = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        task.completed = !task.completed;
        await task.save();

        const statusText = task.completed ? "completed" : "incomplete";
        res.status(200).json({ success: true, message: `Task marked as ${statusText}`, task });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error toggling task status", error });
    }
};

module.exports = { getAllTasks, addTask, updateTask, deleteTask, toggleTaskCompletion };
