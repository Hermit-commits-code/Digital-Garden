import { useState, useEffect, useMemo } from "react"; // Added useMemo
import React from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, Clock } from "lucide-react";

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

export default function PostDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      try {
        const response = await axios.get(
          `http://localhost:5000/api/posts/${slug}`
        );
        setPost(response.data);
      } catch (error) {
        console.error("Post not found", error);
      }
    };
    fetchPost();
  }, [slug]);

  // FIXED: Logic to get ToC headings now handles H2 and H3 and updates properly
  const headings = useMemo(() => {
    if (!post?.content) return [];
    return post.content
      .split("\n")
      .filter((line) => line.match(/^###?\s/))
      .map((line) => {
        const level = line.startsWith("###") ? 3 : 2;
        const text = line.replace(/^###?\s/, "").trim();
        return { text, level, id: text.toLowerCase().replace(/\s+/g, "-") };
      });
  }, [post]);

  useEffect(() => {
    const updateScroll = () => {
      const currentScroll = window.scrollY;
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight) {
        setScrollProgress((currentScroll / scrollHeight) * 100);
      }
    };
    window.addEventListener("scroll", updateScroll);
    return () => window.removeEventListener("scroll", updateScroll);
  }, []);

  // FIXED: Loading guard was incorrectly placed
  if (!post) {
    return (
      <div className="text-center py-20 text-stone-400">
        Loading your story...
      </div>
    );
  }

  return (
    <>
      <div
        className="fixed top-16 left-0 h-1 bg-accent z-50 transition-all duration-150"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* FIXED: Widened from max-w-3xl to max-w-6xl to allow the grid to breathe */}
      <article className="max-w-6xl mx-auto py-10 px-6">
        <Link
          to="/blog"
          className="text-accent font-bold text-sm mb-8 flex items-center gap-2 hover:underline"
        >
          <ArrowLeft size={16} /> Back to Library
        </Link>

        {post.coverImage && (
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-96 object-cover rounded-3xl mb-10 shadow-xl"
          />
        )}

        <header className="mb-12">
          <div className="flex flex-wrap gap-3 mb-6">
            {post.tags?.map((tag) => (
              <span
                key={tag}
                style={getTagStyle(tag)} // Use the same helper function from Blog.jsx
                className="px-3 py-1 rounded-lg text-[11px] font-black uppercase tracking-widest border border-transparent shadow-sm"
              >
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-5xl font-black text-text-main mb-6 leading-tight max-w-4xl">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-text-muted text-[11px] font-bold uppercase tracking-widest bg-bg-card w-fit px-4 py-2 rounded-full border border-border">
            <span className="flex items-center gap-1.5">
              <Clock size={14} /> {post.readingTime}
            </span>
            <span className="text-border">|</span>
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />{" "}
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
          </div>
        </header>

        {/* --- Main Layout Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-16 mt-12 items-start">
          {/* Table of Contents Sidebar */}
          <aside className="hidden lg:block sticky top-28 self-start border-l border-border pl-6">
            <h3 className="text-[10px] font-black uppercase text-text-muted mb-6 tracking-[0.2em]">
              On this page
            </h3>
            <nav>
              <ul className="space-y-4">
                {headings.map((heading, i) => (
                  <li
                    key={i}
                    style={{ paddingLeft: heading.level === 3 ? "1rem" : "0" }}
                  >
                    <a
                      href={`#${heading.id}`}
                      className="text-sm text-text-muted hover:text-accent transition-all block"
                    >
                      {heading.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Main content area */}
          <div className="prose prose-custom lg:prose-xl max-w-none w-full pb-20">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h2: ({ ...props }) => (
                  <h2
                    id={props.children
                      .toString()
                      .toLowerCase()
                      .replace(/\s+/g, "-")}
                    {...props}
                  />
                ),
                h3: ({ ...props }) => (
                  <h3
                    id={props.children
                      .toString()
                      .toLowerCase()
                      .replace(/\s+/g, "-")}
                    {...props}
                  />
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </div>
      </article>
    </>
  );
}
