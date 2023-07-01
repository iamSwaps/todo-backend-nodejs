const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config(); // Load environment variables from .env file

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_ATLAS_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define Todo schema
const todoSchema = new mongoose.Schema({
  username: String,
  todo: String,
  completed: Boolean,
});

const Todo = mongoose.model("Todo", todoSchema);

const app = express();
app.use(express.json());

// API: Get all todos
app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// API: Get todos for a specific user
app.get("/todos/:username", async (req, res) => {
  const { username } = req.params;
  try {
    const todos = await Todo.find({ username });
    res.json(todos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// API: Create a new todo
app.post("/todos", async (req, res) => {
  const { username, todo, completed } = req.body;
  try {
    const newTodo = new Todo({ username, todo, completed });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// API: Update a todo
app.put("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { todo, completed } = req.body;
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { todo, completed },
      { new: true }
    );
    res.json(updatedTodo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// API: Update the "completed" flag of a todo
app.put("/todos/:id/completed", async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { completed },
      { new: true }
    );
    res.json(updatedTodo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// API: Delete a todo
app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await Todo.findByIdAndRemove(id);
    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start the server
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
