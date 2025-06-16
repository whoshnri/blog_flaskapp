import React, { useState } from "react";
import { ChevronLeft, Trash2 } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";

export default function CreateBlogCard({username, uuid}) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()


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
    setContent("");
    setCategory("");
    setTitle("");
  };

  const handlePublish = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    const data = { username, category, content, title };
    try {
      const response = await fetch("http://127.0.0.1:5000/new/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" ,"Authorization": `Bearer ${token}`},
        body: JSON.stringify(data),
      });
      const res = await response.json();
      console.log(response.status === 201 ? res.message : res.error);
      discard();
    } catch (error) {
      console.log("Network error:", error);
    }
    setLoading(false);
    navigate(`/dashboard/${username}/${uuid}`)
  };

  return (
    <>
      {/* Fullscreen modal */}
        <div className="w-full overflow-y-auto  bg-slate-950 h-[100vh] shadow-2xl flex flex-col">
          {/* Header */}
          <div className="sticky top-0 z-10 left-0 right-0 backdrop-blur-lg px-4 py-3 flex justify-between items-center border-b border-slate-700/60 bg-gradient-to-r from-slate-900/80 to-slate-800/60">
            <div className="flex items-center gap-4">
              <ChevronLeft
                width={38}
                height={38}
                role="button"
                onClick={() => navigate(`/dashboard/${username}/${uuid}`)}
                className="rounded-xl p-2 bg-slate-800/60 hover:bg-slate-700/80 transition-all duration-300 hover:-translate-x-1 shadow-lg"
              />
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Create New Blog Post
              </h3>
            </div>
            <Trash2
              role="button"
              onClick={() => setShowDiscardConfirm(true)}
              className="hover:stroke-red-400 transition duration-200 h-8 w-8 cursor-pointer p-1 rounded-lg hover:bg-red-500/10"
            />
          </div>

          {/* Scrollable body */}
          <div className="px-6 py-6 space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
              <div className="md:col-span-4">
                <label className="block text-sm text-slate-400 mb-2">Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter blog title..."
                  className="w-full text-white bg-slate-800/70 border border-slate-600/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/60"
                />
              </div>
              <div className="md:col-span-3">
                <label className="block text-sm text-slate-400 mb-2">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-800/70 border border-slate-600/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/60 text-white"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="bg-slate-900">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="h-[67%]">
              <label className=" text-sm text-slate-400 mb-2">Content</label>
              <div className="bg-slate-900/70 border border-slate-600/50 rounded-sm overflow-hidden h-full">
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  className="h-full"
                />
              </div>
              <div className="flex mt-3 justify-between items-center gap-4 ">
              <button
                onClick={() => console.log("Draft saved")}
                className="flex-1 bg-slate-700/80 hover:bg-slate-600/80 rounded-xl py-3 font-semibold"
              >
                Save Draft
              </button>
              <button
                onClick={() => setShowPublishConfirm(true)}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl py-3 font-semibold flex items-center justify-center"
              >
                {loading ? (
                  <div className="w-5 h-5 border-4 border-t-transparent border-white rounded-full animate-spin" />
                ) : (
                  "Publish"
                )}
              </button>
            </div>
            </div>

          </div>
        </div>

      {/* Discard Modal */}
      {showDiscardConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="w-full max-w-md bg-slate-900 p-6 rounded-xl border border-slate-700 animate-scaleIn text-slate-200">
            <h2 className="text-xl font-bold text-red-400 mb-2">Discard Draft?</h2>
            <p className="text-sm text-slate-400 mb-4">
              Are you sure you want to discard your changes? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDiscardConfirm(false)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  discard();
                  setShowDiscardConfirm(false);
                  setShowForm(false);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Publish Modal */}
      {showPublishConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="w-full max-w-md bg-slate-900 p-6 rounded-xl border border-slate-700 animate-scaleIn text-slate-200">
            <h2 className="text-xl font-bold text-blue-400 mb-2">Confirm Publish?</h2>
            <p className="text-sm text-slate-400 mb-4">
              Are you sure you want to publish this blog post? It will be visible to the public.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowPublishConfirm(false)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handlePublish();
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg"
              >
                Publish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { transform: scale(0.92); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.3s ease; }
        .animate-scaleIn { animation: scaleIn 0.3s ease; }
      `}</style>
    </>
  );
}
