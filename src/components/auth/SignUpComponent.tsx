/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";

import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import FormField from "./FormField";
import { FaUser, FaEnvelope, FaKey } from "react-icons/fa";
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import Image from "next/image";
import { useRegisterMutation } from "@/lib/api/authApi";
import { useLanguage } from "@/context/LanguageContext";
import en from "@/locales/en.json";
import kh from "@/locales/km.json";

// -------------------- Zod Schema --------------------
const signupSchema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Password confirmation is required"),
    firstName: z.string().min(2, "First name is too short"),
    lastName: z.string().min(2, "Last name is too short"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof signupSchema>;

const SignupForm = () => {
  const { language, toggleLanguage } = useLanguage();
  const t = language === "en" ? en.signup : kh.signup;
  const fontClass = language === "en" ? "en-font" : "kh-font";

  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();
  const [register, { isLoading }] = useRegisterMutation();

  // Handle field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle form submit
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setGeneralError(null);

    try {
      signupSchema.parse(formData);

      const response = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirmedPassword: formData.confirmPassword, // API expects "confirmedPassword"
        firstName: formData.firstName,
        lastName: formData.lastName,
      }).unwrap();

      console.log("Registration successful:", response);
      router.push("/verify-email"); // redirect on success
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        // Handle validation errors
        const newErrors: Record<string, string> = {};
        err.issues.forEach((issue) => {
          newErrors[issue.path[0] as string] = issue.message;
        });
        setErrors(newErrors);
      } else if (err?.data?.error || err?.data?.message) {
        // Handle API errors
        setGeneralError(err.data.error || err.data.message);
      } else if (err instanceof Error) {
        setGeneralError(err.message);
      } else {
        setGeneralError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center p-4 ${fontClass}`}
    >
      <div className="flex flex-col md:flex-row w-full max-w-6xl rounded-3xl lg:border-8 border-white/70 transition-transform duration-500 shadow-2xl">
        {/* Left Side (desktop only) */}
        <div className="hidden md:flex flex-col items-center justify-center w-1/2 p-6 rounded-l-2xl bg-pink-100 relative overflow-hidden">
          {/* Logo */}
          <div className="absolute top-4 left-4 flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/logo-sq.png"
                alt="Signup illustration"
                width={40}
                height={40}
                className="object-contain"
              />
              <span className="font-bold text-yellow-500 text-2xl">
                <span className="text-blue-950">STACK</span>QUIZ
              </span>
            </Link>
          </div>

          {/* Hero Image */}
          <div className="mt-8">
            <Image
              src="/signup.png"
              alt="Signup illustration"
              width={400}
              height={400}
              className="object-contain"
            />
          </div>
        </div>

        {/* Right Side (form) */}
        <div className="flex-1 w-full md:w-1/2 p-4 md:p-6 bg-white rounded-2xl md:rounded-r-2xl md:rounded-l-none">
          {/* Switch Language */}
          <div className="flex justify-end mb-3">
            <button
              onClick={toggleLanguage}
              className="px-3 py-1 border rounded-lg text-sm font-semibold hover:bg-gray-200"
            >
              {language === "en" ? "EN" : "ខ្មែរ"}
            </button>
          </div>
          {/* Mobile logo */}
          <div className="flex justify-center items-center space-x-2 mb-3 md:hidden">
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold text-yellow text-2xl">
                <span className="text-blue-950">STACK</span>QUIZ
              </span>
            </Link>
          </div>
          <div className="text-center md:text-left mb-4">
            <h2 className="text-2xl font-extrabold text-gray-800 mb-1">
              {t.title} <span className="text-yellow">{t.up}</span>
            </h2>
            <p className="text-gray-500 text-sm">{t.subtitle}</p>
          </div>
          {generalError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded-xl mb-3 text-center text-sm">
              {generalError}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Name fields in two columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField
                id="firstName"
                label={t.firstName}
                type="text"
                value={formData.firstName}
                placeholder={t.firstName}
                onChange={handleChange}
                error={errors.firstName}
                icon={<FaUser className="text-gray-400 h-4 w-4" />}
              />
              <FormField
                id="lastName"
                label={t.lastName}
                type="text"
                value={formData.lastName}
                placeholder={t.lastName}
                onChange={handleChange}
                error={errors.lastName}
                icon={<FaUser className="text-gray-400 h-4 w-4" />}
              />
            </div>

            {/* Username and Email in two columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField
                id="username"
                label={t.username}
                type="text"
                value={formData.username}
                placeholder={t.username}
                onChange={handleChange}
                error={errors.username}
                icon={<FaUser className="text-gray-400 h-4 w-4" />}
              />
              <FormField
                id="email"
                label={t.email}
                type="email"
                value={formData.email}
                placeholder={t.email}
                onChange={handleChange}
                error={errors.email}
                icon={<FaEnvelope className="text-gray-400 h-4 w-4" />}
              />
            </div>

            {/* Password fields in two columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              />
              <FormField
                id="confirmPassword"
                label={t.confirmPassword}
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                placeholder={t.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                icon={<FaKey className="text-gray-400 h-4 w-4" />}
                toggle={() => setShowConfirmPassword(!showConfirmPassword)}
                toggleIcon={
                  showConfirmPassword ? (
                    <HiOutlineEyeOff className="h-4 w-4 text-gray-400 cursor-pointer" />
                  ) : (
                    <HiOutlineEye className="h-4 w-4 text-gray-400 cursor-pointer" />
                  )
                }
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl btn-secondary btn-text font-semibold shadow-lg transition-all duration-300"
            >
              {isLoading ? t.loading : t.createAccount}
            </button>
          </form>
          {/* Social login */}
          <div className="text-center my-3">
            <span className="text-gray-500 text-sm">{t.or}</span>
          </div>
          <div className="flex justify-center space-x-2">
            <button
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="transition-transform duration-200 hover:scale-110"
            >
              <Image
                src="/social_media_icon/google.svg"
                alt="Google Icon"
                width={40}
                height={40}
              />
            </button>
            <button
              onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
              className="transition-transform duration-200 hover:scale-110"
            >
              <Image
                src="/social_media_icon/github.svg"
                alt="GitHub Icon"
                width={36}
                height={36}
              />
            </button>
            <button
              onClick={() => signIn("facebook", { callbackUrl: "/dashboard" })}
              className="transition-transform duration-200 hover:scale-110"
            >
              <Image
                src="/social_media_icon/fb.svg"
                alt="GitHub Icon"
                width={36}
                height={36}
              />
            </button>
          </div>
          <p className="text-center text-gray-500 mt-3 text-sm">
            {t.already}{" "}
            <Link
              href="/login"
              className="text-indigo-600 font-semibold hover:underline"
            >
              {t.login}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default SignupForm;
