"use client"
import FuturisticCard from "./BlogBodey"
import { useParams } from "react-router-dom"
import { motion } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import { Helmet } from "react-helmet-async"
import seoImg from "../assets/blog.jpg?url"

const API = import.meta.env.VITE_API_BASE_URL

const ReadBlog = ({ scrollToTarget }) => {
  const { pid } = useParams()
  const scrollRef = useRef(null)

  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getBlog = async () => {
      try {
        const response = await fetch(`${API}/get/blog/${pid}`)
        const res = await response.json()
        if (response.status === 201) {
          setBlog(res.blog)
        }
      } catch (error) {
        console.error("Fetch error:", error)
      } finally {
        setLoading(false)
      }
    }

    getBlog()
  }, [pid])

  // Helper to strip HTML tags
const stripHtml = (html) => html?.replace(/<[^>]+>/g, '').trim()

// Inside component:
const blogTitle = blog?.title || "Quilled Blog Post"
const rawDescription = blog?.desc || "Read an insightful and creative post on Quilled, a modern blog platform for writers and thinkers."
const blogDescription = stripHtml(rawDescription).slice(0, 160)
const blogImage = blog?.coverImage || seoImg
const blogUrl = `https://quilled-5su6.onrender.com/read/${pid}`


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
    <>
      <Helmet>
        <title>{`${blogTitle} | Quilled`}</title>
        <meta name="description" content={blogDescription} />
        <meta name="author" content="Quilled" />
        <meta name="keywords" content="quilled, blog, stories, creative writing, post, article" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono&display=swap" rel="stylesheet"/>
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Dancing+Script&family=Inter:wght@400;700&display=swap"
      rel="stylesheet"
    />

        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={blogUrl} />
        <meta property="og:title" content={`${blogTitle} | Quilled`} />
        <meta property="og:description" content={blogDescription} />
        <meta property="og:image" content={blogImage} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${blogTitle} | Quilled`} />
        <meta name="twitter:description" content={blogDescription} />
        <meta name="twitter:image" content={blogImage} />

        {/* Canonical */}
        <link rel="canonical" href={blogUrl} />
      </Helmet>

      <div className="flex">
        <motion.div
          ref={scrollRef}
          key="blogView"
          className="h-[100vh] w-full custom-scrollbar overflow-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <FuturisticCard pid={pid} scrollRef={scrollRef} />
        </motion.div>
      </div>
    </>
  )
}

export default ReadBlog
