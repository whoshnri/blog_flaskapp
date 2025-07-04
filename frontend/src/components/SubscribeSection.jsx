"use client"

import React from "react"
const API = import.meta.env.VITE_API_BASE_URL;
const SCRIPT = import.meta.env.VITE_SCRIPT_URL;


import { useState } from "react"

export function SubscribeSection({targetRef}) {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState("");

const handleSubmit = async (e) => {
  e.preventDefault();
  setSubmitted(true);
  setFeedback(""); // clear any previous feedback

  try {
    const res = await fetch(`${API}/newsletter`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    const result = await res.json()
    if(res.ok){
      setFeedback("Thanks for subscribing");
    }
  }
  catch (error) {
    console.error("Network error:", error);
    setFeedback("Could not submit email. Please try again later.");
  } finally {
    setEmail("");
    setTimeout(() => setSubmitted(false), 1000);
  }
};



  return (
    <section ref={targetRef} className="py-16 px-6 md:px-12 bg-[hsl(0,0%,10%)]">
      {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-3 tracking-tight">
          Yo, buddy!<br />
          <span className="text-white/70">Yes, you silly :)</span>
        </h2>
        {/* Description */}
        <p className="text-center text-gray-600 mb-6">
          Want to get notified when new content drops,merch launches and more?
        </p>
        {/* Email Form */}
        <form
          className="flex flex-col gap-2"
          onSubmit={handleSubmit}
        >
          <label className="relative cd:w-[80%] xs:scale-[80%] mx-auto">
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="peer w-full rounded-lg border text-black/90 border-gray-300 py-3 px-4 pr-32 focus:outline-none focus:ring-2 focus:ring-black/20 transition"
              placeholder="Your email, please"
            />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 bg-black text-white px-5 py-2 rounded-lg font-semibold hover:bg-black/90 transition"
            >
          {!submitted ? <span>SUBMIT</span> : <div className="w-6 h-6 border-2 border-b-transparent rounded-full animate-spin"></div>}
            </button>
          </label>
          <p className="mx-auto w-fit text-white font-sans text-xs">{feedback}</p>
        </form>
    </section>
  )
}
