const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Note = require("./models/Note");
const Post = require("./models/Post");
const slugify = require("speakingurl"); // This turns My First Post into my-first-post
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

// --- NOTE ROUTES ---

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

// --- BLOG ROUTES ---
app.get("/api/posts", async (request, response) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    response.json(posts);
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});

app.post("/api/posts", async (request, response) => {
  const { title, content, tags, coverImage } = request.body;

  // Auto-generate a URL-friendly slug from the title
  const slug = slugify(title);

  // Calculate a rough reading time (avg 200 words per minute)
  const words = content.split(" ").length;
  const readingTime = Math.ceil(words / 200) + " min read";

  const newPost = new Post({
    title,
    slug,
    content,
    tags,
    coverImage,
    readingTime,
    excerpt: content.substring(0, 150) + "...", // First 150 chars as preview
  });

  try {
    const savedPost = await newPost.save();
    response.status(201).json(savedPost);
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
});

app.get("/api/posts/:slug", async (request, response) => {
  try {
    const post = await Post.findOne({ slug: request.params.slug });
    if (!post) return response.status(404).json({ message: "Post not found" });
    response.json(post);
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});

app.get("/api/posts/id/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Also, ensure you have a PUT route for the update logic to work!
app.put("/api/posts/:id", async (req, res) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // This returns the post AFTER it was updated
    );
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
});

app.get("/", (request, response) => {
  response.send("The Digital Garden API is sprouting!");
});

app.listen(PORT, () => {
  console.log(`Server is blooming on port ${PORT}`);
});
