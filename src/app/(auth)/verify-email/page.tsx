"use client";

import Link from "next/link";
import Image from "next/image";

export default function VerifyEmailPage() {
  return (
    <div className="flex flex-col items-center justify-center p-4 lg:p-14">
      <div className="flex flex-col md:flex-row w-full max-w-5xl rounded-3xl lg:border-8 border-white/70 transition-transform duration-500">
        <div className="hidden md:flex flex-col items-center justify-center w-1/2 p-8 rounded-l-2xl bg-pink-100 relative overflow-hidden">
          <div className="absolute top-4 left-4 flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/logo-sq.png"
                alt="StackQuiz Logo"
                width={40}
                height={40}
                className="object-contain"
              />
              <span className="font-bold text-yellow text-lg">
                <span className="text-blue-950">STACK</span>QUIZ
              </span>
            </Link>
          </div>

          {/* Hero Illustration */}
          <div className="mt-12">
            <Image
              src="/signup.svg" // 
              alt="Verify Email illustration"
              width={400}
              height={400}
              className="object-contain"
            />
          </div>
        </div>

        {/* Right Side (content) */}
        <div className="flex-1 w-full md:w-1/2 p-6 md:px-10 py-10 bg-white rounded-2xl md:rounded-r-2xl md:rounded-l-none flex flex-col justify-center">
          {/* Mobile logo */}
          <div className="flex justify-center items-center space-x-2 mb-6 md:hidden">
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold text-yellow text-2xl">
                <span className="text-blue-950">STACK</span>QUIZ
              </span>
            </Link>
          </div>

          <h2 className="text-2xl font-extrabold text-gray-800 mb-2 text-center md:text-left">
            Verify <span className="text-yellow">Your Email</span>
          </h2>
          <p className="text-gray-600 mt-2 text-center md:text-left leading-relaxed">
            We’ve sent a verification link to your email address. <br />
            Please check your inbox and click the link to activate your account.
          </p>

          {/* Action buttons */}
          <div className="mt-8 flex flex-col space-y-4">
            <Link
              href="/login"
              className="w-full py-3 rounded-xl btn-secondary btn-text font-semibold shadow-lg text-center"
            >
              Back to Login
            </Link>
            <button
              onClick={() => alert("Resend verification email (to implement)")}
              className="w-full py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold shadow-md transition-all duration-300"
            >
              Resend Verification Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
