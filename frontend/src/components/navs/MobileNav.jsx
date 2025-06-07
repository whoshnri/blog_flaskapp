import React, { useState } from "react";
import { Home, Info, Star, Mail, Search } from "lucide-react";

const FloatingNav = () => {
  const [open, setOpen] = useState(false);

  const navItems = [
    { label: "Home", icon: <Home size={18} /> },
    { label: "About", icon: <Info size={18} /> },
    { label: "Search", icon: <Search size={18} /> },
    { label: "Contact", icon: <Mail size={18} /> },
  ];

  return (
    <div className="fixed flex flex-row-reverse top-4 right-5 z-50 font-mono">
      {/* Floating Toggle Circle */}
      <div
        onClick={() => setOpen(!open)}
        className={`
          w-14 z-20 h-14 bg-white text-black rounded-xl flex items-center justify-center 
          cursor-pointer transition-all duration-200 hover:bg-slate-800
        `}
      >
        <span className="text-xl z-20 font-bold select-none">{open ? "X" : "hb"}</span>
      </div>

      {/* Rollout Menu */}
      <div
        className={`
          flex gap-3 scale-[80%] my-2 pl-2 transition-all duration-200 ease-in-out max-[512px]:scale-[50%]
          ${open ? "opacity-100 translate-x-[100px] max-[512px]:translate-x-[100px]" : "opacity-0 translate-x-[120px] pointer-events-none "}
        `}
      >
        {navItems.map(({ label, icon }) => (
          <a
            key={label}
            href={`/${label.toLowerCase()}`}
            className="
              flex items-center gap-2 bg-white text-black rounded-md py-2 px-4 shadow-md 
              hover:bg-gray-200 transition-all duration-300 border border-black
              text-sm font-mono
            "
            onClick={() => setOpen(false)}
          >
            {icon}
            {label}
          </a>
        ))}
      </div>
    </div>
  );
};

export default FloatingNav;
