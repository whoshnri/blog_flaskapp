"use client"

import { useRef, useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import BlogSidebar from "./components/navs/SideBar"
import MobileNav from "./components/navs/MobileNav"
import HeroSection from "./components/Hero"
import Banner from "./components/Banner"
import { SubscribeSection } from "./components/SubscribeSection"
import Footer from "./components/Footer"
import Comments from "./components/Comments"
import Popup from "./components/Popup"
import Loader from "./components/Loader"
import SignupForm from "./components/Users/SignUp"
import LoginForm from "./components/Users/Login"
import Dashboard from "./components/Dashboard/Dashboard"
import { useNavigate } from "react-router-dom"
import logo from "./assets/logo.svg"
import seo from "./assets/home.jpg?url"
import {Helmet} from "react-helmet-async"

const Layout = () => {
  const targetRef = useRef(null)
  const blogRef = useRef(null)
  const [open, setOpen] = useState(false);

   const EXPIRY_TIME = 24 * 60 * 60 * 1000;
  const [checkedItems, setCheckedItems] = useState({});
  const [isVisible, setIsVisible] = useState(false);

  const scrollToTarget = (e) => {
    e.preventDefault()
    targetRef.current?.scrollIntoView({ behavior: "smooth" })
  }

   const scrollToBlogs = (e) => {
    e.preventDefault()
    blogRef.current?.scrollIntoView({ behavior: "smooth" })
  }


  return (
    <>
    <Helmet>
  <html lang="en" />
  <title>Quilled - Share Creative Stories</title>
  <meta name="description" content="Quilled is a modern text-only storytelling blog platform for writers and thinkers to share bold, creative, and insightful ideas with the world." />
  <meta name="keywords" content="blog, stories, creative writing, quilled, tech writing, personal blog, publish articles, online journal" />
  <meta name="author" content="Quilled" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono&display=swap" rel="stylesheet"/>
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Dancing+Script&family=Inter:wght@400;700&display=swap"
      rel="stylesheet"
    />
  {/* Favicon */}
    <link rel="icon" type="image/svg+xml" href="./assets/logo.svg" />
  {/* Open Graph Tags for social sharing */}
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://quilled-5su6.onrender.com/" />
  <meta property="og:title" content="Quilled - Share Creative Stories" />
  <meta property="og:description" content="A sleek, powerful blog platform for creatives, tech writers, and thinkers to publish and grow an audience." />
  <meta property="og:image" content={seo} />

  {/* Twitter Card Tags */}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Quilled - Share Creative Stories" />
  <meta name="twitter:description" content="A sleek, powerful blog platform for creatives, tech writers, and thinkers to publish and grow an audience." />
  <meta name="twitter:image" content={seo} />

  {/* Canonical URL */}
  <link rel="canonical" href="https://quilled-5su6.onrender.com/" />
</Helmet>

    <AnimatePresence mode="wait">
    {/*<Comments></Comments>*/}

        <motion.div
          key="layout"
          initial={{ opacity: .9 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="flex bg-black"
        >
          <div className="max-w-[30%]">
            <div className="hidden cd:block cd:min-w-[240px]">
              <BlogSidebar scrollToTarget={scrollToTarget} />
            </div>
          </div>

          <div className={`h-[100vh] w-full  custom-scrollbar overflow-x-hidden ${isVisible || open ? "overflow-hidden" : "overflow-y-auto"} `}>
          <div className="sticky top-0 z-50 border-b border-slate-700 py-2 px-2 items-center backdrop-blur-lg cd:hidden flex justify-between">
          <div className="flex gap-2 items-center">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center">
            <img src={logo} alt="logo"/>

            </div>
            <div className="text-white text-3xl font-extrabold tracking-wider cursive">Quilled</div>
            </div>
              <div className="block cd:hidden">
              <MobileNav open={open} setOpen={setOpen} scrollToTarget={scrollToTarget} />
            </div>
          </div>
            <Banner setIsVisible={setIsVisible} isVisible={isVisible} scrollToTarget={scrollToTarget} scrollToBlogs={scrollToBlogs}/>
            <div ref={blogRef}>
            <HeroSection/>
            </div>
            <SubscribeSection targetRef={targetRef} />
            <Footer />
            {isVisible && (<AnimatePresence mode="wait">
                <motion.div
                  key="layout"
                  initial={{ opacity: 0}}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 1, duration: .4 }}
                  className="absolute top-0 left-0 right-0 bottom-0 items-center bg-black/80 scroll-none z-50"
                >
                  <Popup setIsVisible={setIsVisible} isVisible={isVisible}/>
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </motion.div>

    </AnimatePresence>
    </>
  )
}

export default Layout
