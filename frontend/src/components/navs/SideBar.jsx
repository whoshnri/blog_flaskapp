import React from "react";
import { Home, User, Star, BellPlus, Search, BookPlus } from "lucide-react"; // mock icons
import {useNavigate} from "react-router-dom"

const BlogSidebar = ({ scrollToTarget}) => {
  const navigate = useNavigate()

  return (
    <nav className="h-[100vh] border-r border-[hsl(0,0%,30%)] overflow-y-auto bg-[#0f0f0f] text-white px-2 py-6 flex flex-col justify-between">
      {/* Top Content */}
      <div className="space-y-6">
        {/* Header */}
        <header className="grid items-center gap-3 px-2">
          <div className="bg-white w-fit rounded-lg p-2 text-black font-extrabold text-xl">
            hb
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-lg mt-4 font-extrabold text-gray-300">The HB Blog</span>
          </div>
        </header>

        {/* Overview Section */}
        <div className="space-y-2 pt-2">
          <p className="text-sm text-gray-500 px-2">OVERVIEW</p>
          <p
            role="button"
            onClick={() => navigate("/")}
            href="/" className="flex items-center gap-3 text-base hover:text-white px-3 py-2 rounded-md hover:bg-[#1a1a1a]">
            <Home size={16} />
            Home
          </p>
        </div>

        {/* Blog Info */}
        <div className="space-y-2 pt-4">
          <p className="text-sm text-gray-500 px-2">BLOG INFO</p>
          <p
            role="button"
                  onClick={() => navigate("/thebigboss")}

            className="flex items-center gap-3 text-base hover:text-white px-3 py-2 rounded-md hover:bg-[#1a1a1a]">
            <User size={16} />
            About
          </p>
          <p
            role="button"
            onClick={scrollToTarget}
            className="flex items-center gap-3 text-base hover:text-white px-3 py-2 rounded-md hover:bg-[#1a1a1a]">
            <BellPlus size={16} />
            Subscribe
          </p>
          <p
            role="button"
            onClick={() => navigate("/signup")}
            className="flex items-center gap-3 text-base hover:text-white px-3 py-2 rounded-md hover:bg-[#1a1a1a]">
            <BookPlus size={16} />
            Contribute
          </p>
          <p
            role="button"
            onClick={() => navigate("/search")}
            className="flex items-center gap-3 text-base hover:text-white px-3 py-2 rounded-md hover:bg-[#1a1a1a]">
            <Search size={16} />
            Search
          </p>
        </div>
      </div>

      {/* Creator Section */}
      <div
        role="button"
        onClick={() => navigate("/thebigboss")}
        className="flex items-center gap-3 px-2 mt-6 pt-4 border-t border-[hsl(0,0%,30%)]">
        <img
          src="https://via.placeholder.com/36"
          alt="Henry Bassey"
          className="w-10 h-10 rounded-full border object-cover"
        />
        <div className="leading-tight">
          <p className="text-xs font-semibold uppercase">Henry Bassey</p>
          <p className="text-[0.5rem] text-gray-500">Creator</p>
        </div>
      </div>
    </nav>
  );
};

export default BlogSidebar;
