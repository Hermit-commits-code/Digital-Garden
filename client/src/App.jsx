import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Garden from "./pages/Garden";
import Blog from "./pages/Blog";
import PostDetail from "./pages/PostDetail";
import Admin from "./pages/Admin";
import { Sprout, BookOpen, Settings } from "lucide-react";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-bg-page text-text-main">
        <nav className="border-b border-border bg-bg-card/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link
              to="/"
              className="text-xl font-bold text-accent flex items-center gap-2"
            >
              <Sprout className="w-6 h-6" />
              <span>My Digital Space</span>
            </Link>
            <div className="flex gap-8 items-center">
              <Link
                to="/blog"
                className="flex items-center gap-2 hover:text-accent transition"
              >
                <BookOpen className="w-5 h-5" />
                <span className="font-semibold text-sm">Blog</span>
              </Link>
              <Link to="/admin">
                <Settings className="w-5 h-5 text-text-muted hover:rotate-90 transition-transform duration-500" />
              </Link>
            </div>
          </div>
        </nav>

        {/* Global Page Transition */}
        <motion.main
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-5xl mx-auto py-10 px-6"
        >
          <Routes>
            <Route path="/" element={<Garden />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<PostDetail />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </motion.main>
      </div>
    </Router>
  );
}

export default App;
