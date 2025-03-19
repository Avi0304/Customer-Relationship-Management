const express = require('express');
const {
    getAllTasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion
} = require('../controllers/TaskController');

const router = express.Router();

router.get('/all', getAllTasks);          // Get all tasks
router.post('/add', addTask);             // Add a new task
router.patch('/update/:id', updateTask);  // Update task details
router.delete('/delete/:id', deleteTask); // Delete task
router.patch('/toggle/:id', toggleTaskCompletion); // Toggle task completion status

// Handle invalid routes
router.all('*', (req, res) => {
    res.status(404).json({ success: false, message: 'Invalid Route' });
});

module.exports = router;
