"use client";

import React from "react";
import { useGetAllQuizzesQuery } from "@/services/adminApi";

export default function QuizList() {
  const { data: quizzes, error, isLoading } = useGetAllQuizzesQuery({ active: true });

  if (isLoading) return <p>Loading quizzes...</p>;
  if (error) return <p>Error loading quizzes.</p>;

  return (
    <div>
      <h3 className="text-xl font-semibold mb-3">Available Quizzes</h3>
      <ul className="space-y-2">
        {quizzes?.map((quiz) => (
          <li
            key={quiz.id}
            className="border p-3 rounded shadow-sm hover:bg-gray-50"
          >
            <strong>{quiz.title}</strong> — {quiz.questions?.length || 0} questions
          </li>
        ))}
      </ul>
    </div>
  );
}
