import React, { useState, useEffect } from "react";
import { Heart, Eye, ArrowRight, Sparkles, Tag, Clock, User, Pencil } from "lucide-react";
import TypedText from "./typedText";
import { useNavigate } from "react-router-dom";
import Notfound from "../assets/notfound.svg"
const API = import.meta.env.VITE_API_BASE_URL;

function getRandomThree(arr) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 7);
}

function HeroSection(blogRef) {
  const [isClient, setIsClient] = useState(false);
  const [featured, setFeatured] = useState([])
  // const featuredBlogs = getRandomThree(featured);
  const [loading, setLoading] = useState(true)
  const [noBlogs, setNoBlogs] = useState(false)
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true)
    const getBlogs = async () => {
      const url = `${API}/get/blogs/recent`;
      try {
        const response = await fetch(url);
        const res = await response.json();
        if (response.status === 200) {
          if (Array.isArray(res) && res.length === 0) {
            setLoading(false)
            setNoBlogs(true);
          } else {
            setFeatured(res);
           setLoading(false)

          }
        } else {
          setNoBlogs(true);
           setLoading(false)

        }
      } catch (err) {
        console.error(err.message);
        setLoading(false)
        setNoBlogs(true);
      }
    };
    getBlogs();
  }, []);

  const mappings = [3, 2, 2, 3, 3, 2]


  return (
    <div
    >
    {!noBlogs && !loading ? (
    <section
     className="bg-[#0f0f0f] w-full xs:py-8 relative min-h-screen py-8 px-4 overflow-hidden">
      <div className="mx-auto">
        <div className="flex items-center justify-center gap-3 mb-12">
          <Sparkles className="w-6 h-6 text-blue-400 animate-pulse" />
          <h2 className="text-2xl font-bold text-white">New Stuff</h2>
          <Sparkles className="w-6 h-6 text-blue-400 animate-pulse delay-500" />
        </div>
        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16 max-w-6xl mx-auto">
          {featured?.map((blog, index) => (
            <BlogCard
              key={index}
              blog={blog}
              navigate={navigate}
            />
          ))}
        </div>

        {/* Blog Button */}
        <div
          onClick={() => navigate("/search")}
          className="flex justify-center ">
          <button className="group relative overflow-hidden bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-neutral-600 border-r border-b border-slate-600 hover:border-slate-500 px-3 py-3  font-semibold text-white shadow-xl hover:shadow-blue-500/20 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95">
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center gap-2">
              <span>Explore More</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </button>
        </div>
      </div>
    </section>
  ) : noBlogs && !loading ? (
    <section
     className="bg-[#0f0f0f] w-full xs:py-8 relative py-8 px-4 overflow-hidden">
      <div className="mx-auto">
        <div className="flex items-center justify-center gap-3 mb-12">
          <Sparkles className="w-6 h-6 text-blue-400 animate-pulse" />
          <h2 className="text-2xl font-bold text-white">Today's Picks</h2>
          <Sparkles className="w-6 h-6 text-blue-400 animate-pulse delay-500" />
        </div>
        <img src={Notfound} alt="Not found" className="mx-auto h-56 mb-6" />

        <div className="text-white text-center">No blogs yet</div>
        <button
          onClick={() => navigate("/login")}
          className="text-sm roman flex items-center gap-2 w-fit mx-auto mt-3 text-gray-200 border border-white px-1 py-1 rounded-lg animate-pulse cursor-pointer hover:text-green-500 hover:border-green-500 hover:scale-105 "><Pencil /></button>
      </div>
    </section>
  ): (
    <section
    className="bg-[#0f0f0f] w-full xs:py-8 relative py-8 px-4 overflow-hidden">
        <div className="flex items-center justify-center gap-3 mb-12">
          <Sparkles className="w-6 h-6 text-blue-400 animate-pulse" />
          <h2 className="text-2xl font-bold text-white">Today's Picks</h2>
          <Sparkles className="w-6 h-6 text-blue-400 animate-pulse delay-500" />
        </div>
    <div className=" mx-auto w-16 h-16 mt-[10%]  animate-spin border-2 rounded-full border-t-transparent border-white"></div>
    <p className="mx-auto w-fit mt-3 text-white font-sans">Loading content . . .</p>
    </section>
  )
}
</div>
)
}

export default HeroSection;

const BlogCard = ({ navigate, blog, className = "" }) => (
  <div
    onClick={() => navigate(`/read/${blog.pid}`)}
    className={`group cursor-pointer relative bg-black/50 border border-gray-800 rounded-lg overflow-hidden hover:border-gray-700 transition-all duration-300 hover:scale-[1.02] ${className}`}
  >
    <div className="p-4">
      <div className="flex items-center gap-1 mb-3 flex-wrap">
        <span className="flex gap-1 items-center text-xs font-medium text-blue-400 bg-blue-400/10 px-2 py-1 rounded-full">
          <Tag className="w-3 h-3" />
          {blog.category}
        </span>
        <span className="text-xs text-gray-600">|</span>
        <span className="flex gap-1 items-center text-xs font-medium text-gray-400 bg-gray-400/10 px-2 py-1 rounded-full">
          <Clock className="w-3 h-3" />
          {blog.created}
        </span>
        <span className="text-xs text-gray-600">|</span>
        <span className="flex gap-1 items-center text-xs font-medium text-gray-400 bg-gray-400/10 px-2 py-1 rounded-full">
          <User className="w-3 h-3" />
          {blog.author}
        </span>
      </div>

      <h3 className="text-sm font-semibold text-white mb-2 leading-tight group-hover:text-gray-300 transition-colors">
        {blog.title}
      </h3>

      <div
        className="text-xs text-gray-400 leading-relaxed mb-3 line-clamp-2 prose prose-invert"
        dangerouslySetInnerHTML={{ __html: blog.desc }}
      ></div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1 text-gray-500">
            <Eye className="w-3 h-3" />
            <span>{blog.views}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-500">
            <Heart className="w-3 h-3" />
            <span>{blog.likes}</span>
          </div>
        </div>

        <ArrowRight className="w-3 h-3 text-gray-600 group-hover:text-gray-400 group-hover:translate-x-1 transition-all duration-300" />
      </div>
    </div>
  </div>
);
