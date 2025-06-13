

const { Router } = require("express");
const router = Router();
const TODOS = require("../models/todoSchema.js");
const authenticateusr = require("../middleware/authMiddleware.js");

router.post("/task", authenticateusr, async (req, res) => {
  const { input } = req.body;

  if (!input || input.trim() === "") {
    return res.status(400).json({ message: "No task inputted" });
  }

  try {
    const newTask = await TODOS.create({
      task: input,
      user: req.user._id, 
    });

    return res.status(201).json({
      message: "Task has been logged",
      task: newTask,
    });
  } catch (err) {
    console.error("Error saving task:", err);
    return res.status(500).json({ message: "Server error", error: err });
  }
});

router.delete("/task/:id", authenticateusr, async (req, res) => {
  try {
    const deleted = await TODOS.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!deleted) {
      return res.status(404).json({ message: "Task not found or not yours" });
    }

    res.json({ message: "TOKAY: task deleted", id: req.params.id });
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json({ message: "Error deleting task" });
  }
});

router.get("/get", authenticateusr, async (req, res) => {
  try {
    console.log("Fetching tasks for user ID:", req.user.id);
    const tasks = await TODOS.find({ user: req.user._id });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "sorry failed to fetch your tasks.rs" });
  }
});






module.exports = router;