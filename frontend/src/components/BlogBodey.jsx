import React, { useEffect, useState } from "react";
import { Eye, Heart, ThumbsUp, X } from "lucide-react";
import {useNavigate} from "react-router-dom"

// Mock Loader component
const Loader = () => (
  <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-blue-200/20 border-t-blue-400 rounded-full animate-spin"></div>
      <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-purple-400 rounded-full animate-spin animate-reverse" style={{ animationDelay: '-0.5s' }}></div>
    </div>
  </div>
);

// Mock HTML parser
const parse = (html) => <div dangerouslySetInnerHTML={{ __html: html }} />;

export default function FuturisticCard({pid}) {
  const [blog, setBlog] = useState({});
  const [loadError, setLoadError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [liked, hasLiked] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
  const addViewAndFetch = async () => {
    try {
      await fetch(`http://127.0.0.1:5000/add/views/${pid}`, { method: 'PATCH' });
    } catch (e) {
      console.error("View add failed", e);
    } finally {
      getBlog();
    }
  };

  setLoading(true);
  addViewAndFetch();
}, [pid]);

  const addLike = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:5000/add/likes/${pid}`, { method: 'PATCH' });
      const data = await res.json();
      if (res.status === 200) {
        hasLiked(true)
        getBlog()
        alert("Liked!");
      } else if (res.status == 403){
        hasLiked(true)
        alert(data.message);
      }
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  const removeLike = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/remove/likes/${pid}`, { method: 'PATCH' });
      const data = await response.json();
      if (response.status === 200) {
        alert("Like removed");
        getBlog();
        hasLiked(false);
      } else {
        hasLiked(false)
        alert(data.message);
      }
    } catch (error) {
      console.error("Remove like error:", error);
    }
  };

  const getBlog = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/get/blog/${pid}`);
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

  return (
    <>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden -z-10 scale-90 xs:scale-100">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Card Container */}
      {loading && <Loader />}
      {/* Header Bar */}
      <section className="bg-slate-900/90">
        <div className=" sticky top-0 h-12 border-b border-slate-700/60 backdrop-blur-md">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-400/80 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-400/80 rounded-full"></div>
            <div className="w-3 h-3 bg-green-400/80 rounded-full"></div>
          </div>

          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-slate-600/60 rounded-sm"
                style={{ height: `${8 + i * 2}px` }}
              ></div>
            ))}
          </div>
        </div>

        {/* Metadata */}
        <div className="px-8 py-6 border-b border-slate-700/50 bg-gradient-to-r from-slate-800/30 to-slate-900/20">
          <h3 className="text-2xl font-bold tracking-wide text-white mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {blog.title}
          </h3>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
              <span className="text-slate-300 font-medium">Category:</span>
              <span className="text-blue-300">{blog.category}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
              <span className="text-slate-300 font-medium">Created:</span>
              <span className="text-purple-300">{blog.created}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-indigo-400 rounded-full"></span>
              <span className="text-slate-300 font-medium">Author:</span>
              <span className="text-indigo-300">{blog.author}</span>
            </div>
          </div>
          <div className="flex mt-4 text-slate-400 text-sm gap-6 items-center">
            <span className="flex gap-2 items-center bg-slate-800/40 px-3 py-1 rounded-full border border-slate-600/30">
              <Eye className="w-4 h-4 stroke-blue-400"></Eye>
              <span className="text-slate-300">{blog.views}</span>
            </span>
            <span className="flex gap-2 items-center bg-slate-800/40 px-3 py-1 rounded-full border border-slate-600/30">
              <Heart className="w-4 h-4 fill-red-400 stroke-red-400"></Heart>
              <span className="text-slate-300">{blog.likes}</span>
            </span>
          </div>
        </div>

        {/* Content Area */}
        <div className="h-fit">
          <div className="flex h-full ">
            <div className="w-[3%] border-r bg-gradient-to-b from-slate-800/40 to-slate-900/60 border-slate-700/50">
              <div className="flex flex-col items-center pt-4 space-y-2">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-slate-600/40 rounded-full"
                    style={{ height: `${4 + (i % 3) * 2}px` }}
                  ></div>
                ))}
              </div>
            </div>
            <div className="w-[97%] px-8 py-6 text-base leading-7 tracking-wide text-slate-300">
              <div className="max-w-none pb-12 text-sm xs:text-lg">
                {blog.content ? parse(blog.content) : null}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="absolutebottom-0 right-0 left-0 backdrop-blur-xl bg-slate-900/80 border-t border-slate-700/60 flex">
            {liked ? (
              <button
                onClick={removeLike}
                className="group w-1/2 h-14 flex items-center justify-center gap-3 border-r border-slate-600/50 hover:bg-gradient-to-r hover:from-red-600/20 hover:to-red-500/10 transition-all duration-300 hover:border-red-500/30"
              >
                <span className="font-semibold text-slate-200 group-hover:text-white">Unlike</span>
                <ThumbsUp className="w-5 h-5 rotate-180 text-red-400 group-hover:text-red-300 transition-colors" />
              </button>
            ) : (
              <button
                onClick={addLike}
                className="group w-1/2 h-14 flex items-center justify-center gap-3 border-r border-slate-600/50 hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-500/10 transition-all duration-300 hover:border-blue-500/30"
              >
                <span className="font-semibold text-slate-200 group-hover:text-white">Like</span>
                <ThumbsUp className="w-5 h-5 text-blue-400 group-hover:text-blue-300 transition-colors" />
              </button>
            )}
            <button
            onClick={() => navigate(-1)}
            className="group w-1/2 h-14 flex items-center justify-center gap-3 hover:bg-gradient-to-r hover:from-red-600/20 hover:to-red-500/10 transition-all duration-300 hover:border-red-500/30">
              <span className="font-semibold text-slate-200 group-hover:text-white">Close</span>
              <X className="w-5 h-5 text-slate-400 group-hover:text-red-300 transition-colors" />
            </button>
          </div>
        </div>
      </section>
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-transparent rounded-2xl blur-2xl opacity-60 -z-10"></div>

    </>

  );
}
