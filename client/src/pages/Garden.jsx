import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import { Trash2 } from "lucide-react";
import { motion } from "framer-motion";
export default function Garden() {
  // State or 'memory' of component
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetching (talks to node server)
  const fetchNotes = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/notes");
      setNotes(response.data);
    } catch (error) {
      console.error("The garden is wilting:", error);
    }
  }, []); // Empty array means "don't ever change this function"

  // Lifecycle: Run fetchNotes as soon as the app opens
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // Sending a new note to the server
  const plantNote = async (e) => {
    e.preventDefault();
    if (!title || !content) return;

    await axios.post("http://localhost:5000/api/notes", { title, content });
    setTitle("");
    setContent("");
    fetchNotes(); // Refresh Notes
  };

  // Delete Note
  const deleteNote = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/notes/${id}`);
      fetchNotes();
    } catch (error) {
      console.error("Couldn't pull the weed:", error);
    }
  };

  // Filtered List
  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  {
    filteredNotes.length === 0 && (
      <div className="text-center p-12 bg-bg-card rounded-2xl border border-dashed border-stone-300">
        <p className="text-stone-400 font-medium">
          No Seedlings found in this corner of the garden
        </p>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-bg-page p-8 flex flex-col items-center">
      {/* The Greenhouse (Form) */}
      <div className="w-full max-w-md p-8 bg-bg-card rounded-2xl shadow-xl border border-border mb-8">
        <h1 className="text-3xl font-bold text-accent mb-2">Plant A Note</h1>
        <form onSubmit={plantNote} className="flex flex-col gap-4">
          <input
            className="border-b border-border py-2 outline-none focus:border-garden-green transition"
            placeholder="Title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="border-b border-border py-2 outline-none focus:border-garden-green transition resize-none"
            placeholder="What are you thinking?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button className="mt-4 px-6 py-2 bg-garden-green text-white rounded-full hover:bg-opacity-90 transition">
            Plant Seed
          </button>
        </form>
      </div>

      {/* The Garden (List of Notes) */}
      <div className="w-full max-w-md grid gap-4">
        <div className="w-full max-w-md mb-6">
          <input
            type="text"
            placeholder="Search your garden...."
            className="w-full px-5 py-3 rounded-2xl border border-border outline-none focus:ring-2 focus:ring-garden-green/30 bg-bg-card shadow-sm transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {filteredNotes.map((note, index) => (
          <motion.div
            key={note._id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="relative group p-6 bg-bg-card rounded-2xl shadow-sm border border-border hover:shadow-md transition-all duration-300"
          >
            {/* Delete Button: Fixed Positioning */}
            <button
              onClick={() => deleteNote(note._id)}
              className="absolute top-4 right-4 p-2 bg-red-50 text-red-500 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all duration-200 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <h2 className="text-xl font-bold text-accent">{note.title}</h2>
            <p className="text-text-muted mt-2 italic">"{note.content}"</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
