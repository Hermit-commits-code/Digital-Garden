const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Note = require("./models/Note");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// A simple test route
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Database connected! :maple_leaf:"))
  .catch((error) => console.error("Database connection error:", error));

// CREATE Note Route
app.post("/api/notes", async (request, response) => {
  try {
    const { title, content, status, tags } = request.body;
    const newNote = new Note({ title, content, status, tags });
    const savedNote = await newNote.save();
    response.status(201).json(savedNote);
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
});

// READ Notes
app.get("/api/notes", async (request, response) => {
  try {
    let notes = await Note.find({});
    response.json(notes);
  } catch (error) {
    console.error("Backend Error Details:", error);
    response.status(500).json({ message: error.message });
  }
});

// DELETE Notes
app.delete("/api/notes/:id", async (request, response) => {
  try {
    await Note.findByIdAndDelete(request.params.id);
    response.json({ message: "Note pulled from the garden!" });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});

app.get("/", (request, response) => {
  response.send("The Digital Garden API is sprouting!");
});

app.listen(PORT, () => {
  console.log(`Server is blooming on port ${PORT}`);
});
