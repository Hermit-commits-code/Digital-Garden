import { useState, useEffect } from "react";
import React from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Dot } from "lucide-react";

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
          <div className="flex gap-4 text-stone-400 text-sm uppercase tracking-widest font-bold">
            <span>{post.readingTime}</span>
            <span>
              <Dot />
            </span>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
        </header>
        {/* --- Main Layout Grid --- */}
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Table of Contents Sidebar */}
          <aside className="hidden lg:block w-64 sticky top-28 self-start">
            <h3 className="text-xs font-bold uppercase text-stone-400 mb-4 tracking-widest">
              On this page
            </h3>
            <nav>
              <ul className="space-y-4 border-l border-stone 100 pl-4">
                {headings.map((heading) => (
                  <li key={heading}>
                    <a
                      href={`#${heading.toLowerCase().replace(/\s+/g, "-")}`}
                      className="text-sm text-stone-500 hover:text-garden-green transition-colors duration-200 block"
                    >
                      {heading}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Article Content */}
          <div className="flex-1 max-w-3xl prose prose-stone lg:prose-xl prose-headings:scroll-mt-24">
            {post.coverImage && (
              <img
                src={post.coverImage}
                alt=""
                className="w-full h-96 object-cover rounded-3xl mb-12 shadow-xl"
              />
            )}
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
