"use client"

import { motion } from "framer-motion"
import { AlertTriangle } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function ErrorPage({ code = 404, message = "Page Not Found" }) {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <motion.div
          initial={{ rotate: -20 }}
          animate={{ rotate: [0, 10, -10, 10, -10, 0] }}
          transition={{ duration: 1.2 }}
          className="flex justify-center"
        >
          <AlertTriangle size={60} className="text-green-500" />
        </motion.div>

        <h1 className="text-5xl font-bold mt-4 text-white">{code}</h1>
        <p className="text-gray-400 mt-2">{message}</p>

        <button
          className="mt-6 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-xl
          "
          onClick={() => navigate("/")}
        >
          Go Home
        </button>
      </motion.div>
    </div>
  )
}
