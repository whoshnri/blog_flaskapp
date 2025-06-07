import React from "react";
import blogs from "../datasets/Blogs.json";
import { Eye, Heart , ThumbsUp} from "lucide-react";

export default function FuturisticCard() {
  const blog = blogs[0];
  blog.content =
    "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae voluptas accusamus exercitationem hic obcaecati sapiente impedit officia excepturi minus, earum maiores laboriosam voluptatem est fugit. Obcaecati doloribus magni, natus aut ipsam ut voluptatum voluptas sapiente ducimus exercitationem maiores commodi voluptatem possimus tempore hic minima provident praesentium dolores vel delectus. Fugiat provident excepturi cumque optio, dignissimos, similique odio illo voluptas, numquam dolore praesentium repellat aliquam? Architecto eligendi assumenda earum provident laudantium suscipit nisi odio vitae, alias quasi perferendis libero repudiandae numquam ab a id officia illum enim tenetur, cupiditate quia quaerat similique corrupti. Voluptatem error repudiandae minima dolorum vel molestias at fugit doloribus facilis, quibusdam voluptatum cumque placeat doloremque mollitia consectetur? Similique natus velit numquam quo cumque excepturi consequuntur deleniti culpa fugit libero necessitatibus error dolore, tenetur neque laboriosam. A eveniet dignissimos totam delectus fugit quos iste maiores nulla doloremque esse assumenda voluptate accusamus molestias adipisci quibusdam libero, suscipit ad. Ratione a voluptate recusandae reprehenderit consectetur totam ex. Facere cumque ipsum ipsa earum laudantium blanditiis libero iusto dolor inventore aliquam dolore, enim possimus amet, dicta ex, adipisci corporis vel consectetur quo. Optio sapiente qui accusantium eligendi doloribus sint, dolorum quo cum, veniam odit minima culpa architecto nam voluptates pariatur placeat tempore.";

  return (
    <div className="min-h-screen fixed bg-gray-900/30 left-0 right-0 flex items-center justify-center text-gray-300 font-sans">
      <div className="w-[90%] h-[100vh] mt-[5vh] mb-[5vh] relative">
        {/* Card Container */}
        <div className="relative w-full h-[80%] bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header Bar */}
          <div className="h-3 bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700 relative">
            <div className="absolute left-2 top-8 space-y-1">
              <div className="w-1 h-3 bg-gray-600 rounded-sm"></div>
              <div className="w-1 h-2 bg-gray-700 rounded-sm"></div>
              <div className="w-1 h-2 bg-gray-700 rounded-sm"></div>
              <div className="w-1 h-1 bg-gray-800 rounded-sm"></div>
            </div>

            {/* Diagonal Accent Lines */}
            <div className="absolute inset-0 opacity-10">
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
            </div>
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
                <span className="text-xs text-gray-300">Date: </span>
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
                <Heart
                  role="button"
                  className="fill-red-500 stroke-none w-4"
                ></Heart>
                {blog.likes}
              </span>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex h-[calc(100%-11rem)] overflow-hidden">
            {/* Left Accent Line */}
            <div className="w-[5%] border-r border-gray-700"></div>

            {/* Scrollable Content */}
            <div className="w-[95%] overflow-y-auto roman custom-scrollbar px-6 py-4 text-sm leading-6 tracking-wide text-gray-300">
              {blog.content}
            </div>
          </div>

          {/* Footer Line */}
          <div
            role="button"
            className="h-[12em] flex justify-between bg:gray-900 border-t border-gray-700 text-center uppercase"
          >
            <span className="border-r border-gray-600 group w-[50%] h-full pt-1 gap-1 justify-center flex hover:bg-green-600"><p className="font-bold">
              Like</p><ThumbsUp className="mt-[.1rem] h-4"></ThumbsUp>
            </span>{" "}
            <span className="border-l border-gray-600 group w-[50%] h-full pt-1 flex justify-center gap-2 font-bold hover:bg-red-500"><p>Close</p><span className="text-2xl mt-[-.29rem]">&times;</span></span>
          </div>
        </div>

        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-transparent rounded-2xl blur-xl opacity-10 -z-10"></div>
      </div>
    </div>
  );
}
