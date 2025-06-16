"use client"

import { motion } from "framer-motion"
import { Eye, Heart, Clock, ArrowRight, PencilIcon, BookOpen } from "lucide-react"
import { useState , useEffect} from "react"
import { useNavigate } from "react-router-dom"




function PostSkeleton() {

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 overflow-hidden">
      <div className="h-5 bg-gray-800 animate-pulse" />
      <div className="p-6">
        <div className="h-4 bg-gray-800 rounded animate-pulse mb-3" />
        <div className="h-2 bg-gray-800 rounded animate-pulse mb-4 w-3/4" />
        <div className="flex items-center justify-between">
          <div className="flex space-x-4">
            <div className="h-2 bg-gray-800 rounded animate-pulse w-16" />
            <div className="h-2 bg-gray-800 rounded animate-pulse w-16" />
          </div>
          <div className="h-2 bg-gray-800 rounded animate-pulse w-20" />
        </div>
      </div>
    </div>
  )
}

export default function RecentPosts({username}) {
  const [loading, setLoading] = useState(true)
  const [opacity, setOpacity] = useState({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
  })
const [posts, setPosts] = useState([])
const parse = (html) => <span dangerouslySetInnerHTML={{ __html: html }} />;


useEffect(() => {
  const getPosts = async () => {
    const url = `http://127.0.0.1:5000/get/blog/username/${username}`
    try {
      const response = await fetch(url)
      const res = await response.json()
      if (response.status === 201) {
        console.log(res)
        setPosts(res)
      } else {
        console.warn("Fetch failed:", res)
      }
    } catch (err) {
      console.error("Network error:", err)
    }
  }
  getPosts()
}, [username])


  const handleClick = (index) => {
    const duplicate = { ...opacity }
    for (let key in duplicate) {
      if (index == key) {
        if (duplicate[key] == 0) {
          duplicate[key] = 1
        }
        else {
          duplicate[key] = 0
        }
      }
    }
    setOpacity(duplicate)
  }

  // Simulate loading
  useState(() => {
    const timer = setTimeout(() => setLoading(false), 2000)
    return () => clearTimeout(timer)
  })


  const navigate = useNavigate()

  return (
    <>
      <motion.section
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h2 className="text-xl font-semibold mb-6 text-white">Recent Posts</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading
            ? Array.from({ length: 6 }).map((_, index) => <PostSkeleton key={index} />)
            : posts?.map((post, index) => (
              <motion.article
                key={post.pid}
                className="bg-gray-900/50 backdrop-blur-sm overflow-hidden rounded-md border border-gray-800 group hover:border-gray-700 transition-all duration-300 cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: 3, delay: 0 }}
              >


                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-gray-200 transition-colors duration-300">
                    {post.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{parse(post.desc)}</p>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{post.views.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart className="w-4 h-4" />
                        <span>{post.likes.toLocaleString()}</span>
                      </div>
                    </div>

                  </div>
                  <div className="flex text-xs items-center space-x-1 pt-2 text-white">
                        <Clock className="w-4 h-4" />
                        <span className="text-xs">{post.created}</span>
                      </div>
                </div>

                <div className="flex space-x-5 text-gray-400 px-6 mb-5">
                  <span className="group-parent flex text-sm gap-1 items-center hover:text-green-600"><PencilIcon className="h-4 w-4 group-hover/parent:stroke-green-600" />Edit</span>
                  <span

                    onClick={() => navigate(`/read/${post.pid}`)}
                    className="group-parent flex text-sm gap-1 items-center hover:text-blue-600"><BookOpen
                      className="h-4 w-4 group-hover/parent:stroke-blue-600"
                    />Read</span>
                </div>

              </motion.article>
            ))}

        </div>
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className=" group uppercase justify-self-center w-fit px-8 mt-4 bg-white py-2 rounded-3xl flex justify-center gap-1"
        >All
          <ArrowRight
            className="group-hover:translate-x-3 ease-in-out duration-300"
          ></ArrowRight>
        </motion.button>
      </motion.section>

    </>
  )
}
