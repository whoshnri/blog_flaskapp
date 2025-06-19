import React, { useEffect, useState } from "react";
import { Eye, Heart, ThumbsUp, X, Tag, User, Clock, CopyIcon, CheckLine } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from './Loader'
import { AnimatePresence, motion } from "framer-motion";
import { useRef } from "react";
const API = import.meta.env.VITE_API_BASE_URL;

// Simple HTML Parser
const parse = (html) => <div dangerouslySetInnerHTML={{ __html: html }} />;

export default function FuturisticCard({ pid, scrollRef }) {
  const [blog, setBlog] = useState({});
  const [loadError, setLoadError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [liked, hasLiked] = useState(false);
  const [showFooter, setShowFooter] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);
  const [copied, setCopied] = useState(false)
  const navigate = useNavigate();

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 2000);
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
      timeoutId = setTimeout(() => {
        setShowFooter(false);
      }, 3000);
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
        alert("Liked!");
      } else if (res.status === 403) {
        hasLiked(true);
        alert(data.message);
      }
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  const removeLike = async () => {
    try {
      const res = await fetch(`${API}/remove/likes/${pid}`, { method: 'PATCH' });
      const data = await res.json();
      if (res.status === 200) {
        alert("Like removed");
        getBlog();
        hasLiked(false);
      } else {
        hasLiked(false);
        alert(data.message);
      }
    } catch (err) {
      console.error("Remove like error:", err);
    }
  };

  return (
    <>
      {/* Background Pulses */}
      <div className="absolute inset-0 overflow-hidden -z-10 scale-90 xs:scale-100">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {loading && <Loader />}

      <section className="min-h-screen flex flex-col bg-slate-900/90">
        {/* Top Bar */}
        <div className="sticky top-0 h-12 border-b border-slate-700/60 backdrop-blur-md z-40">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
            <div onClick={() => navigate(-1)} className="w-3 h-3 bg-red-400/80 rounded-full cursor-pointer"></div>
            <div className="w-3 h-3 bg-yellow-400/80 rounded-full"></div>
            <div className="w-3 h-3 bg-green-400/80 rounded-full"></div>
          </div>
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-1 bg-slate-600/60 rounded-sm" style={{ height: `${8 + i * 2}px` }}></div>
            ))}
          </div>
          <div className="absolute bottom-0 w-full h-1 z-50">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-slate-700 to-blue-700 transition-all duration-150 ease-out rounded-r-full"
              style={{ width: `${scrollPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Blog Header */}
        <div className="px-8 py-6 border-b border-slate-700/50 bg-gradient-to-r from-slate-800/30 to-slate-900/20">
          <h3 className="text-2xl font-bold text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-3">{blog.title}</h3>
          <div className="flex flex-wrap gap-4 text-sm text-slate-400">
            <span className="flex items-center gap-2 px-2 border border-gray-600 rounded-xl"><Tag className="w-3 h-3" /> <span className="text-blue-300">{blog.category}</span></span>
            <span className="flex items-center gap-2 px-2 border border-gray-600 rounded-xl"><Clock className="w-3 h-3" /> <span className="text-purple-300">{blog.created}</span></span>
            <span className="flex items-center gap-2 px-2 border border-gray-600 rounded-xl"><User className="w-3 h-3" /> <span className="text-indigo-300">{blog.author}</span></span>
          </div>
          <div className="flex mt-4 gap-6 text-slate-400 text-sm items-center">
            <span className="flex gap-2 items-center bg-slate-800/40 px-3 py-1 rounded-full border border-slate-600/30"><Eye className="w-4 h-4 stroke-blue-400" /> <span>{blog.views}</span></span>
            <span className="flex gap-2 items-center bg-slate-800/40 px-3 py-1 rounded-full border border-slate-600/30"><Heart className="w-4 h-4 fill-red-400 stroke-red-400" /> <span>{blog.likes}</span></span>
          </div>
        </div>

        {/* Blog Content */}
        <div className="flex flex-grow">
          <div className="w-[3%] border-r bg-gradient-to-b from-slate-800/40 to-slate-900/60 border-slate-700/50">
            <div className="flex flex-col items-center h-full pt-4 space-y-2">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="w-1 bg-slate-600/40 rounded-full" style={{ height: `${4 + (i % 3) * 2}px` }}></div>
              ))}
            </div>
          </div>
          <div className="w-[97%] px-8 py-3 text-base leading-7 tracking-wide text-slate-300">
            <div className="max-w-none pb-16 text-sm xs:text-lg">{blog.content ? parse(blog.content) : null}</div>
          </div>
        </div>
      </section>

      <div className="fixed bottom-3 left-0 right-0 flex justify-center items-end z-50">
  <AnimatePresence>
    {/* Floating Footer Interaction */}
    {showFooter && (
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="
          w-fit mx-auto
          scale-50 xs:scale-60 sm:scale-75 md:scale-85 lg:scale-90 xl:scale-95 2xl:scale-100
          transition-all duration-500 ease-out
          px-2 xs:px-3 sm:px-4
        "
      >
        <div className="
          flex items-center gap-2 xs:gap-3
          backdrop-blur-2xl bg-slate-800/90
          border border-slate-600/50
          rounded-xl xs:rounded-2xl
          p-1.5 xs:p-2
          shadow-2xl shadow-black/20
          min-w-0
        ">
          {liked ? (
            <button
              onClick={removeLike}
              className="
                group relative overflow-hidden
                bg-gradient-to-r from-rose-600 to-pink-600
                hover:from-rose-500 hover:to-pink-500
                rounded-lg xs:rounded-xl
                px-3 xs:px-4 sm:px-6
                py-2 xs:py-2.5 sm:py-3
                transition-all transform hover:scale-105 active:scale-95
                min-w-0 flex-shrink-0
              "
            >
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative flex items-center gap-1.5 xs:gap-2">
                <Heart className="w-4 h-4 xs:w-5 xs:h-5 text-white fill-current flex-shrink-0" />
                <span className="font-semibold text-white text-xs xs:text-sm whitespace-nowrap">Liked</span>
              </div>
            </button>
          ) : (
            <button
              onClick={addLike}
              className="
                group relative overflow-hidden
                bg-slate-700/80
                hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600
                border border-slate-600/50 hover:border-blue-500/50
                rounded-lg xs:rounded-xl
                px-3 xs:px-4 sm:px-6
                py-2 xs:py-2.5 sm:py-3
                transition-all transform hover:scale-105 active:scale-95
                min-w-0 flex-shrink-0
              "
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative flex items-center gap-1.5 xs:gap-2">
                <Heart className="w-4 h-4 xs:w-5 xs:h-5 text-slate-400 group-hover:text-white flex-shrink-0" />
                <span className="font-semibold text-slate-300 group-hover:text-white text-xs xs:text-sm whitespace-nowrap">Like</span>
              </div>
            </button>
          )}

          <div className="w-px h-6 xs:h-8 bg-slate-600/50 flex-shrink-0"></div>

          <button
            onClick={() => navigate(-1)}
            className="
              group relative overflow-hidden
              bg-slate-700/80
              hover:bg-gradient-to-r hover:from-red-600 hover:to-rose-600
              border border-slate-600/50 hover:border-red-500/50
              rounded-lg xs:rounded-xl
              px-3 xs:px-4 sm:px-6
              py-2 xs:py-2.5 sm:py-3
              transition-all transform hover:scale-105 active:scale-95
              min-w-0 flex-shrink-0
            "
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative flex items-center gap-1.5 xs:gap-2">
              <X className="w-4 h-4 xs:w-5 xs:h-5 text-slate-400 group-hover:text-white flex-shrink-0" />
              <span className="font-semibold text-slate-300 group-hover:text-white text-xs xs:text-sm whitespace-nowrap">Close</span>
            </div>
          </button>

          <div className="w-px h-6 xs:h-8 bg-slate-600/50 flex-shrink-0"></div>

          <button
            disabled={copied}
            onClick={copyLink}
            className="
              group relative overflow-hidden
              bg-slate-700/80
              hover:bg-gradient-to-r hover:from-green-600 hover:to-green-800
              border border-slate-600/50 hover:border-green-500/50
              rounded-lg xs:rounded-xl
              px-3 xs:px-4 sm:px-6
              py-2 xs:py-2.5 sm:py-3
              transition-all transform hover:scale-105 active:scale-95
              min-w-0 flex-shrink-0
            "
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative flex items-center gap-1.5 xs:gap-2">
              {copied ? (
                <CheckLine className="w-4 h-4 xs:w-5 xs:h-5 text-slate-400 group-hover:text-white flex-shrink-0" />
              ) : (
                <CopyIcon className="w-4 h-4 xs:w-5 xs:h-5 text-slate-400 group-hover:text-white flex-shrink-0" />
              )}
              <span className="font-semibold text-slate-300 group-hover:text-white text-xs xs:text-sm whitespace-nowrap">Share</span>
            </div>
          </button>
        </div>

        <div className="absolute -top-1.5 xs:-top-2 left-1/2 transform -translate-x-1/2 flex gap-1">
          <div className="w-0.5 h-0.5 xs:w-1 xs:h-1 bg-blue-400/60 rounded-full animate-pulse"></div>
          <div className="w-0.5 h-0.5 xs:w-1 xs:h-1 bg-blue-400/40 rounded-full animate-pulse delay-75"></div>
          <div className="w-0.5 h-0.5 xs:w-1 xs:h-1 bg-blue-400/60 rounded-full animate-pulse delay-150"></div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
</div>
    </>
  );
}
