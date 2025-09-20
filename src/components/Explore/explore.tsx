"use client";
import { useState, useEffect, useRef } from "react";
import { Search, Edit, Slash, Trash2, Star } from "lucide-react";

const quizzes = [
  { id: 1, quiz: "Python", author: "Dara", category: "Programming", flags: "clean", status: "Removed" },
  { id: 2, quiz: "World Capitals", author: "Ra", category: "General", flags: "clean", status: "Approved" },
  { id: 3, quiz: "ByeWind", author: "Momo", category: "General", flags: "clean", status: "Pending" },
  { id: 4, quiz: "Math Basics", author: "Alex", category: "Math", flags: "clean", status: "Pending" },
  { id: 5, quiz: "JavaScript", author: "John", category: "Programming", flags: "clean", status: "Approved" },
];

const categories = ["All categories", "Programming", "General", "Math"];

export default function Explore() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All categories");
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);


  const categoryRef = useRef<HTMLDivElement | null>(null);


  // Close category dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setCategoryDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (id: number) => setActiveDropdown(activeDropdown === id ? null : id);

  const handleAction = (id: number, action: string) => {
    alert(`Action: ${action} on quiz ID ${id}`);
    setActiveDropdown(null);
  };

  const filteredQuizzes = quizzes.filter(
    (q) =>
      (category === "All categories" || q.category === category) &&
      (q.quiz.toLowerCase().includes(search.toLowerCase()) ||
        q.author.toLowerCase().includes(search.toLowerCase()))
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200";
      case "Removed":
        return "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-200";
      case "Featured":
        return "bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  return (
    <div className="max-w-7xl mx-auto bg-white dark:bg-gray-dark dark:text-gray-200 shadow-sm rounded-2xl p-8 relative transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">Explore curation</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Approve, remove or feature high-quality quizzes for the public
          </p>
        </div>
  
      </div>

      {/* Search + Custom Category Dropdown */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-start md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search users, quizzes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-full pl-10 pr-4 border border-gray-300 px-4 py-2 transition-colors
                     focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          />
        </div>

        {/* Custom Dropdown */}
        <div className="relative w-48" ref={categoryRef}>
          <button
            onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
            className="w-48 text-left rounded-[20px] border border-gray-300 px-4 py-2 flex justify-between items-center bg-white dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {category}
            <svg
              className="h-4 w-4 text-gray-500 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {categoryDropdownOpen && (
            <ul className="absolute mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-[20px] shadow-md z-10">
              {categories.map((cat) => (
                <li
                  key={cat}
                  onClick={() => {
                    setCategory(cat);
                    setCategoryDropdownOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-blue-100 dark:hover:bg-blue-600 cursor-pointer rounded-[20px]"
                >
                  {cat}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-y-1">
          <thead className="text-sm text-gray-500 dark:text-gray-400">
            <tr>
              <th className="px-4 py-3">Quiz</th>
              <th className="px-4 py-3">Author</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Flags</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredQuizzes.map((q, i) => (
              <tr
                key={q.id}
                className="bg-white dark:bg-gray-dark border rounded-xl shadow-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <td className="px-4 py-4 font-medium">{i + 1}. {q.quiz}</td>
                <td className="px-4 py-4">{q.author}</td>
                <td className="px-4 py-4">{q.category}</td>
                <td className="px-4 py-4">{q.flags}</td>
                <td className="px-4 py-4">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(q.status)}`}>
                    {q.status}
                  </span>
                </td>
                <td className="px-4 py-4 relative">
                  <div
                    className="cursor-pointer px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => toggleDropdown(q.id)}
                  >
                    •••
                  </div>

                  {activeDropdown === q.id && (
                  <div className="absolute right-4 top-full mt-1 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-[20px] shadow-md z-10">
  <div
    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer rounded-[20px]"
    onClick={() => handleAction(q.id, "Feature")}
  >
    <Star className="w-4 h-4 text-green-600" />
    <span className="text-green-600">Feature</span>
  </div>
  <div
    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer rounded-[20px]"
    onClick={() => handleAction(q.id, "Remove")}
  >
    <Trash2 className="w-4 h-4 text-red-500" />
    <span className="text-red-500">Remove</span>
  </div>
</div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
