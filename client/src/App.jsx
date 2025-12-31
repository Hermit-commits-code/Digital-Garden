import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import "./App.css";

function App() {
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
      <div className="text-center p-12 bg-white rounded-2xl border border-dashed border-stone-300">
        <p className="text-stone-400 font-medium">
          No Seedlings found in this corner of the garden
        </p>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-stone-100 p-8 flex flex-col items-center">
      {/* The Greenhouse (Form) */}
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-stone-200 mb-8">
        <h1 className="text-3xl font-bold text-garden-green mb-2">
          Plant A Note
        </h1>
        <form onSubmit={plantNote} className="flex flex-col gap-4">
          <input
            className="border-b border-stone-200 py-2 outline-none focus:border-garden-green transition"
            placeholder="Title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="border-b border-stone-200 py-2 outline-none focus:border-garden-green transition resize-none"
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
            className="w-full px-5 py-3 rounded-2xl border border-stone-200 outline-none focus:ring-2 focus:ring-2 focus:ring-garden-green/30 bg-white shadow-sm transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {filteredNotes.map((note) => (
          <div
            key={note._id}
            className="p-6 bg-white rounded-2xl shadow-md border border-stone-200 transition-all hover:scale-[1.02]"
          >
            {/* Delete Button - Only visible on hover for a clean look */}
            <button
              onClick={() => deleteNote(note._id)}
              className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full group-hover:opacity-100 shadow-lg z-10 cursor-pointer hover:bg-red-600"
              title="Remove this note"
            >
              x
            </button>
            <h2 className="text-xl font-bold text-garden-green">
              {note.title}
            </h2>
            <p className="text-stone-600 mt-2 italic">"{note.content}"</p>
            <div className="mt-4 text-[10px] text-stone-400 uppercase tracking-widest font-bold">
              Planted on {new Date(note.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
