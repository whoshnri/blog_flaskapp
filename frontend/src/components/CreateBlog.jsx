import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Trash2 } from "lucide-react";

export default function CreateBlogCard({author}) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);

  const categories = [
    "Select Category",
    "Tech",
    "Life",
    "Code",
    "Opinion",
    "Life Experiences",
    "Other",
  ];
  const discard = () => {
    setContent("")
    setCategory("")
    setTitle("")
  }

  const handleSaveDraft = () => {
    console.log("Draft saved", { title, category });
  };

  const handlePublish = async() => {
    const data = {
      "author" : author,
      "category" : category,
      "content" : content,
      "title" : title,
    }
    const url = "http://127.0.0.1:5000/add/blog"
    const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      };
    const reponse = await fetch(url, options)
    const res = await reponse.json()
    if (reponse.status === 201){
      console.log(res.message)
    }else{
      console.log(res.error)
    }
    discard()
  };

  return (
    <>
      <div className="min-h-screen fixed bg-black/40 left-0 right-0 flex items-center justify-center text-gray-300 font-sans">
        <div className="w-[90%] h-[100vh] mt-[5vh] mb-[5vh] relative">
          <div className="relative w-full h-[90%] bg-gradient-to-br to-black from-black/80 border border-gray-700 rounded-md shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="px-6 py-2 items-center flex justify-between border-b border-gray-700">
              <h3 className="text-xl font-semibold tracking-wide text-white">
                Create New Blog Post
              </h3>
              <Trash2
                role="button"
                onClick={() => setShowDiscardConfirm(true)}
                className="hover:stroke-red-700 rounded-full h-7"
              />
            </div>

            {/* Form Body */}
            <div className="flex h-[calc(100%-6rem)] overflow-hidden">
              {/* Left Accent Line */}
              <div className="w-[5%] border-r h-full bg-black/30 border-gray-700" />

              {/* Form Fields */}
              <form className="w-[95%] px-6 py-4 space-y-6 overflow-y-auto custom-scrollbar">
                <div className="cd:grid grid-cols-3 gap-4">
                  {/* Title Input */}
                  <div className="cd:col-span-2 ">
                    <label className="block text-sm text-gray-400 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      required
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-black/40 border border-gray-700 rounded-md mb-2 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
                      placeholder="Enter blog title . . ."
                    />
                  </div>

                  {/* Category Dropdown */}
                  <div className="cd:col-span-1">
                    <label className="block text-sm text-gray-400 mb-1">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-black/90 border border-gray-700 rounded-md px-3 py-2 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-gray-900"
                    >
                      {categories.map((cat) => (
                        <option className="" key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Content Editor */}
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Content
                  </label>
                  <div
                  className="bg-black/40 border pb-[5rem] h-[440px] xs:h-[70vh] custom-scrollbar border-gray-700 rounded-md overflow-hidden text-white ">
                    <ReactQuill
                      theme="snow"
                      value={content}
                      onChange={setContent}
                      className="bg-transparent text-white h-full"
                      modules={{
                        toolbar: [
                          [{ header: [1, 2, false] }],
                          ["bold", "italic", "underline"],
                          [{ list: "ordered" }, { list: "bullet" }],
                          ["clean"],
                        ],
                      }}
                      formats={[
                        "header",
                        "bold",
                        "italic",
                        "underline",
                        "list",
                        "bullet",
                      ]}
                    />
                  </div>
                </div>
              </form>
            </div>

            {/* Footer Actions */}
            <div className="h-[3.2rem] flex justify-between border-t border-gray-700 text-center uppercase">
              <button
                onClick={handleSaveDraft}
                className="w-[50%] border-r border-gray-600 active:bg-gray-400 hover:bg-gray-700 transition-colors"
              >
                <p className="font-bold text-gray-200:">Save Draft</p>
              </button>
              <button
                onClick={() => setShowPublishConfirm(true)}
                className="w-[50%] border-l border-gray-600 hover:bg-green-600 active:bg-green-400 transition-colors"
              >
                <p className="font-bold text-white">Publish</p>
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Discard button popup */}
      {showDiscardConfirm && (
        <div className="fixed inset-0 bg-black/70 font-sans flex items-center justify-center z-50">
          <div className="bg-[#2f2f2f] scale-75 xs:scale-100 p-6 rounded-md max-w-sm w-full text-gray-300 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Discard Draft?</h2>
            <p className="mb-6">
              Are you sure you want to discard your changes? This action cannot
              be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDiscardConfirm(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => {discard()
                  setShowDiscardConfirm()
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}
      {showPublishConfirm && (
        <div className="fixed inset-0 bg-black/70 font-sans flex items-center justify-center z-50">
          <div className="bg-[#2f2f2f]/70 scale-75 xs:scale-100 p-6 rounded-md max-w-sm w-full text-gray-300 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Confirm Publish?</h2>
            <p className="mb-6">
              Are you sure you want to publish this content? Once published, it
              will be visible to everyone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowPublishConfirm(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handlePublish()
                  setShowPublishConfirm(false);
                }}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white"
              >
                Publish
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
