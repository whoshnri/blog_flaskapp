import React, { useState, useEffect } from "react";
import { Heart, Eye , ArrowRight, Sparkles, Tag, Clock, User, Pencil } from "lucide-react";
import TypedText from "./typedText";
import { useNavigate } from "react-router-dom";
import Notfound from "../assets/notfound.svg"




function getRandomThree(arr) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 7);
  }

function HeroSection() {
  const [isClient, setIsClient] = useState(false);
  const [featured , setFeatured] = useState([])
  // const featuredBlogs = getRandomThree(featured);
  const [noBlogs, setNoBlogs] = useState(false)
  const navigate = useNavigate();
  useEffect(() => {
  setIsClient(true);
  const getBlogs = async () => {
    const url = "http://127.0.0.1:5000/get/blogs/recent";
    try {
      const response = await fetch(url);
      const res = await response.json();
      if (response.status === 200) {
        if (Array.isArray(res) && res.length === 0) {
          setNoBlogs(true);
        } else {
          setFeatured(res);
        }
      } else {
        setNoBlogs(true);
      }
    } catch (err) {
      console.error(err.message);
      setNoBlogs(true);
    }
  };
  getBlogs();
}, []);
  const mappings = [3,2,2,3,3,2]


  return !noBlogs ? (
    <section className="bg-[#0f0f0f] w-full xs:py-8 relative  min-h-screen py-24 px-4 overflow-hidden">
      <div className="mx-auto">
        {/* Header */}
        {isClient && (
          <div className=" cursive text-5xl font-black text-white mb-12">
            <TypedText
              strings={["The HB Blog", "Sharing Stories","The HB Blog"]}
              backSpeed={70}
              typeSpeed={130}
              loop={false}
            />
          </div>
        )}
        <div className="flex items-center justify-center gap-3 mb-12">
            <Sparkles className="w-6 h-6 text-blue-400 animate-pulse" />
            <h2 className="text-2xl font-bold text-white">New Stuff</h2>
            <Sparkles className="w-6 h-6 text-blue-400 animate-pulse delay-500" />
          </div>
        {/* Blog Grid */}
        {/* Blog Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-16">
          {/* Featured Large Card */}
          {
            featured?.map((blog, index) => (
            <BlogCard
              key={index}
              blog={blog}
              navigate={navigate}
              className={`lg:col-span-${mappings[index]} h-full`}
            />
          ))}


        </div>

        {/* Blog Button */}
        <div
        onClick={()=> navigate("/search")}
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
  ): (
    <section className="bg-[#0f0f0f] w-full xs:py-8 relative min-h-screen py-24 px-4 overflow-hidden">
      <div className="mx-auto">
        {/* Header */}
        {isClient && (
          <div className=" cursive text-5xl font-black text-white mb-12">
            <TypedText
              strings={["The HB Blog", "Sharing Stories","The HB Blog"]}
              backSpeed={70}
              typeSpeed={130}
              loop={false}
            />
          </div>
        )}
        <div className="flex items-center justify-center gap-3 mb-12">
            <Sparkles className="w-6 h-6 text-blue-400 animate-pulse" />
            <h2 className="text-2xl font-bold text-white">Today's Picks</h2>
            <Sparkles className="w-6 h-6 text-blue-400 animate-pulse delay-500" />
          </div>
          <img src={Notfound} alt="Not found" className="mx-auto h-56 mb-6" />

    <div className="text-white text-center">No blogs yet</div>
    <button
    onClick={() => navigate("/login")}
     className="text-sm roman flex items-center gap-2 w-fit mx-auto mt-3 text-gray-200 border border-white px-1 py-1 rounded-lg animate-pulse cursor-pointer hover:text-green-500 hover:border-green-500 hover:scale-105 "><Pencil/></button>
    </div>
    </section>
  );
}

export default HeroSection;

const BlogCard = ({navigate,blog, className = "" }) => (
  <div
  onClick={() => navigate(`/read/${blog.pid}`)}
  className={`group cursor-pointer relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm overflow-hidden rounded-xl hover:shadow-blue-500/10 transition-all duration-500 hover:scale-[1.02] hover:border-blue-500/30 ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

    <div className="relative">
      <img
        src='https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop'
        alt={blog.title}
        className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
    </div>

    <div className="relative p-3 flex flex-col flex-1">
      <div className="flex items-center gap-1 mb-3">
        <span className="flex gap-1 items-center text-xs font-medium text-blue-400 bg-blue-400/10 px-2 py-1 rounded-full">
        <Tag className="w-3 h-3"/>
          {blog.category}
        </span>
        <span className="text-xs text-slate-500">|</span>
        <span className="flex gap-1 items-center text-xs font-medium text-slate-400 bg-blue-400/10 px-2 py-1 rounded-full"><Tag className="w-3 h-3"/>{blog.created}</span>
        <span className="text-xs text-slate-500">|</span>
        <span className="flex gap-1 items-center text-xs font-medium text-gray-400 bg-blue-400/10 px-2 py-1 rounded-full">
        <User className="w-3 h-3"/>
          {blog.author}
        </span>
      </div>

      <h2 className="text-xl font-bold text-white mb-3 leading-tight group-hover:text-blue-300 transition-colors duration-300">
        {blog.title}
      </h2>

      <div
  className="text-sm text-slate-400 line-clamp-3 flex-1 leading-relaxed mb-4 prose prose-invert"
  dangerouslySetInnerHTML={{ __html: blog.desc }}
></div>
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1 text-slate-500 group-hover:text-blue-400 transition-colors">
          <Eye className="w-4 h-4" />
          <span>{blog.views}</span>
        </div>
        <div className="flex items-center gap-1 text-slate-500 group-hover:text-red-400 transition-colors">
          <Heart className="w-4 h-4 fill-red-500/20" />
          <span>{blog.likes}</span>
        </div>
      </div>
      <div
      onClick={() => navigate(`/read/${blog.pid}`)}
      className=" group/parent hover:bg-black/20 text-sm text-slate-500 flex group-hover:opacity-100 opacity-0 items-center border border-slate-400 rounded-full px-4">
      <p className="">Read Article</p>
      <ArrowRight className="w-5 group-hover/parent:rotate-0 group-hover/parent:translate-x-1 h-5 rotate-[-45deg] transition-transform duration-300" />
      </div>
      </div>
    </div>
  </div>



);
