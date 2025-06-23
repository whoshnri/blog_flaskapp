import React, { useState } from 'react';
import TypedText from "./typedText";
import Popup from "./Popup"
import {useNavigate} from "react-router-dom"


const Banner = ({isVisible, setIsVisible, scrollToTarget, scrollToBlogs}) => {
  const navigate = useNavigate()


  const roadmapItems = [
    { id: 1, text: "User authentication & profiles", completed: true },
    { id: 2, text: "Rich text editor for posts", completed: true },
    { id: 3, text: "Comment system", completed: false },
    { id: 4, text: "Post categories & tags", completed: false },
    { id: 5, text: "Search functionality", completed: false },
    { id: 6, text: "Email notifications", completed: false },
    { id: 7, text: "Mobile app version", completed: false },
    { id: 8, text: "Dark/Light theme toggle", completed: false },
    { id: 9, text: "Post bookmarking", completed: false },
    { id: 10, text: "API documentation", completed: false },
    { id: 11, text: "Moderation tools", completed: false },
    { id: 12, text: "Analytics dashboard", completed: false }
  ];

  return (
    <div className="min-h-screen bg-black elative text-white ">
      <div className="mx-auto px-4 pt-12 cd:pt-16">
          {/* Main Content */}
          <div className="relative max-w-5xl">
            <h1 className="text-5xl cd:text-7xl font-light mb-7 leading-tight tracking-tight">
            <TypedText
              strings={["Sharing Stories",'Stories that \nmatter']}
              backSpeed={70}
              typeSpeed={130}
              loop={false}
            />
            </h1>

            {/* Scroll Indicator - positioned relative to H1 */}
            <div
            onClick={scrollToBlogs}
            className="absolute bottom-0  right-0 animate-pulse">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </div>
          </div>

          <p className="text-lg font-sans text-gray-400 mb-3 leading-relaxed max-w-cd font-light">
            Real experiences from real people. A platform where every voice has space to be heard.
          </p>

          {/* Open Source Section */}
          <div className="mb-7 p-6 max-w-5xl border border-gray-800 bg-gray-900 bg-opacity-30">
            <div className="flex items-center gap-3 mb-3">
              <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              <h3 className="text-white font-medium">Built in the Open</h3>
            </div>
            <p className="text-gray-400 text-sm mb-4 leading-relaxed">
              This platform is completely open source. Help us build something better. Together we can contribute code, suggest features, or report issues.
            </p>
            <div className="text-xs text-gray-500 font-mono">
              Community Driven • Open Source
            </div>
          </div>

          {/* CTA Buttons */}
          <div
           className="grid max-w-5xl cd:grid-cols-3 gap-3 mb-16">
            <button
          onClick={() => navigate("/search")}
             className="group bg-white text-black px-8 py-4 font-medium hover:bg-gray-100 transition-colors duration-200 flex items-center gap-3">
              <span>Browse Stories</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <a
              href="https://github.com/whoshnri/quilled"
              target="_blank"
              rel="noopener noreferrer"
              className="group border border-gray-700 text-white px-8 py-4 font-medium hover:border-gray-500 transition-colors duration-200 flex items-center gap-3"
            >
              <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.319-.012 2.628 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
              </svg>
              <span>Contribute on GitHub</span>
            </a>

            <button
              onClick={() => setIsVisible(true)}
              className="group border border-blue-600 text-blue-500 px-8 py-4 font-medium hover:bg-blue-500 hover:text-white transition-colors duration-200 flex items-center gap-3"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <span>View Roadmap</span>
            </button>
          </div>

          {/* Features */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex-shrink-0 mt-1 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">Authentic Voices</h3>
                <p className="text-gray-500 text-sm">No algorithms, no filters. Just honest storytelling.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex-shrink-0 mt-1 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">Open Platform</h3>
                <p className="text-gray-500 text-sm">Anyone can contribute. Every perspective welcomed.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex-shrink-0 mt-1 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">Text-Focused</h3>
                <p className="text-gray-500 text-sm">Words first. Stories that speak for themselves.</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 py-8 border-t border-gray-800">
            <div className="flex gap-8 text-sm">
              <div>
                <div className="text-white font-mono text-lg">∞</div>
                <div className="text-gray-500">Stories</div>
              </div>
              <div>
                <div className="text-white font-mono text-lg">∞</div>
                <div className="text-gray-500">Voices</div>
              </div>
              <div>
                <div className="text-white font-mono text-lg">∞</div>
                <div className="text-gray-500">Possibilities</div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Banner;
