"use client";
import { useState, useRef } from "react";

export default function ProfileSettings() {
  const [file, setFile] = useState<File | null>(null);
  const [language, setLanguage] = useState("English");
  const [timezone, setTimezone] = useState("GMT-5");
  const [langOpen, setLangOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef<HTMLDivElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  const languages = ["English", "Spanish", "French", "German", "Chinese"];
  const timezones = ["GMT-5", "GMT+1", "GMT+8", "GMT-8", "GMT+0"];

  return (
    <div className="mx-auto max-w-7xl rounded-[20px] bg-white p-8 shadow-sm dark:bg-gray-dark dark:text-gray-200 transition-colors">
      <h2 className="mb-6 text-xl font-semibold">Profile Settings</h2>

      {/* Profile Details */}
      <div>
        <h3 className="text-base font-semibold">Profile Details</h3>
        <p className="mb-4 text-sm text-gray-500">
          Enter your profile information
        </p>

        {/* Upload */}
        <div className="mb-6 flex flex-col items-center justify-center rounded-[20px] border-2 border-dashed border-gray-300 p-6">
          {file ? (
            <p className="text-sm text-gray-700">{file.name}</p>
          ) : (
            <>
              <label
                htmlFor="file-upload"
                className="cursor-pointer text-blue-500 hover:underline"
              >
                Add File
              </label>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
              <p className="mt-2 text-xs text-gray-400">
                Or drag and drop files
              </p>
            </>
          )}
        </div>

        {/* Inputs */}
        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              First Name
            </label>
            <input
              type="text"
              placeholder="Roeurm"
              className="w-full rounded-[20px] border px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300 darkborder-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700  dark:text-gray-300">
              Last Name
            </label>
            <input
              type="text"
              placeholder="Dara"
              className="w-full rounded-[20px] border px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700  dark:text-gray-300">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Roeurm@example.com"
              className="w-full rounded-[20px] border px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700  dark:text-gray-300">
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="+855 123 456 789"
              className="w-full rounded-[20px] border px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 "
            />
          </div>
        </div>
      </div>

      {/* Regional Settings */}
        <div className="mt-8 border-t pt-6">
      <h3 className="text-base font-semibold">Regional Settings</h3>
      <p className="mb-4 text-sm text-gray-500">
        Set your language and timezone
      </p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Language Dropdown */}
        <div className="relative" ref={langRef}>
          <button
            onClick={() => setLangOpen(!langOpen)}
            className="w-full rounded-[20px] border px-3 py-2 text-left focus:outline-none focus:ring focus:ring-blue-300 flex justify-between items-center bg-white dark:bg-gray-700 dark:text-gray-100"
          >
            {language}
            <svg
              className="h-4 w-4 text-gray-500 dark:text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {langOpen && (
            <ul className="absolute mt-1 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-[20px] shadow-lg z-10">
              {languages.map((lang) => (
                <li
                  key={lang}
                  onClick={() => {
                    setLanguage(lang);
                    setLangOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-blue-100 dark:hover:bg-blue-600 cursor-pointer rounded-[20px]"
                >
                  {lang}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Timezone Dropdown */}
        <div className="relative" ref={timeRef}>
          <button
            onClick={() => setTimeOpen(!timeOpen)}
            className="w-full rounded-[20px] border px-3 py-2 text-left focus:outline-none focus:ring focus:ring-blue-300 flex justify-between items-center bg-white dark:bg-gray-700 dark:text-gray-100"
          >
            {timezone}
            <svg
              className="h-4 w-4 text-gray-500 dark:text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {timeOpen && (
            <ul className="absolute mt-1 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-[20px] shadow-lg z-10">
              {timezones.map((tz) => (
                <li
                  key={tz}
                  onClick={() => {
                    setTimezone(tz);
                    setTimeOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-blue-100 dark:hover:bg-blue-600 cursor-pointer rounded-[20px]"
                >
                  {tz}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
      {/* Buttons */}
      <div className="mt-8 flex justify-end gap-4">
        <button className="rounded-[20px] border border-gray-300 px-6 py-2 hover:bg-gray-100">
          Cancel
        </button>
        <button className="rounded-[20px] bg-gradient-to-r from-yellow-400 to-orange-500 px-6 py-2 font-medium text-white shadow hover:opacity-90">
          Save
        </button>
      </div>
    </div>
  );
}
