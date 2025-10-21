
// ============================================================
// 8. Profile Page - src/app/dashboard/profile/page.tsx
// ============================================================
"use client";

import React from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useGetCurrentUserQuery, useUpdateUserMutation } from '@/services/adminApi';

export default function ProfilePage() {
  const { data: user } = useGetCurrentUserQuery();
  const [updateUser] = useUpdateUserMutation();

  const handleSave = async () => {
    // Implement save logic
    alert('Profile updated!');
  };

  return (
    <DashboardLayout currentPage="profile">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-6 mb-6">
            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-3xl font-bold text-blue-600">
                {user?.firstName?.[0] || 'M'}{user?.lastName?.[0] || 'M'}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user?.firstName || 'User'} {user?.lastName || 'Name'}</h2>
              <p className="text-gray-500">{user?.email || 'user@stackquiz.com'}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input 
                type="text" 
                defaultValue={user?.username || ''} 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input 
                  type="text" 
                  defaultValue={user?.firstName || ''} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input 
                  type="text" 
                  defaultValue={user?.lastName || ''} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                type="email" 
                defaultValue={user?.email || ''} 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              />
            </div>
            <div className="pt-4">
              <button 
                onClick={handleSave}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}