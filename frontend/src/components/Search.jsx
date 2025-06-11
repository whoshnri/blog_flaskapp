import React, { useState } from "react";
import notfound from '../assets/notfound.svg'

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

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / RESULTS_PER_PAGE);
  const startIdx = (currentPage - 1) * RESULTS_PER_PAGE;
  const paginatedData = filteredData.slice(startIdx, startIdx + RESULTS_PER_PAGE);

  const goToPreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [query, selectedCategory, selectedAuthor]);

  return (
    <div className="relative min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Sticky Search & Filters */}
        <div
          id="fixed"
          className="sticky top-0 z-4 bg-black/90 backdrop-blur border-b border-gray-800 p-4 w-full"
        >
          <h1 className="cursive text-4xl mb-4">Search for blogs</h1>
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-[#0f0f0f] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <div className="grid grid-cols-2 gap-2 md:flex md:flex-row md:items-center md:gap-4">
              <div className="flex flex-col w-full md:w-1/4">
                <label className="text-xs text-gray-400 mb-1" htmlFor="category-select">
                  Category
                </label>
                <select
                  id="category-select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-2 py-1 text-sm rounded-md bg-[#0f0f0f] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col w-full md:w-1/4">
                <label className="text-xs text-gray-400 mb-1" htmlFor="author-select">
                  Author
                </label>
                <select
                  id="author-select"
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
          </div>
        </div>

        <div className="pt-5">
          {/* Results */}
          <div className="grid gap-4 cd:grid-cols-3">
            {paginatedData.length > 0 ? (
              paginatedData.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#0f0f0f] border border-gray-700 p-5 rounded-lg shadow-lg hover:shadow-2xl transition"
                >
                  <h3 className="text-xl font-semibold text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-green-400">Category: {item.category}</p>
                  <p className="text-sm text-gray-400">Author: {item.author}</p>
                  <p className="text-sm text-slate-200">Date: 12 May</p>
                </div>
              ))
            ) : (
              <div className="w-fit mx-auto mt-6 text-center text-gray-300">
                <img src={notfound} alt="nothing here icon" width={500} height={500} />
                <p>Yikes! Try something else</p>
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {filteredData.length > RESULTS_PER_PAGE && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm rounded-md border border-gray-600 bg-[#111] hover:bg-green-500 hover:text-black disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-sm text-gray-400">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm rounded-md border border-gray-600 bg-[#111] hover:bg-green-500 hover:text-black disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
