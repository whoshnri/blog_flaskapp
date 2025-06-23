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

const Layout = () => {
  const targetRef = useRef(null)
  const blogRef = useRef(null)

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
    <AnimatePresence mode="wait">
    {/*<Comments></Comments>*/}

        {true && <motion.div
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

          <div className={`h-[100vh] w-full  custom-scrollbar overflow-x-hidden ${isVisible ? "overflow-hidden" : "overflow-y-auto"} `}>
          <div className="sticky top-0 z-50 border-b border-slate-700 py-2 px-2 items-center backdrop-blur-lg cd:hidden flex justify-between">
          <div className="flex gap-2 items-center">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center">
            <img src={logo} alt="logo"/>

            </div>
            <div className="text-white text-3xl font-extrabold tracking-wider cursive">Quilled</div>
            </div>
              <div className="block cd:hidden">
              <MobileNav scrollToTarget={scrollToTarget} />
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
        </motion.div>}s

    </AnimatePresence>
  )
}

export default Layout
