
"use client";

import React from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useGetAllQuizzesQuery, useGetCategoriesQuery } from '@/services/adminApi';

export default function ExplorePage() {
  const { data: quizzes, isLoading } = useGetAllQuizzesQuery();
  const { data: categories } = useGetCategoriesQuery();

  return (
    <DashboardLayout currentPage="explore">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Explore Quizzes</h1>
          <div className="flex space-x-2">
            <input type="text" placeholder="Search quizzes..." className="px-4 py-2 border border-gray-300 rounded-lg" />
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Search</button>
          </div>
        </div>

        <div className="flex space-x-4 overflow-x-auto pb-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg whitespace-nowrap">All</button>
          {categories?.slice(0, 6).map((cat: any, i: number) => (
            <button key={i} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 whitespace-nowrap">
              {cat.name || `Category ${i + 1}`}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="text-center py-12">Loading quizzes...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes?.map((quiz: any) => (
              <div key={quiz.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="h-40 bg-gradient-to-br from-blue-400 to-purple-500 rounded-t-lg"></div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{quiz.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {quiz.description?.slice(0, 100) || 'No description available'}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>⭐ {quiz.averageRating || '4.5'}</span>
                      <span>👥 {quiz.totalParticipants || '0'}</span>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
