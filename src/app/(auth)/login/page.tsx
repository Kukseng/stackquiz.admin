/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, FormEvent, Suspense } from "react";
import { signIn, useSession } from "next-auth/react";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FaUser, FaKey } from "react-icons/fa";
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import en from "./locales/en.json";
import kh from "./locales/km.json";
import FormField from "@/components/auth/FormField";

// -------------------- Zod Schema --------------------
const loginSchema = z.object({
  username: z.string().min(3, "Username is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginData = z.infer<typeof loginSchema>;

const LoginFormContent = () => {
  const { language, toggleLanguage } = useLanguage();
  const t = language === "en" ? en.login : kh.login;
  const fontClass = language === "en" ? "en-font" : "kh-font";

  const [formData, setFormData] = useState<LoginData>({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { update } = useSession();
  const searchParams = useSearchParams();
  
  // Get callback URL from query params (where user wanted to go)
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Map NextAuth error codes to user-friendly messages
  const getErrorMessage = (errorCode: string | null | undefined): string => {
    if (!errorCode) return "Login failed";
    
    switch (errorCode) {
      case "CredentialsSignin":
        return "Invalid username or password";
      case "AccessDenied":
        return "Not allowed. Normal users are not allowed to login.";
      case "Configuration":
        return "Server configuration error. Please contact support.";
      case "SessionRequired":
        return "Please sign in to continue.";
      default:
        return errorCode;
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setGeneralError(null);
    setIsLoading(true);

    try {
      // Validate form data
      loginSchema.parse(formData);

      // Attempt login
      const res = await signIn("credentials", {
        redirect: false,
        username: formData.username,
        password: formData.password,
      });

      if (!res || res.error) {
        // Map error code to user-friendly message
        const errorMessage = getErrorMessage(res?.error);
        setGeneralError(errorMessage);
        setIsLoading(false);
        return;
      }

      // Update session
      await update();
      await new Promise((resolve) => setTimeout(resolve, 100));
      
      // Redirect to callback URL (preserves where user wanted to go)
      router.push(callbackUrl);
      router.refresh();
      setIsLoading(false);
    } catch (err: any) {
      setIsLoading(false);
      if (err instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        err.issues.forEach((issue) => {
          newErrors[issue.path[0] as string] = issue.message;
        });
        setErrors(newErrors);
      } else if (err instanceof Error) {
        setGeneralError(err.message);
      } else {
        setGeneralError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 ${fontClass}`}>
      <div className="flex flex-col md:flex-row w-full max-w-6xl rounded-3xl lg:border-8 border-white/70 transition-transform duration-500 shadow-2xl">
        {/* Left Side */}
        <div className="hidden md:flex flex-col items-center justify-center w-1/2 p-6 rounded-l-2xl bg-blue-100 relative overflow-hidden">
          <div className="absolute top-4 left-4 flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/logo-sq.png" alt="Logo" width={40} height={40} className="object-contain" />
              <span className="font-bold text-yellow-500 text-2xl">
                <span className="text-blue-950">STACK</span>QUIZ
              </span>
            </Link>
          </div>
          <div className="mt-8">
            <Image src="/book.png" alt="Login illustration" width={400} height={400} className="object-contain" />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex-1 w-full md:w-1/2 p-4 md:p-6 bg-white rounded-2xl md:rounded-r-2xl md:rounded-l-none">
          <div className="flex justify-end mb-3">
            <button
              onClick={toggleLanguage}
              className="px-3 py-1 border rounded-lg text-sm font-semibold hover:bg-gray-200"
              disabled={isLoading}
            >
              {language === "en" ? "EN" : "ខ្មែរ"}
            </button>
          </div>

          <div className="text-center md:text-left mb-4">
            <h2 className="text-2xl font-extrabold text-gray-800 mb-1">
              {t.title} <span className="text-yellow">{t.in}</span>
            </h2>
            <p className="text-gray-500 text-sm">{t.subtitle}</p>
          </div>

          {generalError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded-xl mb-3 text-center text-sm">
              {generalError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <FormField
              id="username"
              label={t.username}
              type="text"
              value={formData.username}
              placeholder={t.username}
              onChange={handleChange}
              error={errors.username}
              icon={<FaUser className="text-gray-400 h-4 w-4" />}
              autoComplete="username"
            />
            <FormField
              id="password"
              label={t.password}
              type={showPassword ? "text" : "password"}
              value={formData.password}
              placeholder={t.password}
              onChange={handleChange}
              error={errors.password}
              icon={<FaKey className="text-gray-400 h-4 w-4" />}
              toggle={() => setShowPassword(!showPassword)}
              toggleIcon={
                showPassword ? (
                  <HiOutlineEyeOff className="h-4 w-4 text-gray-400 cursor-pointer" />
                ) : (
                  <HiOutlineEye className="h-4 w-4 text-gray-400 cursor-pointer" />
                )
              }
              autoComplete="current-password"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl btn-primary btn-text btn-secondary font-semibold shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Logging in..." : t.loginButton}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// Wrapper component with Suspense boundary
const LoginForm = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    }>
      <LoginFormContent />
    </Suspense>
  );
};

export default LoginForm;