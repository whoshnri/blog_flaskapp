import React, { useState } from 'react';
import { X, Check, ArrowRight } from 'lucide-react';

export default function DarkChecklistModal({setIsVisible, isVisible}) {

  const checklist = [
  { label: "Implement password reset", checked: false },
  { label: "Add a bio feauture (dedicted page route) for creators", checked: false },
  { label: "Add rich text editor for creating posts", checked: true },
  { label: "Add search functionality with debounced input and filtering", checked: false },
  { label: "Add a newsletter Mailchimp integration", checked: false },
  { label: "Create post edit feature on admin dashboard", checked: true },
  { label: "Create comment feature", checked: true },
  { label: "Expand database --IF NECESSARY", checked: false },
  { label: "Improve UI per suggestions", checked: true },
];

  const handleItemCheck = (index) => {
    setCheckedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleClose = () => {
  const data = {
    seen: true,
    timestamp: Date.now()
  };
  localStorage.setItem("checklistSeen", JSON.stringify(data));
  setIsVisible(false);
};

  const handleNavigate = () => {
    // In a real app, you'd use: navigate("thebigboss")
    console.log("Navigating to 'thebigboss'");
    alert("Navigation to 'thebigboss' triggered!");
  };


  return isVisible && (
          <div className="bg-gray-900 border mx-auto border-gray-700 rounded-sm h-[80%] max-w-2xl w-[80%] mt-[10%] cd:mt-[5%] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <h2 className="text-xl font-semibold text-white">Development Roadmap</h2>
              </div>
              <button
                onClick={() => setIsVisible(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh] custom-scrollbar">
            <p className="text-white text-sm leading-relaxed mb-6 px-2 py-3 rounded-md bg-gray-700/50 border-l-4 border-blue-500 shadow-sm">
  <span className="font-bold text-blue-400">Welcome to <span>Quilled</span>!</span><br />
  I'm happy to launch v2.0. Updates are rolling in faster than we thought
  <br /><br />
  You may have noticed that a lot of revamping so far.
  <br /><br />
</p>
              <p className="text-gray-400 mb-6 text-sm">
                Here's what we're working on to make <span className="cursive text-xl text-blue-400">Quilled</span> even better. Want to contribute? Check out our GitHub!
              </p>

              <div className="space-y-3">
                {checklist.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-gray-800 bg-opacity-50">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      item.checked
                        ? 'bg-blue-500 border-blue-500'
                        : 'border-gray-600'
                    }`}>
                      {item.checked && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className={`${
                      item.checked
                        ? 'text-gray-300 line-through'
                        : 'text-white'
                    }`}>
                      {item.label}
                    </span>
                    {item.checked && (
                      <span className="text-xs text-white bg-green-400 bg-opacity-30 px-2 py-1 rounded animate-pulse">
                        Done
                      </span>
                    )}
                  </div>
                ))}
              </div>
                      {/* Progress Bar */}
<div className="my-6">
  <div className="flex justify-between text-sm text-gray-400 mb-2">
    <span>Progress</span>
    <span>
      {checklist.filter(item => item.checked).length} / {checklist.length}
    </span>
  </div>
  <div className="w-full bg-gray-700 rounded-full h-2">
    <div
      className="bg-green-500 h-2 rounded-full transition-all duration-300"
      style={{
        width: `${
          (checklist.filter(item => item.checked).length / checklist.length) * 100
        }%`,
      }}
    ></div>
  </div>
</div>


              <div className="mt-6 p-4 bg-blue-900 bg-opacity-20 border border-blue-800 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span className="text-blue-400 font-medium text-sm">Want to help?</span>
                </div>
                <p className="text-gray-300 text-sm">
                  Pick any unchecked item, visit the GitHub and submit a pull request with your changes. Every contribution makes <span className="cursive text-xl text-blue-400">Quilled</span>  better for everyone.
                </p>
              </div>
            </div>
          </div>

      );
}
