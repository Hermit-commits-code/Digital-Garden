import { useState, useEffect } from "react";
import React from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Dot } from "lucide-react";

export default function PostDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // --- Logic to get ToC headings
  const getHeadings = (source) => {
    if (!source) return [];
    // This regex looks for lines starting with ## (H2 tags)
    const headingLines = source
      .split("\n")
      .filter((line) => line.match(/^##\s/));
    return headingLines.map((line) => line.replace("## ", "").trim());
  };

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return; // Don't fetch post if slug is undefined
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

  if (!post) return;
  <div className="text-center py-20 text-stone-400">Loading your story...</div>;
  const headings = getHeadings(post.content);
  return (
    <>
      {/* The Progress Bar */}
      <div
        className="fixed top-16 left-0 h-1 bg-garden-green z-60 transition-all duration-150"
        style={{ width: `${scrollProgress}%` }}
      />
      <article className="max-w-3xl mx-auto py-10">
        <Link
          to="/blog"
          className="text-garden-green font-bold text-sm mb-8 inline-block hover:underline"
        >
          <ArrowLeft /> Back to Library
        </Link>
        {post.coverImage && (
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-80 object-cover rounded-3xl mb-10 shadow-xl"
          />
        )}
        <header className="mb-12 max-w-3xl">
          <h1 className="text-5xl font-black text-stone-900 mb-4 leading-tight">
            {post.title}
          </h1>
          {/* Meta-data  */}
          <div className="flex items-center gap-4 text-stone-400 text-[11px] font-bold uppercase tracking-widest mb-10 bg-stone-50 w-fit px-4 py-2 rounded-full border border-stone-100">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> {post.readingTime}
            </span>
            <span className="text-stone-200">|</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />{" "}
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
          </div>
        </header>
        {/* --- Main Layout Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols[250px_1fr] gap-16 mt-12">
          {/* Table of Contents Sidebar */}
          <aside className="hidden lg:block w-64 sticky top-28 self-start border-l border-stone-100 pl-6">
            <h3 className="text-[10px] font-black uppercase text-stone-400 mb-4 tracking-[0.2em]">
              On this page
            </h3>
            <nav>
              <ul className="space-y-4">
                {headings.map((heading) => (
                  <li key={heading}>
                    <a
                      href={`#${heading.toLowerCase().replace(/\s+/g, "-")}`}
                      className="text-sm text-stone-500 hover:text-garden-green transition-all block"
                    >
                      {heading}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Article Content */}
          <div className="flex-1 prose prose-stone lg:prose-xl max-w-none prose-img:rounded-3xl prose-headings:scroll-mt-28">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>
        </div>
        {/* Markdown Content */}
        <div className="prose prose-stone lg:prose-xl max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>
      </article>
    </>
  );
}
