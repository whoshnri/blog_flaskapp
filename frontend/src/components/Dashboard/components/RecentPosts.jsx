"use client"

import { motion } from "framer-motion"
import { Eye, Heart, Clock, ArrowRight, PencilIcon, BookOpen } from "lucide-react"
import { useState , useEffect} from "react"
import { useNavigate } from "react-router-dom"
import NotFound from "../../../assets/notfound.svg"
const API = import.meta.env.VITE_API_BASE_URL;

function PostSkeleton() {
  return (
    <div className="bg-black border border-gray-300 rounded-lg overflow-hidden">
      <div className="p-4">
        <div className="h-3 bg-gray-300 rounded animate-pulse mb-2" />
        <div className="h-2 bg-gray-400 rounded animate-pulse mb-3 w-2/3" />
        <div className="flex items-center justify-between">
          <div className="flex space-x-3">
            <div className="h-2 bg-gray-400 rounded animate-pulse w-12" />
            <div className="h-2 bg-gray-400 rounded animate-pulse w-12" />
          </div>
          <div className="h-2 bg-gray-400 rounded animate-pulse w-16" />
        </div>
      </div>
    </div>
  )
}

export default function RecentPosts({username, uuid}) {
  const [loading, setLoading] = useState(true)
  const [noBlogs, setNoBlogs] = useState(false)
  const [posts, setPosts] = useState([])
  const parse = (html) => <span dangerouslySetInnerHTML={{ __html: html }} />;

  useEffect(() => {
    setLoading(true)
    const getPosts = async () => {
      const url = `${API}/get/blog/username/${username}`
      try {
        const response = await fetch(url)
        const res = await response.json()
        if (response.status === 201) {
          console.log(res)
          setLoading(false)
          setNoBlogs(false)
          setPosts(res)
        } else {
          console.warn("Fetch failed:", res)
          setLoading(false)
          setNoBlogs(true)
        }
      } catch (err) {
        console.error("Network error:", err)
      }
    }
    getPosts()
  }, [username])

  const navigate = useNavigate()

  return (
    <>
      <motion.section
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h2 className="text-lg font-bold mb-4 text-white">Posts</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {loading
            ? Array.from({ length: 6 }).map((_, index) => <PostSkeleton key={index} />)
            : posts?.map((post, index) => (
              <motion.article
                key={post.pid}
                className="bg-black border border-gray-300 rounded-lg group hover:border-white hover:shadow-lg hover:shadow-white/10 transition-all duration-300 cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -2, delay: 0 }}
              >
                <div className="p-4">
                  <h3 className="text-sm font-bold text-white mb-1 group-hover:text-gray-300 transition-colors duration-300 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-400 text-xs mb-3 line-clamp-2">{parse(post.desc)}</p>

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <Eye className="w-3 h-3" />
                        <span>{post.views.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart className="w-3 h-3" />
                        <span>{post.likes.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex text-xs items-center space-x-1 mb-3 text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{post.created}</span>
                  </div>

                  <div className="flex space-x-4 text-gray-400">
                    <span
                      onClick={() => navigate(`/update/${username}/${uuid}/${post.pid}`)}

                     className="group/edit flex text-xs gap-1 items-center hover:text-white transition-colors cursor-pointer">
                      <PencilIcon
                       className="h-3 w-3" />Edit
                    </span>
                    <span
                      onClick={() => navigate(`/read/${post.pid}`)}
                      className="group/read flex text-xs gap-1 items-center hover:text-white transition-colors cursor-pointer"
                    >
                      <BookOpen className="h-3 w-3" />Read
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}

            {noBlogs && (
              <div className="col-span-full flex flex-col items-center py-8">
                <img
                  src={NotFound}
                  className="w-32 h-32 mb-4 opacity-50"
                  alt="No posts found"
                />
                <button
                  onClick={() => navigate(`/new/${username}/${uuid}`)}
                  className="text-xs flex items-center gap-2 text-white border border-white px-3 py-2 rounded-lg hover:bg-white hover:text-black transition-all duration-300"
                >
                  <PencilIcon className="w-3 h-3" />
                  Create Post
                </button>
              </div>
            )}
        </div>
      </motion.section>
    </>
  )
}
