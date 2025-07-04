"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MobileNav from "./navs/MobileNav";
import BlogSidebar from "./navs/SideBar";
import Footer from "./Footer";
import Loader from "./Loader";
import SearchPageComponent from "./Search";
import { Helmet } from "react-helmet-async";

const SearchPage = () => {
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  const [open, setOpen] = useState(false);



  const sidebarClasses = "hidden cd:block min-w-56 h-screen bg-[#0f0f0f] border-r border-gray-800 fixed top-0 left-0 overflow-hidden z-10";
  const mainClasses = `relative ml-0 cd:ml-56 w-full flex-1 custom-scrollbar bg-black text-white ${
    loading || open ? "overflow-hidden" : "overflow-y-auto"
  }`;

  return (
    <>
      <Helmet>
        <title>Search | Quilled</title>
        <meta name="description" content="Search through a wide range of creative blog posts on Quilled. Find insightful, original writing by modern thinkers." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://quilled-5su6.onrender.com/search" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono&display=swap" rel="stylesheet"/>
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Dancing+Script&family=Inter:wght@400;700&display=swap"
      rel="stylesheet"
    />
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="../assets/logo.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Helmet>

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
            <aside className={sidebarClasses}>
              <BlogSidebar />
            </aside>

            {/* Main Content */}
            <main ref={scrollRef} className={mainClasses}>
              <SearchPageComponent open={open} setOpen={setOpen}  setLoading={setLoading} scrollRef={scrollRef} />
              <Footer />
              {loading && <Loader />}
            </main>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default SearchPage;
