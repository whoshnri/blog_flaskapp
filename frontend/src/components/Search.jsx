import React, { useState, useEffect } from "react";
import { Tag, User, Calendar, Search } from "lucide-react";
import Nil from '../assets/notfound.svg'

const RESULTS_PER_PAGE = 1;

// // Category color helper
// const getCategoryColor = (category) => {
//   switch (category) {
//     case "React": return "from-purple-700 to-purple-900";
//     case "CSS": return "from-green-700 to-green-900";
//     case "Backend": return "from-blue-700 to-blue-900";
//     default: return "from-gray-700 to-gray-900";
//   }
// };

// const getCategoryBadgeColor = (category) => {
//   switch (category) {
//     case "React": return "bg-purple-800/30 text-purple-400 border-purple-500/30";
//     case "CSS": return "bg-green-800/30 text-green-400 border-green-500/30";
//     case "Backend": return "bg-blue-800/30 text-blue-400 border-blue-500/30";
//     default: return "bg-gray-800/30 text-gray-400 border-gray-500/30";
//   }
// };

export default function SearchPage({setLoading}) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedAuthor, setSelectedAuthor] = useState("All");
  const [currentPage , setCurrentPage] = useState(1)

  const [data, setData] = useState([])

  const filteredData = data.filter((item) => {
    const matchesQuery = item.title.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesAuthor = selectedAuthor === "All" || item.author === selectedAuthor;
    return matchesQuery && matchesCategory && matchesAuthor;
  });

  const categories = ["All", ...new Set(data.map((item) => item.category))];
  const authors = ["All", ...new Set(data.map((item) => item.author))];
  const goToPreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  useEffect(() => {
  const getData = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:5000/get/blogs");
      const res = await response.json();

      if (response.ok) {
        setData(res);
      } else {
        console.error("Error fetching blogs:", res);
      }
    } catch (err) {
      console.error("Network error:", err);
    } finally {
      setLoading(false);
    }
  };

  getData();
}, []);


  return (
    <div className="relative min-h-screen bg-black text-white ">
      <div className="">
        {/* Sticky Filter Section */}
        <div className="sticky top-0 z-10 left-0 bg-black/90 backdrop-blur border-b border-gray-800 p-4 mb-6">
          <h1 className="text-3xl font-bold mb-2">Search for blogs</h1>
          <input
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-4 py-1 mb-2 rounded-md bg-[#0f0f0f] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <div className="grid grid-cols-2 md:flex gap-4">
            <div className="flex flex-col w-full md:w-1/3">
              <label className="text-xs text-gray-400 mb-1">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-2 py-1 text-sm rounded-md bg-[#0f0f0f] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col w-full md:w-1/3">
              <label className="text-xs text-gray-400 mb-1">Author</label>
              <select
                value={selectedAuthor}
                onChange={(e) => setSelectedAuthor(e.target.value)}
                className="px-2 py-1 text-sm rounded-md bg-[#0f0f0f] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {authors.map((author) => (
                  <option key={author} value={author}>{author}</option>
                ))}
              </select>
            </div>
          </div>

         {/* <div className="text-sm text-gray-400 mt-4 bg-gray-800/40 px-3 py-2 rounded-lg border border-gray-600/30">
            {filteredData.length} result{filteredData.length !== 1 ? 's' : ''}
          </div>*/}
        </div>

        {/* Results Grid */}
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 mb-8 px-4">
          {filteredData?.length > 0 ? (
            filteredData.map((item, index) => (
              <div
                key={item.id}
                className={`group relative bg-gradient-to-br ${item.category} backdrop-blur-sm border rounded-2xl px-6 py-3 hover:scale-95 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 cursor-pointer`}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeInUp 0.6s ease-out forwards',
                }}
              >
                {/* Hover Glow */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/0 via-blue-500/0 to-green-500/0 group-hover:from-purple-500/10 group-hover:via-blue-500/10 group-hover:to-green-500/10 transition-all duration-500"></div>

                <div className="relative z-10">
                  <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border mb-2 ${item.category}`}>
                    <Tag className="w-3 h-3" />
                    {item.category}
                  </div>

                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-purple-300 transition-colors duration-300">
                    {item.title}
                  </h3>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-300">
                      <User className="w-4 h-4 text-gray-400" />
                      <span>{item.author}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>12 May</span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center text-purple-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <span className="group-parent hover:underline">Read blog</span>
                    <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
              <div className="w-32 h-32 mb-6 rounded-full bg-gradient-to-br from-gray-800 to-gray-700 flex items-center justify-center">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-300 mb-2">No results found</h3>
              <p className="text-gray-400 max-w-md">
                We couldn't find any articles matching your search criteria. Try adjusting your filters or search terms.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
