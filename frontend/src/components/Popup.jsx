import React, { useState } from 'react';
import { X, Check, ArrowRight } from 'lucide-react';

export default function DarkChecklistModal() {
  const EXPIRY_TIME = 24 * 60 * 60 * 1000;
  const [checkedItems, setCheckedItems] = useState({});
  const [isVisible, setIsVisible] = useState(() => {
  const data = JSON.parse(localStorage.getItem("checklistSeen") || "{}");
  const expired = Date.now() - (data.timestamp || 0) > EXPIRY_TIME;
  return !data.seen || expired;
});



  const checklist = [
  { label: "Implement full user authentication (JWT, password reset, auth guards)", checked: false },
  { label: "Add rich text editor with image upload for creating posts", checked: false },
  { label: "Switch rich text editor with image upload", checked: false },
  { label: "Fix image upload on signup PLEASE DO NOT USE THAT FEATURE", checked: false },
  { label: "Add search functionality with debounced input and filtering", checked: false },
  { label: "Add a newsletter Mailchimp integration", checked: false },
  { label: "Enable commenting or feedback section per post", checked: false },
  { label: "Create post edit feature on admin dashboard", checked: false },
  { label: "Expand database --IF NECESSARY", checked: false },
  { label: "Improve UI per suggestions", checked: false },
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
    <div className="absolute top-0 left-0 bottom-0 right-0 inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className=" overflow-y-auto custom-scrollbar bg-gray-800 h-[90%] rounded-lg shadow-2xl p-8 w-full max-w-md mx-4 border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Hey there 👋</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <X size={24} />
          </button>
        </div>
        <p className="text-white text-sm leading-relaxed mb-6 px-2 py-3 rounded-md bg-gray-700/50 border-l-4 border-blue-500 shadow-sm">
  <span className="font-bold text-blue-400">Welcome to THBB!</span><br />
  I'm happy to launch v1. It’s been a long journey — and it’s only just beginning.
  <br /><br />
  You may have noticed that a lot of revamping is due, but don't worry — I'll get it done.
  <br /><br />
  <span className="italic text-gray-300">And by “IT” I mean:</span>
</p>

        {/* Checklist */}
<div className="space-y-2 mb-8">
  {checklist.map((item, index) => {
    const isChecked = item.checked;
    return (
      <div
        key={index}
        onClick={() => handleItemCheck(index)}
        className="flex items-center space-x-3 p-1 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors cursor-pointer"
      >
        <div className="flex-shrink-0">
          {isChecked ? (
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <Check size={16} className="text-white" />
            </div>
          ) : (
            <div className="w-6 h-6 border-2 border-gray-400 rounded-full"></div>
          )}
        </div>
        <span
          className={`text-sm ${
            isChecked ? 'text-gray-400 line-through' : 'text-white'
          }`}
        >
          {item.label}
        </span>
      </div>
    );
  })}
</div>


        {/* Progress Bar */}
<div className="mb-6">
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


  {/* Victory */}
{checklist.filter(item => item.checked).length === checklist.length && (
  <div className="mt-6 mb-4  p-4 bg-green-700/20 border border-green-500 rounded-lg text-center animate-pulse shadow-lg">
    <p className="text-green-400 font-bold text-lg">
      🎉 We did it! All tasks complete.
    </p>
  </div>
)}



        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors font-medium"
          >
            Close
          </button>
          <button
            onClick={handleNavigate}
            className="flex-1 px-4 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium flex items-center justify-center space-x-2"
          >
            <span>About me</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
