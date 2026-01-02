import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Admin() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const editId = query.get("edit");

  const [post, setPost] = useState(() => {
    // Use a "Lazy Initializer" to check for drafts before the component even renders
    if (
      typeof window !== "undefined" &&
      !new URLSearchParams(window.location.search).get("edit")
    ) {
      const saved = localStorage.getItem("garden-draft");
      return saved
        ? JSON.parse(saved)
        : { title: "", content: "", tags: "", coverImage: "" };
    }
    return { title: "", content: "", tags: "", coverImage: "" };
  });

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsActive(false);
            alert("Time for a break! Seed planted? 🌿");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]); // Removed timeLeft from dependencies

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // 2. AUTO-SAVE LOGIC
  useEffect(() => {
    if (!isEditing && post.content.length > 10) {
      const saver = setTimeout(() => {
        localStorage.setItem("garden-draft", JSON.stringify(post));
      }, 1000);
      return () => clearTimeout(saver);
    }
  }, [post, isEditing]);

  // 3. FETCH LOGIC
  useEffect(() => {
    if (editId) {
      const fetchPostToEdit = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/posts/id/${editId}`
          );
          setPost({ ...response.data, tags: response.data.tags.join(", ") });
          setIsEditing(true);
        } catch (err) {
          // Fixed unused 'error'
          console.error(err);
          setStatus("Error loading post.");
        }
      };
      fetchPostToEdit();
    }
  }, [editId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedPost = {
        ...post,
        content: post.content.trim(),
        tags: post.tags.split(",").map((t) => t.trim()),
      };
      if (isEditing) {
        await axios.put(
          `http://localhost:5000/api/posts/${editId}`,
          formattedPost
        );
        setStatus("Post updated! ✨");
      } else {
        // FIXED: Changed .put to .post for new entries
        await axios.post("http://localhost:5000/api/posts", formattedPost);
        localStorage.removeItem("garden-draft");
        setStatus("Post published! 🚀");
      }
      setTimeout(() => navigate("/blog"), 2000);
    } catch (err) {
      // Fixed unused 'error'
      console.error(err);
      setStatus("Error saving.");
    }
  };

  const stats = useCallback((text) => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    return { words, minutes: Math.ceil(words / 200) };
  }, []);

  return (
    <div className="min-h-screen bg-white text-stone-900 font-sans">
      {/* FOCUS BAR */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-100 px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-stone-400">
            Focus Flow
          </h2>
          <div
            className={`px-3 py-1 rounded-full font-mono text-sm border ${
              isActive
                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                : "bg-stone-50 border-stone-200 text-stone-500"
            }`}
          >
            {formatTime(timeLeft)}
          </div>
          <button
            onClick={() => setIsActive(!isActive)}
            className="text-[10px] font-bold uppercase text-accent hover:underline"
          >
            {isActive ? "Pause" : "Start Session"}
          </button>
        </div>

        <button
          onClick={handleSubmit}
          className="bg-accent text-white px-5 py-1.5 rounded-full text-xs font-bold hover:shadow-md transition"
        >
          {isEditing ? "Update" : "Publish Seed"}
        </button>
      </div>

      <div className="max-w-6xl mx-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* EDITOR SIDE */}
          <div className="space-y-6 flex flex-col h-[80vh]">
            <input
              value={post.title}
              placeholder="Post Title"
              onChange={(e) => setPost({ ...post, title: e.target.value })}
              className="w-full text-4xl font-bold outline-none placeholder:text-stone-100 border-none focus:ring-0 transition-colors focus:placeholder:text-stone-300"
            />

            <div className="flex gap-4">
              <input
                className="flex-1 text-sm outline-none text-stone-500 border-b border-stone-50 focus:border-stone-200 pb-1"
                value={post.tags}
                placeholder="Tags: React, Life, Coding"
                onChange={(e) => setPost({ ...post, tags: e.target.value })}
              />
              <input
                className="flex-1 text-sm outline-none text-stone-500 border-b border-stone-50 focus:border-stone-200 pb-1"
                value={post.coverImage}
                placeholder="Cover Image URL"
                onChange={(e) =>
                  setPost({ ...post, coverImage: e.target.value })
                }
              />
            </div>
            {/* FIXED TEXTAREA: Changed onChange and style */}
            <textarea
              className="flex-1 w-full text-lg leading-relaxed outline-none resize-none placeholder:text-stone-100 font-serif border-none focus:ring-0 min-h-125"
              value={post.content}
              placeholder="The soil is ready... start typing"
              onChange={(e) => setPost({ ...post, content: e.target.value })}
            />
          </div>

          {/* PREVIEW SIDE */}
          <div className="border-l border-stone-50 pl-12 hidden lg:block overflow-y-auto h-[80vh]">
            <div className="sticky top-0">
              <div className="flex justify-between items-center mb-8">
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-300">
                  Live Preview
                </span>
                <span className="text-[10px] font-bold uppercase text-stone-300">
                  {stats(post.content).words} Words
                </span>
              </div>
              <article className="prose prose-stone prose-emerald max-w-none">
                {post.coverImage && (
                  <img
                    src={post.coverImage}
                    alt="Cover"
                    className="w-full h-48 object-cover mb-8 rounded-2xl opacity-80"
                  />
                )}
                <h1 className="text-4xl font-bold mb-4">
                  {post.title || "Untitled Seed"}
                </h1>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {post.content}
                </ReactMarkdown>
              </article>
            </div>
          </div>
        </div>
      </div>
      {status && (
        <div className="fixed bottom-8 right-8 bg-stone-900 text-white px-6 py-3 rounded-xl shadow-2xl text-sm font-bold">
          {status}
        </div>
      )}
    </div>
  );
}
