"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MobileNav from "./navs/MobileNav";
import BlogSidebar from "./navs/SideBar";
import Footer from "./Footer";
import Loader from "./Loader";
import SearchPageComponent from "./Search";

const SearchPage = () => {
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null)


  return (
    <AnimatePresence mode="wait">

        <motion.div
          key="search-page"
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="custom-scrollbar"
        >
          <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <aside className="hidden cd:block min-w-56 h-screen bg-[#0f0f0f] border-r border-gray-800 fixed top-0 left-0 overflow-hidden z-10">
              <BlogSidebar />
            </aside>
            {/* Main Content */}
            <main
          ref={scrollRef}
             className={`relative ml-0 cd:ml-56 w-full flex-1  bg-black text-white ${loading ? "overflow-hidden" : "overflow-y-auto"}`}>
              <SearchPageComponent setLoading={setLoading} scrollRef={scrollRef}/>
              <Footer />


          {loading && <Loader />} 
            </main>
          </div>
        </motion.div>
    </AnimatePresence>
  );
};

export default SearchPage
