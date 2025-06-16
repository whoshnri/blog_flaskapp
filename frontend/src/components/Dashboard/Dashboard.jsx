"use client"

import { motion, AnimatePresence } from "framer-motion"
import Header from "./components/Header"
import AnalyticsPanel from "./components/Analytics"
import RecentPosts from "./components/RecentPosts"
import FeedbackForm from "./components/Feedback"
import { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom'
import { useParams } from "react-router-dom"

const containerVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      staggerChildren: 0.1,
      duration: 0.5,
    },
  },
  exit: { opacity: 0, x: -50, transition: { duration: 0.1 } },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5 },
  },
  exit: { y: 20, opacity: 0, transition: { duration: 0.3 } },
}

export default function Dashboard({ }) {
  const navigate = useNavigate()
  const {userName} = useParams()
  const [userData , setUserData] = useState({})


  useEffect(()=>{
      const getData = async() =>{
      const request = await fetch("http://127.0.0.1:5000/user/" + userName)
      const res = await request.json()
      if (request.status === 201){
        setUserData(res.data)
      }
  }
  getData()

}, [])

  return (
    <div className="relative bg-zinc-900 cd:flex cd:justify-between max-h-[100vh] overflow-y-auto custom-scrollbar">
      {/* Sidebar is always visible on desktop */}
      <div className={`cd:w-[280px]  cd:block`}>
        <Header user={userData}/>
      </div>

      <AnimatePresence mode="wait">\
        <motion.div
          key="dashboard"
          className="cd:py-7 px-5 cd:w-[calc(100%-280px)] cd:mx-auto cd:max-h-[100vh] overflow-y-auto custom-scrollbar"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div variants={itemVariants}>
            <AnalyticsPanel />
          </motion.div>

          <motion.div variants={itemVariants}>
            <RecentPosts username={userData.username}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <FeedbackForm  email={userData.email}/>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
