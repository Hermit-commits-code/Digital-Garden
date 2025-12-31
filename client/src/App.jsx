import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Garden from "./pages/Garden";
import Blog from "./pages/Blog";
import PostDetail from "./pages/PostDetail";
import "./App.css";
import Admin from "./pages/Admin";
import { Sprout, BookOpen, Settings } from "lucide-react";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-stone-50 font-sans text-stone-900">
        {/* Modern Navigation Bar */}
        <nav className="border-b border-stone-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link
              to="/"
              className="text-xl font-bold text-garden-green flex items-center gap-2"
            >
              <Sprout className="w-6 h-6" />
              <span className="hidden sm:inline">My Digital Space</span>
            </Link>
            <div className="flex gap-8 font-medium text-sm items-center">
              <Link
                to="/"
                className="hover:text-garden-green transition flex items-center gap-2"
              >
                The Garden
              </Link>
              <Link
                to="/blog"
                className="flex flex-row items-center hover:text-garden-green transition gap-2"
              >
                <BookOpen className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-sm">Blog</span>
              </Link>
              <Link
                to="/admin"
                className="text-stone-400 hover:text-stone-600 transition  flex items-center gap-2"
              >
                <Settings className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </nav>

        {/* Main Page Content */}
        <main className="max-w-5xl mx-auto py-10 px-6">
          <Routes>
            <Route path="/" element={<Garden />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<PostDetail />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
