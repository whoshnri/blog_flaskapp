import React, { useState, useRef, useEffect } from "react";
import {useNavigate} from "react-router-dom"
import {
  Home,
  User,
  BellPlus,
  BookPlus,
  Search,
  X, LucideMenu
} from "lucide-react";
import bgImg from "../../assets/hehe.jpg"
import logo from "../../assets/logo.svg"





const FloatingNav = ({ scrollToTarget, open , setOpen}) => {
  const navRef = useRef();
  const navigate = useNavigate()

  // Detect outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Clean up
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);


    return (
      <div>
        {/* Floating Toggle Button */}
        {open && <div className="absolute h-[100vh] bg-black/60 z-10 top-0 left-0 right-0 bottom-0"></div>}
        {!open && (
          <div
            onClick={() => setOpen(true)}
            className="w-12 h-12 text-black rounded-xl flex items-center justify-center text-white
          cursor-pointer transition-all duration-200  shadow-lg"
          >
            <LucideMenu className="text-xl font-bold select-none hover:stroke-green-700"/>
          </div>
        )}

        {/* Slide-out Panel */}
        <div
          ref={navRef}
          className={`fixed top-0 right-0 h-screen w-[250px] bg-[#0f0f0f] text-white shadow-2xl transition-transform duration-300 ease-in-out z-10
          ${open ? "translate-x-0" : "translate-x-full"}
        `}
        >
          {/* Close Button */}
          <div className="flex justify-end p-4">
            <button
              onClick={() => setOpen(false)}
              className="text-white p-2 rounded-md hover:bg-[#1a1a1a]"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <nav className="h-[calc(100%-4rem)] flex flex-col justify-between px-4 pb-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Header */}
              <header className="grid items-center gap-3 px-2">

          <div className="flex flex-col leading-tight">
            <span className="text-3xl mt-1 font-extrabold cursive text-white">Quilled</span>
          </div>
        </header>

              {/* Overview */}
              <div className="space-y-2 pt-2">
                <p className="text-xs text-gray-500">OVERVIEW</p>
                <p
                  onClick={() => navigate("/")}
                  role="button"
                  className="flex items-center gap-3 text-sm hover:text-white px-3 py-2 rounded-md hover:bg-[#1a1a1a]"
                >
                  <Home size={16} />
                  Home
                </p>
              </div>

              {/* Blog Info */}
              <div className="space-y-2 pt-4">
                <p className="text-xs text-gray-500">BLOG INFO</p>

                <p
                  role="button"
                  onClick={() => navigate("/thebigboss")}
                  className="flex items-center gap-3 text-sm hover:text-white px-3 py-2 rounded-md hover:bg-[#1a1a1a]"
                >
                  <User size={16} />
                  About
                </p>

                <p
                  role="button"
                  onClick={scrollToTarget}
                  className="flex items-center gap-3 text-sm hover:text-white px-3 py-2 rounded-md hover:bg-[#1a1a1a]"
                >
                  <BellPlus size={16} />
                  Subscribe
                </p>

                <p
                  onClick={() => navigate("/signup")}
                  role="button"
                  className="flex items-center gap-3 text-sm hover:text-white px-3 py-2 rounded-md hover:bg-[#1a1a1a]"
                >
                  <BookPlus size={16} />
                  Contribute
                </p>

                <p
                  role="button"
                  onClick={()=>navigate("/search")}
                  className="flex items-center gap-3 text-sm hover:text-white px-3 py-2 rounded-md hover:bg-[#1a1a1a]"
                >
                  <Search size={16} />
                  Search
                </p>
              </div>
            </div>

            {/* Creator Footer */}
            <div
              role="button"
              onClick={() => navigate("/thebigboss")}
              className="flex items-center gap-3 mt-6 pt-4 border-t border-[hsl(0,0%,30%)]"
            >
              <img
                src={bgImg}
                alt="HenryBassey"
                className="w-10 h-10 rounded-full border object-cover"
              />
              <div className="leading-tight">
                <p className="text-xs font-semibold uppercase">Henry Bassey</p>
                <p className="text-[0.5rem] text-gray-500">Creator</p>
              </div>
            </div>
          </nav>
        </div>
        </div>

    );
  };

  export default FloatingNav;
