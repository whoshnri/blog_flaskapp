import React, { useState, useEffect } from "react";
import { Tag, User, Calendar, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MobileNav from "./navs/SearchNav"
const API = import.meta.env.VITE_API_BASE_URL;


const getCategoryColor = (num) => {
  switch (num) {
    case 1:
      return "from-purple-700 to-purple-900";
    case 2:
      return "from-green-700 to-green-900";
    case 3:
      return "from-blue-700 to-blue-900";
    default:
      return "from-gray-700 to-gray-900";
  }
};

const getCategoryBadgeColor = (num) => {
  switch (num) {
    case 1:
      return "bg-purple-800/30 text-purple-300 border-purple-400/30";
    case 2:
      return "bg-green-800/30 text-green-300 border-green-400/30";
    case 3:
      return "bg-blue-800/30 text-blue-300 border-blue-400/30";
    default:
      return "bg-gray-800/30 text-gray-300 border-gray-400/30";
  }
};

export default function SearchPage({ setLoading, scrollRef }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedAuthor, setSelectedAuthor] = useState("All");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [data, setData] = useState([]);

  const filteredData = data.filter((item) => {
    const matchesQuery = item.title.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesAuthor = selectedAuthor === "All" || item.author === selectedAuthor;
    return matchesQuery && matchesCategory && matchesAuthor;
  });

  const categories = ["All", ...new Set(data.map((item) => item.category))];
  const authors = ["All", ...new Set(data.map((item) => item.author))];

  const fetchBlogs = async () => {
    if (!hasMore) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/get/blogs?page=${page}&limit=4`);
      const dataRes = await res.json();
      if (res.ok) {
        setData(prev => [...prev, ...dataRes.results]);
        setHasMore(dataRes.has_more);
        console.log(dataRes.results)
        setPage(prev => prev + 1);
      }
    } catch (err) {
      console.error("Error fetching blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
  const container = scrollRef.current;

  const handleScroll = () => {
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;

    if (scrollTop + clientHeight >= scrollHeight  && hasMore) {
      fetchBlogs();
    }
  };

  container.addEventListener("scroll", handleScroll);
  return () => container.removeEventListener("scroll", handleScroll);
}, [hasMore, page]);


  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden">
      {/* Filters */}
      <div className="sticky top-0 z-10 bg-black/90 backdrop-blur border-b border-gray-800 p-4 mb-6 ">
       <div className="flex justify-between">
        <h1 className="text-3xl font-bold mb-4">Browse blogs</h1>

            <div className="cd:hidden ">
              <MobileNav></MobileNav>
            </div>
           </div>
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
      </div>

      {/* Blog Cards */}
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 mb-8 px-4">
        {filteredData.length > 0 ? (
          filteredData.map((item, index) => {
            const color = Math.floor(Math.random() * 3) + 1;
            return (
              <div
                key={item.pid}
                onClick={() => navigate(`/read/${item.pid}`)}
                className={`group relative bg-gradient-to-br ${getCategoryColor(color)} backdrop-blur-sm border rounded-2xl px-6 py-3 hover:scale-95 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 cursor-pointer`}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: "fadeInUp 0.6s ease-out forwards",
                }}
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/0 via-blue-500/0 to-green-500/0 group-hover:from-purple-500/10 group-hover:via-blue-500/10 group-hover:to-green-500/10 transition-all duration-500"></div>
                <div className="relative z-10">
                  <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border mb-2 ${getCategoryBadgeColor(color)}`}>
                    <Tag className="w-3 h-3" />
                    {item.category}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-purple-300">{item.title}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-300">
                      <User className="w-4 h-4 text-gray-400" />
                      <span>{item.author}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>{item.created}</span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center text-purple-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <span className="group-parent hover:underline">Read blog</span>
                    <svg
                      className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
            <Search className="w-12 h-12 text-gray-400" />
            <h3 className="text-2xl font-bold text-gray-300 mb-2">No results found</h3>
            <p className="text-gray-400 max-w-md">
              We couldn't find any articles matching your search criteria. Try adjusting your filters or search terms.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
