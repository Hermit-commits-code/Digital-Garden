const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    status: {
      type: String,
      enum: ["seedling", "budding", "evergreen"],
      default: "seedling",
    },
    tags: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Note", NoteSchema);
