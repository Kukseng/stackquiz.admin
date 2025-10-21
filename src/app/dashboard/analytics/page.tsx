

"use client";

import React from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useGetUserActivityQuery, useGetAllQuizzesQuery } from '@/services/adminApi';
import { Activity, TrendingUp, BarChart3 } from 'lucide-react';

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

export default function AnalyticsPage() {
  const { data: activity } = useGetUserActivityQuery();
  const { data: quizzes } = useGetAllQuizzesQuery();

  return (
    <DashboardLayout currentPage="analytics">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <StatCard title="Total Views" value={activity?.totalViews || '45,678'} icon={Activity} trend={15} color="blue" />
          <StatCard title="Engagement Rate" value="68%" icon={TrendingUp} trend={5} color="green" />
          <StatCard title="Completion Rate" value="82%" icon={BarChart3} trend={3} color="purple" />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Activity Trends</h2>
          <div className="h-64 flex items-end justify-between space-x-2">
            {[40, 65, 45, 80, 55, 70, 85, 60, 75, 90, 70, 85].map((height, i) => (
              <div key={i} className="flex-1 bg-blue-500 rounded-t" style={{ height: `${height}%` }}></div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Top Performing Quizzes</h2>
            <div className="space-y-3">
              {quizzes?.slice(0, 5).map((quiz: any, i: number) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm">{quiz.title}</span>
                  <span className="text-sm font-semibold text-blue-600">
                    {quiz.totalParticipants || 0} plays
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Quiz Distribution</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Published</span>
                <span className="font-semibold">{quizzes?.filter((q: any) => q.isPublished)?.length || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Draft</span>
                <span className="font-semibold">{quizzes?.filter((q: any) => !q.isPublished)?.length || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
