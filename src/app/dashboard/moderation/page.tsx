"use client";

import React from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useGetMyReportsQuery, useGetMyFeedbackQuery, useSuspendQuizMutation } from '@/services/adminApi';
import { AlertTriangle, Shield, MessageSquare } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ElementType;
  color?: string;
}

const StatCard = ({ title, value, icon: Icon, color = "blue" }: StatCardProps) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-lg bg-${color}-100`}>
        <Icon className={`w-6 h-6 text-${color}-600`} />
      </div>
    </div>
    <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
    <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
  </div>
);

export default function ModerationPage() {
  const { data: reports } = useGetMyReportsQuery();
  const { data: feedback } = useGetMyFeedbackQuery();
  const [suspendQuiz] = useSuspendQuizMutation();

  const handleSuspendQuiz = async (quizId: string) => {
    if (confirm('Are you sure you want to suspend this quiz?')) {
      try {
        await suspendQuiz({ 
          quizId, 
          data: { reason: 'Inappropriate content' } 
        }).unwrap();
        alert('Quiz suspended successfully');
      } catch {
        // remove unused variable to satisfy ESLint
        alert('Failed to suspend quiz');
      }
    }
  };

  return (
    <DashboardLayout currentPage="moderation">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Content Moderation</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <StatCard title="Pending Reports" value={reports?.length || 0} icon={AlertTriangle} color="red" />
          <StatCard title="Resolved Today" value="28" icon={Shield} color="green" />
          <StatCard title="Feedback Items" value={feedback?.length || 0} icon={MessageSquare} color="blue" />
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Recent Reports</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {reports?.map((report: any, i: number) => (
              <div key={i} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {report.reason || 'Inappropriate content'}
                        </p>
                        <p className="text-sm text-gray-500">
                          Quiz ID: {report.quizId} • {new Date(report.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200">
                      Approve
                    </button>
                    <button 
                      onClick={() => handleSuspendQuiz(report.quizId)}
                      className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                    >
                      Suspend
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
