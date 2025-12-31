const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true }, // URL Friendly title
    content: { type: String, required: true }, // Will store markdown here.
    excerpt: String, // A short summary for the preview card
    tags: [String],
    coverImage: String,
    readingTime: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
