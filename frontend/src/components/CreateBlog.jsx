import React, { useState } from "react";
import { ChevronLeft, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import FontFamily from '@tiptap/extension-font-family';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';

import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Link as LinkIcon,
  Unlink as UnlinkIcon,
  List as BulletIcon,
  ListOrdered as OrderedIcon,
  Code as CodeIcon,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Heading1 as H1Icon,
  Heading2 as H2Icon,
  TextCursorInput as ParagraphIcon,
} from "lucide-react";

const API = import.meta.env.VITE_API_BASE_URL;

const IconBtn = ({ icon, onClick, active, title }) => (
  <button
    onClick={onClick}
    title={title}
    className={`p-1 rounded hover:bg-slate-800 transition ${
      active ? "text-blue-400" : "text-white"
    }`}
  >
    {icon}
  </button>
);

export default function CreateBlogCard({ username, uuid }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Underline,
      TextStyle,
      Color,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({ openOnClick: true, autolink: true, linkOnPaste: true }),
      FontFamily.configure({ types: ["textStyle"] }),
      Subscript,
      Superscript,
    ],
    content: "<p>Write your blog content here...</p>",
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-invert max-w-none focus:outline-none",
      },
    },
  });

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
      const response = await fetch(`${API}/new/blog`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      const res = await response.json();
      console.log(response.status === 201 ? res.message : res.error);
      discard();
    } catch (error) {
      console.log("Network error:", error);
    }
    setLoading(false);
    navigate(`/dashboard/${username}/${uuid}`);
  };

  return (
    <>
      <div className="w-full overflow-y-auto bg-slate-950 h-[100vh] shadow-2xl flex flex-col">
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
              <label className="block text-sm text-slate-400 mb-2">
                Category
              </label>
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

          <div className="h-[60vh] space-y-4">
            <label className="text-sm text-slate-400">Content</label>

            {editor && (
              <div className="space-y-3">
                <div className="flex overflow-x-auto gap-2 bg-slate-900 p-3 rounded-xl border border-slate-700 text-white">
                  <IconBtn icon={<Bold size={18} />} title="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} />
                  <IconBtn icon={<Italic size={18} />} title="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} />
                  <IconBtn icon={<UnderlineIcon size={18} />} title="Underline" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()} />
                  <IconBtn icon={<CodeIcon size={18} />} title="Code" active={editor.isActive("code")} onClick={() => editor.chain().focus().toggleCode().run()} />
                  <IconBtn icon={<SuperscriptIcon size={18} />} title="Superscript" active={editor.isActive("superscript")} onClick={() => editor.chain().focus().toggleSuperscript().run()} />
                  <IconBtn icon={<SubscriptIcon size={18} />} title="Subscript" active={editor.isActive("subscript")} onClick={() => editor.chain().focus().toggleSubscript().run()} />
                  <IconBtn icon={<BulletIcon size={18} />} title="Bullet List" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()} />
                  <IconBtn icon={<OrderedIcon size={18} />} title="Ordered List" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()} />
                  <IconBtn icon={<AlignLeft size={18} />} title="Align Left" onClick={() => editor.chain().focus().setTextAlign("left").run()} />
                  <IconBtn icon={<AlignCenter size={18} />} title="Align Center" onClick={() => editor.chain().focus().setTextAlign("center").run()} />
                  <IconBtn icon={<AlignRight size={18} />} title="Align Right" onClick={() => editor.chain().focus().setTextAlign("right").run()} />
                  <IconBtn icon={<AlignJustify size={18} />} title="Justify" onClick={() => editor.chain().focus().setTextAlign("justify").run()} />
                  <IconBtn icon={<H1Icon size={18} />} title="Heading 1" active={editor.isActive("heading", { level: 1 })} onClick={() => editor.chain().focus().setHeading({ level: 1 }).run()} />
                  <IconBtn icon={<H2Icon size={18} />} title="Heading 2" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().setHeading({ level: 2 }).run()} />
                  <IconBtn icon={<ParagraphIcon size={18} />} title="Paragraph" active={editor.isActive("paragraph")} onClick={() => editor.chain().focus().setParagraph().run()} />
                  <input type="color" onInput={(e) => editor.chain().focus().setColor(e.target.value).run()} className="w-8 h-8 bg-transparent border-none cursor-pointer" />
                  <select
                    onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
                    defaultValue="default"
                    className="bg-slate-800 text-white rounded px-2 py-1 text-sm"
                  >
                    <option value="default">Font</option>
                    <option value="serif">Serif</option>
                    <option value="monospace">Monospace</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Arial">Arial</option>
                    <option value="Times New Roman">Times</option>
                  </select>
                  <IconBtn
                    icon={<LinkIcon size={18} />}
                    title="Insert Link"
                    onClick={() => {
                      const url = prompt("Enter URL");
                      if (url) editor.chain().focus().setLink({ href: url }).run();
                    }}
                  />
                  <IconBtn icon={<UnlinkIcon size={18} />} title="Remove Link" onClick={() => editor.chain().focus().unsetLink().run()} />
                </div>

                <div className="prose prose-invert max-w-none bg-slate-800/60 p-4 rounded-xl border border-slate-700">
                  <EditorContent editor={editor} />
                </div>
              </div>
            )}

            <div className="flex mt-3 justify-between items-center gap-4 ">
              <button onClick={() => console.log("Draft saved")} className="flex-1 bg-slate-700/80 hover:bg-slate-600/80 rounded-xl py-3 font-semibold">Save Draft</button>
              <button onClick={() => setShowPublishConfirm(true)} className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl py-3 font-semibold flex items-center justify-center">
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
            <p className="text-sm text-slate-400 mb-4">Are you sure you want to discard your changes? This action cannot be undone.</p>
            <div className="flex justify-end gap-4">
              <button onClick={() => setShowDiscardConfirm(false)} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg">Cancel</button>
              <button onClick={() => { discard(); setShowDiscardConfirm(false); }} className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg">Discard</button>
            </div>
          </div>
        </div>
      )}

      {/* Publish Modal */}
      {showPublishConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="w-full max-w-md bg-slate-900 p-6 rounded-xl border border-slate-700 animate-scaleIn text-slate-200">
            <h2 className="text-xl font-bold text-blue-400 mb-2">Confirm Publish?</h2>
            <p className="text-sm text-slate-400 mb-4">Are you sure you want to publish this blog post? It will be visible to the public.</p>
            <div className="flex justify-end gap-4">
              <button onClick={() => setShowPublishConfirm(false)} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg">Cancel</button>
              <button onClick={handlePublish} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg">Publish</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
