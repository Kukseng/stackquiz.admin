"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import { 
  BarChart3, Users, TrendingUp, Shield, Compass, 
  Settings, LogOut, Menu, X, AlertTriangle
} from 'lucide-react';

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
  const router = useRouter();

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3, path: '/dashboard' },
    { id: 'users', label: 'Users', icon: Users, path: '/dashboard/users' },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp, path: '/dashboard/analytics' },
    { id: 'moderation', label: 'Moderation', icon: Shield, path: '/dashboard/moderation' },
    { id: 'explore', label: 'Explore', icon: Compass, path: '/dashboard/explore' },
    { id: 'profile', label: 'Profile', icon: Settings, path: '/dashboard/profile' }
  ];

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <div className="flex h-screen bg-gray-50 ">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-72' : 'w-20'} bg-gray-100 btn-text   transition-all duration-300 flex flex-col`}>
        <div className="p-4 flex items-center justify-between ">
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

        <nav className="flex-1 px-2 py-4 space-y-1">
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
              {sidebarOpen && currentPage === item.id}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={() => setShowSignOutModal(true)}
            className="w-full flex items-center space-x-5 btn-text px-3 py-2 bg-blue-200 hover:bg-gray-200 rounded-lg"
          >
            <LogOut className="w-5 h-5 flex items-center justify-center" />
            {sidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {children}
        </div>
      </main>

      {/* Sign Out Confirmation Modal */}
      {showSignOutModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div 
            className="absolute inset-0 backdrop-blur-xs"
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