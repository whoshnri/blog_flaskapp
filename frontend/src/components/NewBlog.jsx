"use client"
import CreateBlogCard from "./CreateBlog"
import { useNavigate, useParams } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"


const NewBlog = ({ scrollToTarget }) => {

  const {username, uuid} = useParams()

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

  return (

    <div className="flex">
      <motion.div
        key="blogView"
        className="h-[100vh] w-full custom-scrollbar overflow-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <CreateBlogCard username={username} uuid={uuid}/>
      </motion.div>
    </div>

  )
}
export default NewBlog
