import React, { useState, useEffect } from "react";
import featured from "../datasets/featuredPosts.json";
import { Heart, Eye } from "lucide-react";
import TypedText from "./typedText";


function getRandomThree(arr) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 7);
}

const featuredBlogs = getRandomThree(featured);

function HeroSection() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []); 

  return (
    <section className="bg-[#0f0f0f] min-h-screen py-24 w-full px-4 xs:py-8">
      <div className="mx-auto">
        {/* Header */}
        {isClient && (
          <div className=" cursive text-5xl font-black text-white mb-12">
            <TypedText
              strings={["The HB Blog", "Sharing Stories","The HB Blog"]}
              backSpeed={70}
              typeSpeed={130}
              loop={false}
            />
          </div>
        )}
        <p className="text-2xl font-black text-white mb-3">Today's picks</p>
        {/* Blog Grid */}
        <div className="grid grid-cols-1 cd:grid-cols-5 gap-3 auto-rows-[400px]">
          {/* First Card (manually assign larger spans) */}
          <div className="bg-black/80 col-span-5 rounded-3xl overflow-hidden shadow-lg flex flex-col h-full cd:col-span-3">
            <img
              src={featuredBlogs[0].imageUrl}
              alt={featuredBlogs[0].title}
              className="w-full h-80 object-cover"
            />
            <div className="p-6 flex flex-col flex-1">
              <div className="text-xs text-gray-500 mb-1">
                {featuredBlogs[0].category} &nbsp;|&nbsp;{" "}
                {featuredBlogs[0].date}
              </div>
              <h2 className="text-xl font-bold text-white/80  mb-2 leading-snug">
                {featuredBlogs[0].title}
              </h2>
              <p className="text-sm text-gray-400 flex-1">
                {featuredBlogs[0].description}
              </p>
              <div className="flex mt-2 text-gray-700 text-sm gap-2 items-center">
                <span className="flex gap-1 items-center">
                  <Eye role="button" className="w-4 stroke-blue-700"></Eye>
                  {featuredBlogs[0].views}
                </span>
                <span className="flex gap-1 items-center">
                  <Heart
                    role="button"
                    className="fill-red-500 stroke-none w-4"
                  ></Heart>
                  {featuredBlogs[0].likes}
                </span>
              </div>
            </div>
          </div>

          {/* Second Card */}
          <div className="bg-black/80 rounded-3xl col-span-5 cd:col-span-2 overflow-hidden shadow-lg flex flex-col h-full">
            <img
              src={featuredBlogs[1].imageUrl}
              alt={featuredBlogs[1].title}
              className="w-full h-56 object-cover"
            />
            <div className="p-6 flex flex-col flex-1">
              <div className="text-xs text-gray-500 mb-1">
                {featuredBlogs[1].category} &nbsp;|&nbsp;{" "}
                {featuredBlogs[1].date}
              </div>
              <h2 className="text-xl font-bold text-white/80  mb-2 leading-snug">
                {featuredBlogs[1].title}
              </h2>
              <p className="text-sm text-gray-400 flex-1">
                {featuredBlogs[1].description}
              </p>
              <div className="flex mt-2 text-gray-700 text-sm gap-2 items-center">
                <span className="flex gap-1 items-center">
                  <Eye role="button" className="w-4 stroke-blue-700"></Eye>
                  {featuredBlogs[1].views}
                </span>
                <span className="flex gap-1 items-center">
                  <Heart
                    role="button"
                    className="w-4 fill-red-500 stroke-none"
                  ></Heart>
                  {featuredBlogs[1].likes}
                </span>
              </div>
            </div>
          </div>

          {/* Third Card */}
          <div className="bg-black/80 rounded-3xl col-span-5 cd:col-span-2 overflow-hidden shadow-lg flex flex-col h-full">
            <img
              src={featuredBlogs[2].imageUrl}
              alt={featuredBlogs[2].title}
              className="w-full h-56 object-cover"
            />
            <div className="p-6 flex flex-col flex-1">
              <div className="text-xs text-gray-500 mb-1">
                {featuredBlogs[2].category} &nbsp;|&nbsp;{" "}
                {featuredBlogs[2].date}
              </div>
              <h2 className="text-xl font-bold text-white/80 mb-2 leading-snug">
                {featuredBlogs[2].title}
              </h2>
              <p className="text-sm text-gray-400 flex-1">
                {featuredBlogs[2].description}
              </p>
              <div className="flex mt-2 text-gray-700 text-sm gap-2 items-center">
                <span className="flex gap-1 items-center">
                  <Eye role="button" className="w-4 stroke-blue-700 "></Eye>
                  {featuredBlogs[2].views}
                </span>
                <span className="flex gap-1 items-center">
                  <Heart
                    role="button"
                    className="w-4 fill-red-500 stroke-none"
                  ></Heart>
                  {featuredBlogs[2].likes}
                </span>
              </div>
            </div>
          </div>

          {/* Fourth Card */}
          <div className="bg-black/80 rounded-3xl col-span-5 cd:col-span-3 overflow-hidden shadow-lg flex flex-col h-full">
            <img
              src={featuredBlogs[3].imageUrl}
              alt={featuredBlogs[3].title}
              className="w-full h-56 object-cover"
            />
            <div className="p-6 flex flex-col flex-1">
              <div className="text-xs text-gray-500 mb-1">
                {featuredBlogs[3].category} &nbsp;|&nbsp;{" "}
                {featuredBlogs[3].date}
              </div>
              <h2 className="text-xl font-bold text-white/80  mb-3 leading-snug">
                {featuredBlogs[3].title}
              </h2>
              <p className="text-sm text-gray-400 flex-1">
                {featuredBlogs[3].description}
              </p>
              <div className="flex mt-2 text-gray-700 text-sm gap-4 items-center">
                <span className="flex gap-1 items-center">
                  <Eye role="button" className="w-4 stroke-blue-700"></Eye>
                  {featuredBlogs[3].views}
                </span>
                <span className="flex gap-1 items-center">
                  <Heart
                    role="button"
                    className="w-4 fill-red-500 stroke-none"
                  ></Heart>
                  {featuredBlogs[3].likes}
                </span>
              </div>
            </div>
          </div>

          {/* Fifth Card */}
          <div className="bg-black/80 rounded-3xl col-span-5 cd:col-span-3 overflow-hidden shadow-lg flex flex-col h-full">
            <img
              src={featuredBlogs[4].imageUrl}
              alt={featuredBlogs[4].title}
              className="w-full h-56 object-cover"
            />
            <div className="p-6 flex flex-col flex-1">
              <div className="text-xs text-gray-500 mb-1">
                {featuredBlogs[4].category} &nbsp;|&nbsp;{" "}
                {featuredBlogs[4].date}
              </div>
              <h2 className="text-xl font-bold text-white/80  mb-3 leading-snug">
                {featuredBlogs[4].title}
              </h2>
              <p className="text-sm text-gray-400 flex-1">
                {featuredBlogs[4].description}
              </p>
              <div className="flex mt-2 text-gray-700 text-sm gap-4 items-center">
                <span className="flex gap-1 items-center">
                  <Eye role="button" className="w-4 stroke-blue-700"></Eye>
                  {featuredBlogs[4].views}
                </span>
                <span className="flex gap-1 items-center">
                  <Heart
                    role="button"
                    className="w-4 fill-red-500 stroke-none"
                  ></Heart>
                  {featuredBlogs[4].likes}
                </span>
              </div>
            </div>
          </div>

          {/* Sixth Card */}
          <div className="bg-black/80 rounded-3xl col-span-5 cd:col-span-2 overflow-hidden shadow-lg flex flex-col h-full">
            <img
              src={featuredBlogs[5].imageUrl}
              alt={featuredBlogs[5].title}
              className="w-full h-56 object-cover"
            />
            <div className="p-6 flex flex-col flex-1">
              <div className="text-xs text-gray-500 mb-1">
                {featuredBlogs[5].category} &nbsp;|&nbsp;{" "}
                {featuredBlogs[5].date}
              </div>
              <h2 className="text-xl font-bold text-white/80  mb-3 leading-snug">
                {featuredBlogs[5].title}
              </h2>
              <p className="text-sm text-gray-400 flex-1">
                {featuredBlogs[5].description}
              </p>
              <div className="flex mt-2 text-gray-700 text-sm gap-4 items-center">
                <span className="flex gap-1 items-center">
                  <Eye role="button" className="w-4 stroke-blue-700"></Eye>
                  {featuredBlogs[5].views}
                </span>
                <span className="flex gap-1 items-center">
                  <Heart
                    role="button"
                    className="w-4 fill-red-500 stroke-none"
                  ></Heart>
                  {featuredBlogs[5].likes}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Button */}
        <div className="mt-12 flex justify-end">
          <button className="bg-white border hover:bg-gray-200 border-gray-200 rounded-full px-6 py-2 font-semibold shadow transition">
            More &rarr;
          </button>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
