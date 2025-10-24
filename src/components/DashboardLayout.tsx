"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import { Search, Calendar, Bell, ChevronDown } from "lucide-react";
import { 
  BarChart3, Users, TrendingUp, Shield, Compass, 
  Settings, LogOut, Menu, X, AlertTriangle, User
} from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useGetCurrentUserQuery } from '@/services/adminApi';

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentPage: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  currentPage 
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const { data: user } = useGetCurrentUserQuery();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    avatarUrl: '',
  });

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3, path: '/dashboard' },
    { id: 'users', label: 'Users', icon: Users, path: '/dashboard/users' },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp, path: '/dashboard/analytics' },
    { id: 'moderation', label: 'Moderation', icon: Shield, path: '/dashboard/moderation' },
    { id: 'explore', label: 'Explore', icon: Compass, path: '/dashboard/explore' },
  ];

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const getInitials = () => {
    const first = formData.firstName?.[0] || user?.firstName?.[0] || 'U';
    const last = formData.lastName?.[0] || user?.lastName?.[0] || 'N';
    return `${first}${last}`.toUpperCase();
  };

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        avatarUrl: user.avatarUrl || ''
      });
      if (user.avatarUrl) {
        setPreviewImage(user.avatarUrl);
      }
    }
  }, [user]);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-72' : 'w-20'} bg-gray-100 btn-text transition-all duration-300 flex flex-col`}>
        <div className="p-4 flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center space-x-2">
              <Image
                src="/logo-sq.png"
                alt="StackQuiz Logo"
                width={32}
                height={32}
                className="rounded"
              />
              <span className="font-bold text-yellow-500 text-lg">
                <span className="text-blue-950">STACK</span>QUIZ <span className="text-blue-950"> ADMIN</span>
              </span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-200 rounded-lg"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-1 bg-gray-100">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => router.push(item.path)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                currentPage === item.id ? 'bg-blu' : 'hover:bg-gray-200'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-6 py-3">
            {/* Search bar */}
            <div className="flex items-center flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users, quizzes..."
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>
            </div>

            {/* Right section */}
            <div className="flex items-center gap-4 ml-6">
              {/* Time range dropdown */}
              <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition">
                <Calendar className="h-4 w-4" />
                <span>Time range</span>
                <ChevronDown className="h-4 w-4 ml-1 text-gray-500" />
              </button>

              {/* Notifications */}
              <button className="p-2 rounded-full hover:bg-gray-100 transition relative">
                <Bell className="h-5 w-5 text-gray-700" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Profile Dropdown */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setOpen(!open)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center overflow-hidden">
                    {previewImage ? (
                      <Image
                        src={previewImage}
                        alt="Profile"
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-bold text-white">
                        {getInitials()}
                      </span>
                    )}
                  </div>
                  <div className="text-left hidden md:block">
                    <p className="text-sm font-medium text-gray-900">
                      {formData.firstName} {formData.lastName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user?.email || 'user@stackquiz.com'}
                    </p>
                  </div>
                  <ChevronDown 
                    className={`w-4 h-4 text-gray-500 transition-transform ${
                      open ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {open && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg py-2 animate-fade-in z-50">
                    {/* User Info Header */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">
                        {formData.firstName} {formData.lastName}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {user?.email || 'user@stackquiz.com'}
                      </p>
                    </div>

                    {/* Profile Settings */}
                    <button
                      onClick={() => {
                        router.push("/dashboard/profile");
                        setOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                    >
                      <User className="h-4 w-4 mr-3 text-gray-500" />
                      Profile Settings
                    </button>
                    {/* Divider */}
                    <div className="border-t my-1 border-gray-100"></div>

                    {/* Sign Out */}
                    <button
                      onClick={() => {
                        setShowSignOutModal(true);
                        setOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition"
                    >
                      <LogOut className="h-4 w-4 mr-3 text-red-500" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
        
        <div className="p-6 min-h-full bg-gray-50">
          {children}
        </div>
      </main>

      {/* Sign Out Confirmation Modal */}
      {showSignOutModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div 
            className="absolute inset-0 bg-opacity-10 backdrop-blur-xs"
            onClick={() => setShowSignOutModal(false)}
          ></div>
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden relative z-10">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-yellow-100 p-2 rounded-full">
                  <AlertTriangle className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Sign Out</h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                Are you sure you want to sign out? You'll need to log in again to access the dashboard.
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowSignOutModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSignOut}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};