import React, { useEffect, useState } from "react";
import { Eye, Heart, X, Tag, User, Clock, Copy, Check } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from './Loader'
import Comments from './Comments'
import { AnimatePresence, motion } from "framer-motion";
const API = import.meta.env.VITE_API_BASE_URL;

// Enhanced HTML Parser with dark theme styling
const parse = (html) => {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;

  // Apply dark theme styles to common elements
  const processNode = (node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      if (['p', 'div', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'td', 'th'].includes(node.tagName.toLowerCase())) {
        const currentColor = window.getComputedStyle(node).color;
        if (currentColor === 'rgb(0, 0, 0)' || currentColor === 'black' || !currentColor || currentColor === 'rgba(0, 0, 0, 0)') {
          node.style.color = '#e2e8f0'; // slate-200
        }
      }

      // Style headings
      if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(node.tagName.toLowerCase())) {
        node.style.color = '#f1f5f9'; // slate-100
        node.style.fontWeight = '600';
        node.style.marginTop = '1.5rem';
        node.style.marginBottom = '1rem';
      }

      // Style links
      if (node.tagName.toLowerCase() === 'a') {
        node.style.color = '#60a5fa'; // blue-400
        node.style.textDecoration = 'underline';
      }

      // Style code elements
      if (node.tagName.toLowerCase() === 'code') {
        node.style.backgroundColor = '#1e293b'; // slate-800
        node.style.color = '#94a3b8'; // slate-400
        node.style.padding = '0.125rem 0.25rem';
        node.style.borderRadius = '0.25rem';
        node.style.fontSize = '0.875rem';
      }

      // Style pre elements
      if (node.tagName.toLowerCase() === 'pre') {
        node.style.backgroundColor = '#0f172a'; // slate-900
        node.style.color = '#cbd5e1'; // slate-300
        node.style.padding = '1rem';
        node.style.borderRadius = '0.5rem';
        node.style.overflow = 'auto';
        node.style.border = '1px solid #334155'; // slate-700
      }

      // Style blockquotes
      if (node.tagName.toLowerCase() === 'blockquote') {
        node.style.borderLeft = '4px solid #475569'; // slate-600
        node.style.paddingLeft = '1rem';
        node.style.color = '#94a3b8'; // slate-400
        node.style.fontStyle = 'italic';
      }

      // Process child nodes
      Array.from(node.childNodes).forEach(processNode);
    }
  };

  Array.from(tempDiv.childNodes).forEach(processNode);

  return <div
    dangerouslySetInnerHTML={{ __html: tempDiv.innerHTML }}
    className="prose prose-invert max-w-none prose-headings:text-slate-100 prose-p:text-slate-200 prose-a:text-blue-400 prose-strong:text-slate-100 prose-code:text-slate-300 prose-pre:bg-slate-900"
  />;
};

export default function MinimalistBlogViewer({ pid, scrollRef }) {
  const [blog, setBlog] = useState({});
  const [loading, setLoading] = useState(false);
  const [liked, hasLiked] = useState(false);
  const [showFooter, setShowFooter] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => console.error("Failed to copy: ", err));
  };

  useEffect(() => {
    const addViewAndFetch = async () => {
      try {
        await fetch(`${API}/add/views/${pid}`, { method: 'PATCH' });
      } catch (e) {
        console.error("View add failed", e);
      } finally {
        getBlog();
      }
    };

    setLoading(true);
    addViewAndFetch();
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight - container.clientHeight;
      const scrollProgress = (scrollTop / scrollHeight) * 100;
      setScrollPercent(scrollProgress);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    let timeoutId;

    const handleScroll = () => {
      setShowFooter(true);
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setShowFooter(false), 3000);
    };

    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const getBlog = async () => {
    try {
      const response = await fetch(`${API}/get/blog/${pid}`);
      const res = await response.json();
      if (response.status === 201) {
        setBlog(res);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const addLike = async () => {
    try {
      const res = await fetch(`${API}/add/likes/${pid}`, { method: 'PATCH' });
      const data = await res.json();
      if (res.status === 200) {
        hasLiked(true);
        getBlog();
      } else if (res.status === 403) {
        hasLiked(true);
      }
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  const removeLike = async () => {
    try {
      const res = await fetch(`${API}/remove/likes/${pid}`, { method: 'PATCH' });
      if (res.status === 200) {
        getBlog();
        hasLiked(false);
      } else {
        hasLiked(false);
      }
    } catch (err) {
      console.error("Remove like error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-black text-slate-200">
      {loading && <Loader />}

      {/* Minimal Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-0.5 bg-slate-800 z-50">
        <div
          className="h-full bg-gradient-to-r from-slate-600 to-slate-400 transition-all duration-150 ease-out"
          style={{ width: `${scrollPercent}%` }}
        />
      </div>

      {/* Header */}
      <header className="border-b border-slate-600 bg-black/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 pt-8 py-3">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-100 mb-2 leading-tight">
            {blog.title}
          </h1>

          <div className="flex flex-wrap gap-4 text-sm text-slate-400 mb-2">
            <span className="flex items-center gap-2">
              <Tag className="w-4 h-4" />
              <span className="text-slate-300">{blog.category}</span>
            </span>
            <span className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="text-slate-300">{blog.author}</span>
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="text-slate-300">{blog.created}</span>
            </span>
          </div>

          <div className="flex gap-6 text-slate-400 text-sm">
            <span className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>{blog.views}</span>
            </span>
            <span className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              <span>{blog.likes}</span>
            </span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-8 pb-32">
        <article className="prose prose-invert prose-lg max-w-none mb-12">
          <div className="text-slate-200 leading-relaxed">
            {blog.content ? parse(blog.content) : null}
          </div>
        </article>

        <Comments pid={pid} />
      </main>

      {/* Floating Action Bar */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center z-50">
        <AnimatePresence>
          {showFooter && (
            <motion.div
              initial={{ y: 100, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 100, opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="flex items-center gap-2 bg-slate-900/95 backdrop-blur-sm border border-slate-700 rounded-full px-4 py-3 shadow-xl"
            >
              <button
                onClick={liked ? removeLike : addLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  liked
                    ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-red-400'
                }`}
              >
                <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                {liked ? 'Liked' : 'Like'}
              </button>

              <div className="w-px h-6 bg-slate-700" />

              <button
                onClick={copyLink}
                disabled={copied}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-blue-400 transition-all disabled:opacity-50"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied' : 'Share'}
              </button>

              <div className="w-px h-6 bg-slate-700" />

              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-300 transition-all"
              >
                <X className="w-4 h-4" />
                Close
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
