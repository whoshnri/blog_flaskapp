"use client"

import { useRef, useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import BlogSidebar from "./components/navs/SideBar"
import MobileNav from "./components/navs/MobileNav"
import HeroSection from "./components/Hero"
import { SubscribeSection } from "./components/SubscribeSection"
import Footer from "./components/Footer"
import Popup from "./components/Popup"
import Loader from "./components/Loader"
import SignupForm from "./components/Users/SignUp"
import LoginForm from "./components/Users/Login"
import Dashboard from "./components/Dashboard/Dashboard"
import { useNavigate } from "react-router-dom"

const Layout = () => {
  const targetRef = useRef(null)
  const [show, setShow] = useState(false)

  const scrollToTarget = (e) => {
    e.preventDefault()
    targetRef.current?.scrollIntoView({ behavior: "smooth" })
  }



  useEffect(() => {
  const showTimeout = setTimeout(() => {
    setShow(true);
  }, 2000);

  return () => {
    clearTimeout(showTimeout);
  };
}, []);

  return (
    <AnimatePresence mode="wait">

        <motion.div
          key="layout"
          initial={{ opacity: .9 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="flex"
        >
          <div className="max-w-[30%]">
            <div className="hidden cd:block cd:min-w-[240px]">
              <BlogSidebar scrollToTarget={scrollToTarget} />
            </div>
            <div className="block cd:hidden">
              <MobileNav scrollToTarget={scrollToTarget} />
            </div>
          </div>

          <div className="relative h-[100vh] w-full custom-scrollbar overflow-auto">
            <HeroSection />
            <SubscribeSection targetRef={targetRef} />
            <Footer />
            {show && (<AnimatePresence mode="wait">
                <motion.div
                  key="layout"
                  initial={{ opacity: 0}}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 1, duration: .4 }}
                  className=""
                >
                  <Popup />
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </motion.div>

    </AnimatePresence>
  )
}

export default Layout
