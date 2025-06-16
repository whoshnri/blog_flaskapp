import React, { useState, useEffect } from "react";
import { Tag, User, Calendar, Search } from "lucide-react";
import Nil from '../assets/notfound.svg'

// Dummy data
const mockData = [
  { id: 1, title: "React Basics", category: "React", author: "John Doe" },
  { id: 2, title: "Advanced Tailwind", category: "CSS", author: "Jane Smith" },
  { id: 3, title: "Node.js Guide", category: "Backend", author: "Alice Johnson" },
  { id: 4, title: "React State Management", category: "React", author: "John Doe" },
  { id: 5, title: "CSS Grid vs Flexbox", category: "CSS", author: "Jane Smith" },
  { id: 6, title: "React Basics", category: "React", author: "John Doe" },
  { id: 7, title: "Advanced Tailwind", category: "CSS", author: "Jane Smith" },
  { id: 8, title: "Node.js Guide", category: "Backend", author: "Alice Johnson" },
  { id: 9, title: "React State Management", category: "React", author: "John Doe" },
  { id: 10, title: "CSS Grid vs Flexbox", category: "CSS", author: "Jane Smith" },
  { id: 11, title: "React Basics", category: "React", author: "John Doe" },
  { id: 12, title: "Advanced Tailwind", category: "CSS", author: "Jane Smith" },
  { id: 13, title: "Node.js Guide", category: "Backend", author: "Alice Johnson" },
  { id: 14, title: "React State Management", category: "React", author: "John Doe" },
  { id: 15, title: "CSS Grid vs Flexbox", category: "CSS", author: "Jane Smith" },
  { id: 16, title: "React Basics", category: "React", author: "John Doe" },
  { id: 17, title: "Advanced Tailwind", category: "CSS", author: "Jane Smith" },
  { id: 18, title: "Node.js Guide", category: "Backend", author: "Alice Johnson" },
  { id: 19, title: "React State Management", category: "React", author: "John Doe" },
  { id: 20, title: "CSS Grid vs Flexbox", category: "CSS", author: "Jane Smith" },
  { id: 21, title: "React Basics", category: "React", author: "John Doe" },
  { id: 22, title: "Advanced Tailwind", category: "CSS", author: "Jane Smith" },
  { id: 23, title: "Node.js Guide", category: "Backend", author: "Alice Johnson" },
  { id: 24, title: "React State Management", category: "React", author: "John Doe" },
  { id: 25, title: "CSS Grid vs Flexbox", category: "CSS", author: "Jane Smith" },
  { id: 26, title: "React Basics", category: "React", author: "John Doe" },
  { id: 27, title: "Advanced Tailwind", category: "CSS", author: "Jane Smith" },
  { id: 28, title: "Node.js Guide", category: "Backend", author: "Alice Johnson" },
  { id: 29, title: "React State Management", category: "React", author: "John Doe" },
  { id: 30, title: "CSS Grid vs Flexbox", category: "CSS", author: "Jane Smith" },
  { id: 31, title: "React Basics", category: "React", author: "John Doe" },
  { id: 32, title: "Advanced Tailwind", category: "CSS", author: "Jane Smith" },
  { id: 33, title: "Node.js Guide", category: "Backend", author: "Alice Johnson" },
  { id: 34, title: "React State Management", category: "React", author: "John Doe" },
  { id: 35, title: "CSS Grid vs Flexbox", category: "CSS", author: "Jane Smith" },
  { id: 36, title: "React Basics", category: "React", author: "John Doe" },
  { id: 37, title: "Advanced Tailwind", category: "CSS", author: "Jane Smith" },
  { id: 38, title: "Node.js Guide", category: "Backend", author: "Alice Johnson" },
  { id: 39, title: "React State Management", category: "React", author: "John Doe" },
  { id: 40, title: "CSS Grid vs Flexbox", category: "CSS", author: "Jane Smith" },
];

const categories = ["All", "React", "CSS", "Backend"];
const authors = ["All", "John Doe", "Jane Smith", "Alice Johnson"];
const RESULTS_PER_PAGE = 6;

// Category color helper
const getCategoryColor = (category) => {
  switch (category) {
    case "React": return "from-purple-700 to-purple-900";
    case "CSS": return "from-green-700 to-green-900";
    case "Backend": return "from-blue-700 to-blue-900";
    default: return "from-gray-700 to-gray-900";
  }
};

const getCategoryBadgeColor = (category) => {
  switch (category) {
    case "React": return "bg-purple-800/30 text-purple-400 border-purple-500/30";
    case "CSS": return "bg-green-800/30 text-green-400 border-green-500/30";
    case "Backend": return "bg-blue-800/30 text-blue-400 border-blue-500/30";
    default: return "bg-gray-800/30 text-gray-400 border-gray-500/30";
  }
};

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedAuthor, setSelectedAuthor] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = mockData.filter((item) => {
    const matchesQuery = item.title.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesAuthor = selectedAuthor === "All" || item.author === selectedAuthor;
    return matchesQuery && matchesCategory && matchesAuthor;
  });

  const totalPages = Math.ceil(filteredData.length / RESULTS_PER_PAGE);
  const startIdx = (currentPage - 1) * RESULTS_PER_PAGE;
  const paginatedData = filteredData.slice(startIdx, startIdx + RESULTS_PER_PAGE);

  const goToPreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  useEffect(() => {
    setCurrentPage(1);
  }, [query, selectedCategory, selectedAuthor]);

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
                {authors.map((auth) => (
                  <option key={auth} value={auth}>{auth}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="text-sm text-gray-400 mt-4 bg-gray-800/40 px-3 py-2 rounded-lg border border-gray-600/30">
            {filteredData.length} result{filteredData.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 mb-8 px-4">
          {paginatedData.length > 0 ? (
            paginatedData.map((item, index) => (
              <div
                key={item.id}
                className={`group relative bg-gradient-to-br ${getCategoryColor(item.category)} backdrop-blur-sm border rounded-2xl px-6 py-3 hover:scale-95 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 cursor-pointer`}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeInUp 0.6s ease-out forwards',
                }}
              >
                {/* Hover Glow */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/0 via-blue-500/0 to-green-500/0 group-hover:from-purple-500/10 group-hover:via-blue-500/10 group-hover:to-green-500/10 transition-all duration-500"></div>

                <div className="relative z-10">
                  <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border mb-2 ${getCategoryBadgeColor(item.category)}`}>
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

        {/* Pagination Controls */}
        {filteredData.length > RESULTS_PER_PAGE && (
          <div className="flex justify-center items-center scale-75 cd:scale-100 gap-6 py-8">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-800/60 border border-gray-600/50 hover:bg-purple-600/20 hover:border-purple-500/50 disabled:opacity-40 transition-all duration-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>

            <div className="text-sm text-gray-400 bg-gray-800/40 px-2 py-2 rounded-lg border border-gray-600/30 flex gap-1">
              Page <span className="font-bold text-white">{currentPage}</span> of <span className="font-bold text-white">{totalPages}</span>
            </div>

            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-800/60 border border-gray-600/50 hover:bg-purple-600/20 hover:border-purple-500/50 disabled:opacity-40 transition-all duration-300"
            >
              Next
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
