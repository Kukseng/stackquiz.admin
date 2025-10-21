
"use client";

import React from "react";
import { useGetQuizzesQuery } from "@/services/quizApi";

export default function QuizList() {
  const { data, error, isLoading } = useGetQuizzesQuery();

  if (isLoading) return <p>Loading quizzes...</p>;
  if (error) return <p>Error loading quizzes.</p>;

  return (
    <div>
      <h3 className="text-xl font-semibold mb-3">Available Quizzes</h3>
      <ul className="space-y-2">
        {data?.map((quiz) => (
          <li
            key={quiz.id}
            className="border p-3 rounded shadow-sm hover:bg-gray-50"
          >
            <strong>{quiz.title}</strong> — {quiz.questionCount} questions
          </li>
        ))}
      </ul>
    </div>
  );
}
