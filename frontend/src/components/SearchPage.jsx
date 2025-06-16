"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MobileNav from "./navs/MobileNav";
import BlogSidebar from "./navs/SideBar";
import Footer from "./Footer";
import Loader from "./Loader";
import SearchPageComponent from "./Search";

export const SearchPage = () => {
  const [loader, showLoader] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Fade in animation on mount
    setShow(true);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {show && (
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
            <aside className="hidden cd:block min-w-56 h-screen bg-[#0f0f0f] border-r border-gray-800 fixed top-0 left-0 overflow-y-auto z-10">
              <BlogSidebar />
            </aside>
            <div className="cd:hidden">
              <MobileNav></MobileNav>
            </div>

            {/* Main Content */}
            <main className="ml-0 cd:ml-56 w-full flex-1 overflow-y-auto bg-black text-white">
              <SearchPageComponent />
              <Footer />
            </main>
          </div>

          {loader && <Loader />}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
