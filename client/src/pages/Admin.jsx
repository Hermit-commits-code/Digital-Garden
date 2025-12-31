import { useState } from "react";
import React from "react";
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert tags string to array
      const formattedPost = {
        ...post,
        tags: post.tags.split(",").map((t) => t.trim()),
      };
      await axios.post("http://localhost:5000/api/posts", formattedPost);
      setStatus("Post published successfully! :rocket:");
      setPost({ title: "", content: "", tags: "", coverImage: "" });
    } catch (error) {
      setStatus("Error Publishing post. :x:");
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8 text-stone-800">New Blog Post</h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-8 rounded-2xl shadow-sm border-stone-200"
      >
        <input
          className="w-full text-4xl font-bold outline-none border-b border-stone-100"
          placeholder="Enter title..."
          value={post.title}
          onChange={(e) => setPost({ ...post, title: e.target.value })}
        />

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-stone-400 tracking-widest">
            Cover Image
          </label>
          <div className="flex gap-2">
            <input
              className="w-full outline-none text-stone-500"
              placeholder="Cover Image URL (Unsplash link works best)"
              value={post.coverImage}
              onChange={(e) => setPost({ ...post, coverImage: e.target.value })}
            />
            {/* Quick Link to Unsplash */}
            <a
              href="https://unsplash.com"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-3 bg-stone-800 text-white rounded-lg text-xs font-bold hover:bg-stone-700 transition flex items-center whitespace-nowrap"
            >
              FIND PHOTO
            </a>
          </div>
        </div>
        <input
          className="w-full outline-none text-stone-500"
          placeholder="Tags (comma separated: Coding, Life, React)"
          value={post.tags}
          onChange={(e) => setPost({ ...post, tags: e.target.value })}
        />
        <button className="bg-garden-green text-white px-8 py-3 rounded-full font-bold hover:shadow-lg transition">
          Publish to Library
        </button>
        {status && (
          <p className="mt-4 font-medium text-garden-green">{status}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
          <div className="flex flex-col">
            <label className="text-xs font-bold uppercase text-stone-400 mb-2">
              Editor
            </label>
            <textarea
              className="w-full h-96 p-4 bg-stone-50 rounded-xl font-mono text-sm outline-none border-stone-200 focus:border-garden-green"
              value={post.content}
              onChange={(e) => setPost({ ...post, content: e.target.value })}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-bold uppercase text-stone 400 mb-2">
              Live Preview
            </label>
            <div className="prose prose-stone p-4 bg-white rounded-xl border border-stone-100 h-96 overflow-y-auto">
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
