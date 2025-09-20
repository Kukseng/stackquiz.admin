"use client";
import { useState, useEffect, useRef } from "react";
import { Search, Edit, Slash, Ban, Sun, Moon, AlertTriangle, CheckCircle, Trash2 } from "lucide-react";

const initialQuizzes = [
  {
    id: 1,
    quiz: "Python",
    author: "Dara",
    category: "Programming",
    flags: "Copyright",
    status: "Pending",
  },
  {
    id: 2,
    quiz: "World Capitals",
    author: "Ra",
    category: "General",
    flags: "Low Quality",
    status: "Approved",
  },
  {
    id: 3,
    quiz: "ByeWind",
    author: "Momo",
    category: "General",
    flags: "Spam",
    status: "Pending",
  },
  {
    id: 4,
    quiz: "JavaScript",
    author: "Lee",
    category: "Programming",
    flags: "Inappropriate",
    status: "Removed",
  },
  {
    id: 5,
    quiz: "React Basics",
    author: "Sam",
    category: "Programming",
    flags: "Spam",
    status: "Approved",
  },
  {
    id: 6,
    quiz: "History 101",
    author: "Ana",
    category: "General",
    flags: "Low Quality",
    status: "Pending",
  },
  {
    id: 7,
    quiz: "CSS Tricks",
    author: "Tom",
    category: "Programming",
    flags: "Inappropriate",
    status: "Approved",
  },
  {
    id: 8,
    quiz: "Math Fun",
    author: "Zoe",
    category: "General",
    flags: "Spam",
    status: "Removed",
  },
];

const categories = ["All categories", "Programming", "General"];

export default function Moderation() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All categories");
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  const [quizzes, setQuizzes] = useState(initialQuizzes);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  const categoryRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        categoryRef.current &&
        !categoryRef.current.contains(event.target as Node)
      ) {
        setCategoryDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (id: number) =>
    setActiveDropdown(activeDropdown === id ? null : id);

  const handleAction = (id: number, action: string) => {
    setQuizzes((prev) =>
      prev.map((quiz) =>
        quiz.id === id
          ? {
              ...quiz,
              status:
                action === "Ban"
                  ? "Removed"
                  : action === "Suspend"
                    ? "Pending"
                    : quiz.status,
            }
          : quiz,
      ),
    );
    setActiveDropdown(null);
  };

  const filteredQuizzes = quizzes.filter(
    (q) =>
      (category === "All categories" || q.category === category) &&
      (q.quiz.toLowerCase().includes(search.toLowerCase()) ||
        q.author.toLowerCase().includes(search.toLowerCase())),
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-200";
      case "Removed":
        return "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  return (
    <div className="mx-auto max-w-7xl rounded-2xl bg-white p-8 shadow-sm transition-colors dark:bg-gray-dark dark:text-gray-200">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Moderation</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Review flagged quizzes and take action
          </p>
        </div>
      </div>

      {/* Search + Category Filter */}
      <div className="mb-6 flex flex-col items-start gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search users, quizzes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-[20px] border border-gray-300 px-4 py-2 pl-10 pr-4 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          />
        </div>

        {/* Custom Category Dropdown */}
        <div className="relative w-48" ref={categoryRef}>
          <button
            onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
            className="flex w-48 items-center justify-between rounded-[20px] border border-gray-300 bg-white px-4 py-2 text-left focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-gray-100"
          >
            {category}
            <svg
              className="h-4 w-4 text-gray-500 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {categoryDropdownOpen && (
            <ul className="absolute z-10 mt-1 w-full rounded-[20px] border border-gray-300 bg-white shadow-md dark:border-dark-4 dark:bg-gray-dark">
              {categories.map((cat) => (
                <li
                  key={cat}
                  onClick={() => {
                    setCategory(cat);
                    setCategoryDropdownOpen(false);
                  }}
                  className="cursor-pointer rounded-[20px] px-4 py-2 hover:bg-blue-100 dark:hover:bg-blue-600"
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
        <table className="w-full border-separate border-spacing-y-1 text-left">
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
                className="rounded-xl border bg-white shadow-sm transition-colors hover:bg-gray-100 dark:bg-gray-dark dark:hover:bg-dark-3"
              >
                <td className="px-4 py-4 font-medium">
                  {i + 1}. {q.quiz}
                </td>
                <td className="px-4 py-4">{q.author}</td>
                <td className="px-4 py-4">{q.category}</td>
                <td className="px-4 py-4">{q.flags}</td>
                <td className="px-4 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(q.status)}`}
                  >
                    {q.status}
                  </span>
                </td>
                <td className="relative px-4 py-4">
                  <div
                    className="cursor-pointer rounded px-2 py-1 hover:bg-gray-100 dark:hover:bg-dark-3"
                    onClick={() => toggleDropdown(q.id)}
                  >
                    •••
                  </div>

                  {activeDropdown === q.id && (
                  <div className="absolute right-4 top-full z-10 mt-1 w-32 rounded-[20px] border border-gray-200 bg-white shadow-md dark:border-dark-4 dark:bg-dark-2">
  <div
    className="flex cursor-pointer items-center gap-2 px-3 py-2 hover:rounded-[20px] hover:bg-gray-100 dark:hover:bg-dark-3"
    onClick={() => handleAction(q.id, "Edit")}
  >
    <CheckCircle className="h-4 w-4 text-blue-500" />
    <span className="text-blue-500">Approve</span>
  </div>
  <div
    className="flex cursor-pointer items-center gap-2 px-3 py-2 hover:rounded-[20px] hover:bg-gray-100 dark:hover:bg-dark-3"
    onClick={() => handleAction(q.id, "Suspend")}
  >
    <AlertTriangle className="h-4 w-4 text-yellow-500" />
    <span className="text-yellow-500">Flag</span>
  </div>
  <div
    className="flex cursor-pointer items-center gap-2 px-3 py-2 hover:rounded-[20px] hover:bg-gray-100 dark:hover:bg-dark-3"
    onClick={() => handleAction(q.id, "Ban")}
  >
    <Trash2 className="h-4 w-4 text-red-500" />
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
