"use client"


import { motion } from "framer-motion"
import { Send, Star } from "lucide-react"
import { useState } from "react"
const API = import.meta.env.VITE_API_BASE_URL;


export default function FeedbackForm({email}) {
  const [suggestion, setSuggestion] = useState("")
  const [rating, setRating] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
  e.preventDefault()
  setIsSubmitting(true)

  try {
    const res = await fetch(`${API}/send/feedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "email" : email,
        feedback: suggestion,
        "rating" : rating,
      }),
    })
    const result = await res.json()

    if (res.ok) {
      setSubmitted(true)
      setSuggestion("")
      setRating(null)
      setTimeout(() => setSubmitted(false), 3000)
    } else {
      console.error("Feedback error:", result.message || result.error)
      alert(result.message || "Submission failed.")
    }
  } catch (error) {
    console.error("Network error:", error)
    alert("Could not submit feedback. Please try again later.")
  } finally {
    setIsSubmitting(false)
  }
}


  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="mb-5 cd:mb-1"
    >
      <h2 className="text-xl font-semibold mb-3 text-white">Share Your Feedback</h2>

      <motion.div
        className="bg-gray-900/50 backdrop-blur-sm p-5 rounded-2xl border border-gray-800"
        whileHover={{ borderColor: "#4B5563" }}
        transition={{ duration: 0.3 }}
      >
        {submitted ? (
          <motion.div
            className="text-center py-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Thank you!</h3>
            <p className="text-gray-400">Your feedback has been submitted successfully.</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="lg:grid lg:gap-5 lg:p-4 lg:grid-cols-7 gap-2">
            <div className="lg:col-span-4">
              <label htmlFor="suggestion" className="block text-sm font-medium text-gray-300 mb-2">
                Suggestions for improvement
              </label>
              <motion.textarea
                id="suggestion"
                value={suggestion}
                onChange={(e) => setSuggestion(e.target.value)}
                placeholder="Share your thoughts on how we can improve..."
                rows={4}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent transition-all duration-300"
                whileFocus={{ scale: 1.01 }}
                required
              />
            </div>
            <div className="lg:col-span-3 space-y-5">
              <div>
                <label htmlFor="rating" className="block text-sm font-medium text-gray-300 mb-2">
                  Rate your experience
                </label>
                <motion.select
                  id="rating"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="w-full px-3 py-5 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-slate-600 focus:border-transparent transition-all duration-300"
                  whileFocus={{ scale: 1.01 }}
                  required
                >
                  <option value={0}>Select a rating</option>
                  <option value={5}>⭐⭐⭐⭐⭐ Excellent</option>
                  <option value={4}>⭐⭐⭐⭐ Good</option>
                  <option value={3}>⭐⭐⭐ Average</option>
                  <option value={2}>⭐⭐ Poor</option>
                  <option value={1}>⭐ Terrible</option>
                </motion.select>
              </div>
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-white text-gray-900 py-2 px-4 rounded-xl font-medium flex items-center justify-center space-x-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: 0.96 }}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Submit Feedback</span>
                  </>
                )}
              </motion.button>
            </div>
          </form>
        )}
      </motion.div>
    </motion.section>
  )
}
