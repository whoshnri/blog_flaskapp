"use client"

import { useRef, useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import BlogSidebar from "./components/navs/SideBar"
import MobileNav from "./components/navs/MobileNav"
import HeroSection from "./components/Hero"
import { SubscribeSection } from "./components/SubscribeSection"
import Footer from "./components/Footer"
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

  const showSearch = (e) => {
    e.preventDefault()
    setShowSearchPageLoader(true)
    setSearchPage(true)
  }

  useEffect(() => {
    setShow(true)
  }, [])

  return (
    <AnimatePresence mode="wait">
      {show && (
        <motion.div
          key="layout"
          initial={{ opacity: .7 }}
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

          <div className="h-[100vh] w-full custom-scrollbar overflow-auto">
            <HeroSection />
            <SubscribeSection targetRef={targetRef} />
            <Footer />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Layout
