
"use client";

import React from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useGetAllQuizzesQuery, useGetUserActivityQuery } from '@/services/adminApi';
import { Activity, Users, TrendingUp, Star } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, trend, color = "blue" }: any) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-lg bg-${color}-100`}>
        <Icon className={`w-6 h-6 text-${color}-600`} />
      </div>
      {trend && (
        <span className={`text-sm font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
    <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
    <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
  </div>
);

export default function DashboardPage() {
  const { data: quizzes, isLoading: quizzesLoading } = useGetAllQuizzesQuery();
  const { data: activity } = useGetUserActivityQuery();

  return (
    <DashboardLayout currentPage="overview">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Admin Overview</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total Quizzes" 
            value={quizzesLoading ? '...' : quizzes?.length || 0} 
            icon={Activity} 
            trend={12} 
            color="blue" 
          />
          <StatCard 
            title="Active Users" 
            value={activity?.totalUsers || '2,345'} 
            icon={Users} 
            trend={8} 
            color="green" 
          />
          <StatCard 
            title="Total Sessions" 
            value={activity?.totalSessions || '1,234'} 
            icon={TrendingUp} 
            trend={-3} 
            color="purple" 
          />
          <StatCard 
            title="Avg Rating" 
            value="4.5" 
            icon={Star} 
            trend={5} 
            color="yellow" 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
            <div className="space-y-3">
              {quizzesLoading ? (
                <div className="text-center py-4 text-gray-500">Loading...</div>
              ) : quizzes?.slice(0, 4).map((quiz: any, i: number) => (
                <div key={quiz.id || i} className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">New quiz: "{quiz.title || 'Untitled'}"</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {quiz.createdAt ? new Date(quiz.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              ))}
              {!quizzesLoading && (!quizzes || quizzes.length === 0) && (
                <div className="text-center py-4 text-gray-500">No recent activities</div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Quiz Statistics</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Published</span>
                <span className="font-semibold">
                  {quizzes?.filter((q: any) => q.isPublished)?.length || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Draft</span>
                <span className="font-semibold">
                  {quizzes?.filter((q: any) => !q.isPublished)?.length || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total</span>
                <span className="font-semibold">{quizzes?.length || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
