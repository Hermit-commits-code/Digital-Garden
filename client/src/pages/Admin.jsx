import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Add these
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Admin() {
  const [post, setPost] = useState({
    title: "",
    content: "",
    tags: "",
    coverImage: "",
  });

  const [status, setStatus] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const editId = query.get("edit");

  // Fetch existing post if editId is present
  useEffect(() => {
    if (editId) {
      const fetchPostToEdit = async () => {
        try {
          const res = await axios.get(
            `http://localhost:5000/api/posts/id/${editId}`
          );
          setPost({
            ...res.data,
            tags: res.data.tags.join(", "), // Convert array back to string for input
          });
          setIsEditing(true);
        } catch (error) {
          setStatus("Error loading post for edit.");
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
        // Use PUT for updates
        await axios.put(
          `http://localhost:5000/api/posts/${editId}`,
          formattedPost
        );
        setStatus("Post updated successfully! ✨");
      } else {
        // Use POST for new items
        await axios.post("http://localhost:5000/api/posts", formattedPost);
        setStatus("Post published successfully! 🚀");
      }

      // Optional: Redirect back to blog after a delay
      setTimeout(() => navigate("/blog"), 2000);
    } catch (error) {
      setStatus("Error saving post.");
    }
  };
  // Helper to calculate stats
  const getStats = (text) => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const minutes = Math.ceil(words / 200); // Average reading speed of 200 wpm
    return { words, minutes };
  };

  const stats = getStats(post.content);

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8 text-text-main">
        {isEditing ? "Edit Post" : "New Blog Post"}
      </h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-bg-page p-8 rounded-2xl shadow-sm border-border"
      >
        <input
          className="w-full text-4xl font-bold outline-none border-b border-stone-100"
          placeholder="Enter title..."
          value={post.title}
          onChange={(e) => setPost({ ...post, title: e.target.value })}
        />

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-text-muted tracking-widest">
            Cover Image
          </label>
          <div className="flex gap-2">
            <input
              className="w-full outline-none text-text-main"
              placeholder="Cover Image URL (Unsplash link works best)"
              value={post.coverImage}
              onChange={(e) => setPost({ ...post, coverImage: e.target.value })}
            />
            {/* Quick Link to Unsplash */}
            <a
              href="https://unsplash.com"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-3 bg-accent text-white rounded-lg text-xs font-bold hover:bg-accent transition flex items-center whitespace-nowrap"
            >
              FIND PHOTO
            </a>
          </div>
        </div>
        <input
          className="w-full outline-none text-text-main"
          placeholder="Tags (comma separated: Coding, Life, React)"
          value={post.tags}
          onChange={(e) => setPost({ ...post, tags: e.target.value })}
        />
        <button className="bg-accent text-white px-8 py-3 rounded-full font-bold hover:shadow-lg transition">
          {isEditing ? "Save Changes" : "Publish to Library"}
        </button>
        {status && (
          <p className="mt-4 font-medium text-garden-green">{status}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
          <div className="flex flex-col">
            <label className="text-xs font-bold uppercase text-muted mb-2">
              Editor
            </label>
            <textarea
              className="w-full h-96 p-4 bg-bg-card rounded-xl font-mono text-sm outline-none border-border focus:border-border"
              value={post.content}
              onChange={(e) => setPost({ ...post, content: e.target.value })}
            />
          </div>
          <div className="flex flex-col">
            <div className="flex justify-between items-end mb-2">
              <label className="text-xs font-bold uppercase text-text-muted tracking-widest">
                Live Preview
              </label>
              <div className="flex gap-4 text-[10px] font-bold uppercase tracking-tighter text-text-muted">
                <span className="bg-bg-page px-2 py-1 rounded border border-border">
                  {stats.words} Words
                </span>
                <span className="bg-bg-page px-2 py-1 rounded border border-border">
                  {stats.minutes} Min Read
                </span>
              </div>
            </div>

            <div className="prose prose-custom max-w-none p-6 bg-bg-card rounded-xl border border-border h-96 overflow-y-auto shadow-inner">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {post.content}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
