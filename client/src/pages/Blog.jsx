import axios from "axios";
import { Dot } from "lucide-react";
import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Blog() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await axios.get("http://localhost:5000/api/posts");
      setPosts(response.data);
    };
    fetchPosts();
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-12">
        <h1 className="text-5xl font-extrabold text-stone-900 mb-4">
          The Library
        </h1>
        <p className="text-xl text-stone-500">
          Long form thoughts on technology and growth
        </p>
      </header>
      <div className="grid gap-12">
        {posts.map((post) => (
          <article key={post._id} className="group cursor-pointer">
            <Link to={`/blog/${post.slug}`}>
              <div className="flex flex-col md:flex-row gap-6">
                {post.coverImage && (
                  <img
                    src={post.coverImage}
                    className="w-full md:w-64 h-48 object-cover rounded-2xl grayscale group-hover:grayscale-0 transition duration-500"
                    alt=""
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-3 text-sm mb-2 text-garden-green font-bold uppercase tracking-widest">
                    <span>{post.readingTime}</span>
                    <span>
                      <Dot />
                    </span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h2 className="text-3xl font-bold text-stone-800 group-hover:text-garden-green transition mb-3">
                    {post.title}
                  </h2>
                  <p className="text-stone-600 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
