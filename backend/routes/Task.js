const express = require("express");
const {
  getAllTasks,
  addTask,
  updateTask,
  deleteTask,
  toggleTaskCompletion,
} = require("../controllers/TaskController");

const router = express.Router();

router.get("/all", getAllTasks);
router.post("/add", addTask);
router.patch("/update/:id", updateTask);
router.delete("/delete/:id", deleteTask);
router.patch("/toggle/:id", toggleTaskCompletion);

// Handle invalid routes
router.all("*", (req, res) => {
  res.status(404).json({ success: false, message: "Invalid Route" });
});

module.exports = router;
