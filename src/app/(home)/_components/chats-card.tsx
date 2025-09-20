import Image from "next/image";
import Link from "next/link";
import { getChatsData } from "../fetch";

export async function ChatsCard() {
  const data = await getChatsData();
  const placeholder = "/images/quiz/placeholder.png";

  return (
    <div className="col-span-12 rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-dark xl:col-span-4">
      {/* Title */}
      <h2 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
        Top Performing Quizzes
      </h2>
      <p className="mb-5 text-sm text-gray-500 dark:text-gray-400">
        Most played quizzes this week
      </p>

      {/* List */}
    <ul className="space-y-4">
  {data.map((quiz, index) => (
    <li
      key={index}
      className="flex items-center justify-between rounded-lg p-2 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-sm"
    >
      {/* Left: image + text */}
      <div className="flex items-center gap-3">
        <Image
          src={quiz.profile || placeholder}
          width={40}
          height={40}
          alt={quiz.name}
          className="rounded-full object-cover"
        />
        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
            {quiz.name}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {quiz.category}
          </p>
        </div>
      </div>

      {/* Right: plays */}
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {quiz.plays} plays
      </span>
    </li>
  ))}
</ul>


      {/* Footer */}
      <Link
        href="/"
        className="mt-5 block text-sm font-medium text-primary hover:underline"
      >
        See all quizzes →
      </Link>
    </div>
  );
}
