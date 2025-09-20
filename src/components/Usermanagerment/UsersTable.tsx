"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { Edit, Slash, Ban } from "lucide-react";

interface User {
  id: number;
  name: string;
  role: string;
  lastActivity: string;
  state: "Active" | "Suspended" | "Banned";
  avatarUrl?: string;
}

const initialUsers: User[] = [
  { id: 1, name: "ByeWind", role: "user", lastActivity: "3h ago", state: "Active" },
  { id: 2, name: "ByeWind", role: "User", lastActivity: "10m ago", state: "Suspended" },
  { id: 3, name: "ByeWind", role: "Organizer", lastActivity: "5m ago", state: "Banned" },
  { id: 4, name: "ByeWind", role: "Users", lastActivity: "7d ago", state: "Active" },
];

const roles = ["All", "User", "Organizer"];
const statuses = ["All", "Active", "Suspended", "Banned"];

export default function UsersTable() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [openRoleDropdown, setOpenRoleDropdown] = useState(false);
  const [openStatusDropdown, setOpenStatusDropdown] = useState(false);

  const roleDropdownRef = useRef<HTMLDivElement | null>(null);
  const statusDropdownRef = useRef<HTMLDivElement | null>(null);
  const userDropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(event.target as Node)) {
        setOpenRoleDropdown(false);
      }
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
        setOpenStatusDropdown(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase());
    const normalizedRole = user.role.toLowerCase();
    const normalizedFilter = roleFilter.toLowerCase();
    const matchesRole =
      roleFilter === "All" ||
      (normalizedFilter === "user" && ["user", "users"].includes(normalizedRole)) ||
      normalizedRole === normalizedFilter;
    const matchesStatus = statusFilter === "All" || user.state === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const toggleUserDropdown = (id: number) => setActiveDropdown(activeDropdown === id ? null : id);

  const handleAction = (id: number, action: string) => {
    console.log(`User ${id} - Action: ${action}`);
    setActiveDropdown(null);
  };

  return (
    <div className="rounded-2xl bg-white p-6  transition-colors duration-300 dark:bg-gray-dark dark:text-gray-200">
      <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">Users</h2>
      <p className="mb-6 text-gray-500 dark:text-gray-400">Manage all users on the platform.</p>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-[20px] border border-gray-300 px-4 py-2 transition-colors
                     focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 sm:w-1/3"
        />

        <div className="flex gap-4">
          {/* Role Filter */}
          <div className="relative" ref={roleDropdownRef}>
            <button
              onClick={() => setOpenRoleDropdown(!openRoleDropdown)}
              className="w-36 text-left rounded-[20px] border border-gray-300 px-4 py-2 flex justify-between items-center bg-white dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {roleFilter}
              <svg
                className="h-4 w-4 text-gray-500 dark:text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openRoleDropdown && (
              <ul className="absolute mt-1 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-[20px] shadow-lg z-10">
                {roles.map((role) => (
                  <li
                    key={role}
                    onClick={() => {
                      setRoleFilter(role);
                      setOpenRoleDropdown(false);
                    }}
                    className="px-4 py-2 hover:bg-blue-100 dark:hover:bg-blue-600 cursor-pointer rounded-[20px]"
                  >
                    {role}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Status Filter */}
          <div className="relative" ref={statusDropdownRef}>
            <button
              onClick={() => setOpenStatusDropdown(!openStatusDropdown)}
              className="w-36 text-left rounded-[20px] border border-gray-300 px-4 py-2 flex justify-between items-center bg-white dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {statusFilter}
              <svg
                className="h-4 w-4 text-gray-500 dark:text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openStatusDropdown && (
              <ul className="absolute mt-1 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-[20px] shadow-lg z-10">
                {statuses.map((status) => (
                  <li
                    key={status}
                    onClick={() => {
                      setStatusFilter(status);
                      setOpenStatusDropdown(false);
                    }}
                    className="px-4 py-2 hover:bg-blue-100 dark:hover:bg-blue-600 cursor-pointer rounded-[20px]"
                  >
                    {status}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <table className=" w-full text-gray-900 transition-colors dark:text-gray-100 border-separate border-spacing-y-1">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-600 text-left">
            <th className="py-3 px-4">Users</th>
            <th className="py-3 px-4">Role</th>
            <th className="py-3 px-4">Last activity</th>
            <th className="py-3 px-4">State</th>
            <th className="py-3 px-4">Action</th>
          </tr>
        </thead>
        <tbody className="text-gray-900 dark:text-gray-100 border rounded-sm">
          {filteredUsers.map((user) => (
            <tr
              key={user.id}
              className="bg-white dark:bg-gray-dark border rounded-xl shadow-sm hover:bg-gray-100 dark:hover:bg-dark-3 transition-colors"
            >
              <td className="flex items-center gap-3 py-4 px-4  ">
                <div className="h-8 w-8 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-600">
                  <Image
                    src={user.avatarUrl || "/images/default-avatar.png"}
                    alt={user.name}
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                </div>
                {user.name}
              </td>
              <td className="py-4 px-4">{user.role}</td>
              <td className="py-4 px-4">{user.lastActivity}</td>
              <td className={`py-4 px-4 font-medium ${
                  user.state === "Banned"
                    ? "text-red-500"
                    : user.state === "Suspended"
                    ? "text-yellow-500"
                    : "text-green-500"
                }`}
              >
                {user.state}
              </td>
              <td className="relative py-4 px-4">
                <div
                  className="cursor-pointer rounded px-2 py-1 transition-colors hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => toggleUserDropdown(user.id)}
                >
                  •••
                </div>
                {activeDropdown === user.id && (
                    <div className="absolute right-4 top-full z-10 mt-1 w-32 rounded-[20px] border border-gray-200 bg-white shadow-md dark:border-dark-4 dark:bg-dark-2">
                      <div
                        className="flex cursor-pointer items-center gap-2 px-3 py-2 hover:rounded-[20px] hover:bg-gray-100 dark:hover:bg-dark-3"
                        onClick={() => handleAction(q.id, "Edit")}
                      >
                        <Edit className="h-4 w-4 text-blue-500" />
                        <span className="text-blue-500">Edit</span>
                      </div>
                      <div
                        className="flex cursor-pointer items-center gap-2 px-3 py-2 hover:rounded-[20px] hover:bg-gray-100 dark:hover:bg-dark-3"
                        onClick={() => handleAction(q.id, "Suspend")}
                      >
                        <Slash className="h-4 w-4 text-yellow-500" />
                        <span className="text-yellow-500">Suspend</span>
                      </div>
                      <div
                        className="flex cursor-pointer items-center gap-2 px-3 py-2 hover:rounded-[20px] hover:bg-gray-100 dark:hover:bg-dark-3"
                        onClick={() => handleAction(q.id, "Ban")}
                      >
                        <Ban className="h-4 w-4 text-red-500" />
                        <span className="text-red-500">Ban</span>
                      </div>
                    </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
