import axios from "axios";
import { Dot, Search } from "lucide-react"; // Added Search icon
import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import GardenTracker from "../components/GardenTracker";

const getTagStyle = (tagName) => {
  const hash = tagName
    .split("")
    .reduce((acc, char) => char.charCodeAt(0) + acc, 0);
  const hue = hash % 360;
  return {
    backgroundColor: `hsl(${hue}, 80%, 95%)`,
    color: `hsl(${hue}, 70%, 25%)`,
    borderColor: `hsl(${hue}, 80%, 90%)`,
  };
};

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Search State

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await axios.get("http://localhost:5000/api/posts");
      setPosts(response.data);
    };
    fetchPosts();
  }, []);

  // Filter Logic: Matches Title or Tags
  const filteredPosts = posts.filter((post) => {
    const matchesTitle = post.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesTags = post.tags?.some((tag) =>
      tag.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return matchesTitle || matchesTags;
  });

  return (
    <div className="max-w-4xl mx-auto py-10">
      <header className="mb-12">
        <h1 className="text-5xl font-extrabold text-text-main mb-4">
          The Library
        </h1>
        {/* Activity Heatmap */}
        <GardenTracker posts={posts} />
        <p className="text-xl text-text-muted mb-8">
          Long form thoughts on technology and growth
        </p>

        {/* --- Search Bar --- */}
        <div className="relative group max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 group-focus-within:text-accent transition-colors" />
          <input
            type="text"
            placeholder="Search titles or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-bg-card border border-border rounded-2xl outline-none focus:ring-2 ring-accent/20 focus:border-accent transition-all text-text-main"
          />
        </div>
      </header>

      <div className="grid gap-16">
        {filteredPosts.map((post) => (
          <article key={post._id} className="group relative">
            <Link to={`/blog/${post.slug}`}>
              <div className="flex flex-col md:flex-row gap-8">
                {post.coverImage && (
                  <div className="w-full md:w-64 h-48 overflow-hidden rounded-2xl">
                    <img
                      src={post.coverImage}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition duration-500"
                      alt=""
                    />
                  </div>
                )}
                <div className="flex-1">
                  {/* Metadata Row */}
                  <div className="flex items-center gap-3 text-[11px] mb-3 text-stone-400 font-bold uppercase tracking-[0.2em]">
                    <span>{post.readingTime}</span>
                    <Dot className="w-4 h-4 text-border" />
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>

                  {/* --- THE TAG MAP --- */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags?.map((tag) => (
                      <span
                        key={tag}
                        style={getTagStyle(tag)}
                        className="px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border shadow-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h2 className="text-3xl font-bold text-text-main group-hover:text-accent transition mb-3 leading-tight">
                    {post.title}
                  </h2>
                  <p className="text-text-muted leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>
                </div>
              </div>
            </Link>

            {/* Floating Edit Button */}
            <Link
              to={`/admin?edit=${post._id}`}
              className="absolute -top-2 -right-2 p-2 bg-bg-card border border-border rounded-xl text-[10px] font-black uppercase tracking-tighter opacity-0 group-hover:opacity-100 hover:text-accent transition-all z-20 shadow-lg translate-y-2 group-hover:translate-y-0"
            >
              Edit Post
            </Link>
          </article>
        ))}
      </div>

      {/* Empty State for Search */}
      {filteredPosts.length === 0 && (
        <div className="text-center py-20 border-2 border-dashed border-border rounded-3xl">
          <p className="text-stone-400 font-medium">
            No posts found matching your search.
          </p>
        </div>
      )}
    </div>
  );
}
