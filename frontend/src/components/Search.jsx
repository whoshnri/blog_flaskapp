import React, { useState } from "react";
import notfound from '../assets/notfound.svg'

const mockData = [
  { id: 1, title: "React Basics", category: "React", author: "John Doe" },
  { id: 2, title: "Advanced Tailwind", category: "CSS", author: "Jane Smith" },
  { id: 3, title: "Node.js Guide", category: "Backend", author: "Alice Johnson" },
  { id: 4, title: "React State Management", category: "React", author: "John Doe" },
  { id: 5, title: "CSS Grid vs Flexbox", category: "CSS", author: "Jane Smith" },
];

const categories = ["All", "React", "CSS", "Backend"];
const authors = ["All", "John Doe", "Jane Smith", "Alice Johnson"];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedAuthor, setSelectedAuthor] = useState("All");

  const filteredData = mockData.filter((item) => {
    const matchesQuery = item.title.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesAuthor = selectedAuthor === "All" || item.author === selectedAuthor;
    return matchesQuery && matchesCategory && matchesAuthor;
  });

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
            {/* Search Bar */}
            <input
              type="text"
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-[#0f0f0f] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            {/* Filters (grid on xs, flex on md+) */}
            <div className="grid grid-cols-2 gap-2 md:flex md:flex-row md:items-center md:gap-4">
              {/* Category Filter */}
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
              {/* Author Filter */}
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

        {/* Add padding-top to prevent content from being hidden behind the sticky bar */}
        <div className="pt-5">
          {/* Results */}
          <div className="grid gap-4">
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#0f0f0f] border border-gray-700 p-5 rounded-lg shadow-lg hover:shadow-2xl transition"
                >
                  <h3 className="text-xl font-semibold text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-green-400">Category: {item.category}</p>
                  <p className="text-sm text-gray-400">Author: {item.author}</p>
                </div>
              ))
            ) : (
                <div className="w-fit mx-auto mt-6 text-center text-gray-300">
              <img src={notfound} alt="nothing here icon" width={500} height={500} />
              <p>Yikes! Try something else</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
