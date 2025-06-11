import React , {useEffect, useState} from "react";
import { Eye, Heart , ThumbsUp} from "lucide-react";
import Loader from "./Loader"
import parse from 'html-react-parser';

export default function FuturisticCard({id}) {
  const [blog, setBlog] = useState({})
  const [loadError, setLoadError] = useState(true)
  const [loading, setLoading] = useState(true);
  const [liked , hasLiked] = useState(false)

useEffect(() => {
  fetch(`http://127.0.0.1:5000/add/views/${id}`, {
    method: 'PATCH',
  });
  getBlog()
}, [id]);




const addLike = async () => {
  try {
    const res = await fetch(`http://127.0.0.1:5000/add/likes/${id}`, {
      method: 'PATCH',
    });
    const data = await res.json();
    if (res.status === 200) {
      hasLiked(true)
      getBlog()
      alert("Liked!");
    } else if (res.status == 403){
      hasLiked(true)
      alert(data.message);  // e.g. "Already liked"
    }
  } catch (err) {
    console.error("Like error:", err);
  }
};

const removeLike = async () => {
  try {
    const response = await fetch(`http://127.0.0.1:5000/remove/likes/${id}`, {
      method: 'PATCH',
    });
    const data = await response.json();

    if (response.status === 200) {
      alert("Like removed");
      getBlog(); // refresh blog data
      hasLiked(false); // update UI
    } else {
      hasLiked(false)
      alert(data.message); // e.g. "You haven't liked this post"
    }
  } catch (error) {
    console.error("Remove like error:", error);
  }
};



const getBlog = async () => {
  try {
    const response = await fetch(`http://127.0.0.1:5000/get/blog/${id}`);
    const res = await response.json();
    if (response.status === 200) {
      setBlog(res);
    }
  } catch (error) {
    console.error("Fetch error:", error);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen fixed bg-black/30 left-0 right-0  selection:flex items-center justify-center text-gray-300 font-sans overflow-hidden">
      {/* Shooting Stars Animation */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="w-full h-full animate-stars" />
      </div>

      <div className="w-[95%] h-[100vh] mt-[1vh] mb-[1vh] mx-auto relative">
        {/* Card Container */}
        {loading && <Loader/>}
        <div className="relative w-full h-[96%] bg-gradient-to-br to-black from-black/80 border border-gray-700 rounded-md shadow-2xl overflow-hidden">
          {/* Header Bar */}
          <div className="h-3 bg-black border-b border-gray-700 relative">
            <div className="absolute left-2 top-8 space-y-1">
              <div className="w-1 h-3 bg-gray-600 rounded-sm"></div>
              <div className="w-1 h-2 bg-gray-700 rounded-sm"></div>
              <div className="w-1 h-2 bg-gray-700 rounded-sm"></div>
              <div className="w-1 h-1 bg-gray-800 rounded-sm"></div>
            </div>

            {/* Diagonal Accent Lines */}
            {/* <div className="absolute inset-0 opacity-10">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute bg-gray-600 rotate-45"
                  style={{
                    width: "1px",
                    height: "60px",
                    left: `${20 + i * 15}px`,
                    top: "-15px",
                  }}
                ></div>
              ))}
            </div> */}
          </div>

          {/* Metadata */}
          <div className="px-6 py-4 border-b border-gray-700">
            <h3 className="text-xl font-semibold tracking-wide text-white mb-1">
              {blog.title}
            </h3>
            <div className="text-sm text-gray-400 flex flex-wrap gap-x-4">
              <p className="text-xs">
                <span className="text-xs text-gray-300">Category: </span>
                {blog.category}
              </p>
              <p className="text-xs">
                <span className="text-xs text-gray-300">Created: </span>
                {blog.date}
              </p>
              <p className="text-xs">
                <span className="text-xs text-gray-300">Author: </span>
                {blog.author}
              </p>
            </div>
            <div className="flex mt-2 text-gray-700 text-sm gap-3 items-center">
              <span className="flex gap-1 items-center">
                <Eye role="button" className="w-4 stroke-blue-700"></Eye>
                {blog.views}
              </span>
              <span className="flex gap-1 items-center">
                <Heart role="button" className="fill-red-500 stroke-none w-4"></Heart>
                {blog.likes}
              </span>
            </div>
          </div>

          {/* Content Area */}
          <div className="h-[100%]">
          <div className="flex h-[100%] overflow-hidden">
            <div className="w-[5%] border-r bg-black/30 border-gray-700"></div>
            <div className="w-[95%] overflow-y-auto roman custom-scrollbar px-6 py-4 text-sm leading-6 tracking-wide text-gray-300">
              {blog.content ? parse(blog.content) : null}
            </div>
            {/* Footer Line */}
          <div
          role="button"
            className="h-fit bottom-0 right-0 left-0 absolute backdrop-blur-3xl flex justify-between bg:gray-900 border-t border-gray-700 text-center uppercase"
          >
            { liked ? 
              <span
              onClick={removeLike}
            className={`border-r hover:ease-in-out duration-200 border-gray-600 group w-[50%] h-full py-[.27rem]  xs:pt-1 gap-1 hover:bg-red-600 justify-center flex `}>
            <p className="font-bold">unLike</p>
              <ThumbsUp className="mt-[.2rem] h-4 rotate-180" />
            </span>
            : <span
            onClick={addLike}
            className={`border-r hover:ease-in-out duration-200 border-gray-600 group w-[50%] h-full py-[.27rem]  xs:pt-1 gap-1 hover:bg-green-600 justify-center flex `}>
            <p className="font-bold">Like</p>
              <ThumbsUp className="mt-[.1rem] h-4" />
            </span>}
            <span 
            className="border-l hover:ease-in-out duration-200 border-gray-600 group w-[50%] h-full pt-1 xs:pt-1 flex justify-center gap-2 font-bold hover:bg-red-500">
              <p>Close</p>
              <span className="text-2xl mt-[-.19rem]">&times;</span>
            </span>
          </div>
          </div>

          
          </div>
        </div>

        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-transparent rounded-2xl blur-xl opacity-10 -z-10"></div>
      </div>
    </div>
  );
}
