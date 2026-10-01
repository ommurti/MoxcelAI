"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Table2,
  ShieldCheck,
  Sparkles,
  Check,
} from "lucide-react";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <main className="min-h-screen bg-[#111312] text-[#F5F3ED]">

      {/* ================= HEADER ================= */}

      <header className="border-b border-[#303733] bg-[#111312]/95">

        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

          {/* Logo */}

          <Link href="/" className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2F6B4F]">
              <Table2 size={21} />
            </div>

            <div>

              <div className="text-xl font-bold tracking-tight">
                Moxcel<span className="text-[#F2A07B]">AI</span>
              </div>

              <div className="text-[9px] uppercase tracking-[0.2em] text-[#929A94]">
                Intelligent spreadsheets
              </div>

            </div>

          </Link>


          {/* Back Home */}

          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-[#929A94] transition hover:text-[#F2A07B]"
          >
            <ArrowLeft size={16} />
            Back to home
          </Link>

        </div>

      </header>


      {/* ================= MAIN ================= */}

      <section className="relative flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden px-6 py-12">

        {/* Green Glow */}

        <div className="absolute left-1/2 top-[-120px] h-[500px] w-[650px] -translate-x-1/2 rounded-full bg-[#2F6B4F]/15 blur-[120px]" />

        {/* Peach Glow */}

        <div className="absolute bottom-[-150px] left-[-100px] h-[400px] w-[400px] rounded-full bg-[#F2A07B]/8 blur-[120px]" />


        {/* Spreadsheet Grid */}

        <div className="absolute inset-0 opacity-[0.035]">

          <div
            className="h-full w-full"
            style={{
              backgroundImage: `
                linear-gradient(#F5F3ED 1px, transparent 1px),
                linear-gradient(90deg, #F5F3ED 1px, transparent 1px)
              `,
              backgroundSize: "45px 45px",
            }}
          />

        </div>


        {/* ================= CONTENT ================= */}

        <div className="relative z-10 w-full max-w-5xl">

          <div className="grid items-center gap-12 lg:grid-cols-2">


            {/* ================= LEFT SIDE ================= */}

            <div className="hidden lg:block">

              <div className="max-w-md">

                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-[#F2A07B]/20 bg-[#F2A07B]/10 text-[#F2A07B]">
                  <Sparkles size={22} />
                </div>


                <h1 className="text-4xl font-bold leading-tight tracking-tight">

                  Your spreadsheets,

                  <br />

                  <span className="text-[#F2A07B]">
                    now with intelligence.
                  </span>

                </h1>


                <p className="mt-5 text-sm leading-7 text-[#929A94]">

                  Create your MoxcelAI account and start transforming
                  the way you work with spreadsheets.

                </p>


                {/* Benefits */}

                <div className="mt-8 space-y-4">

                  {[
                    "Generate formulas using natural language",
                    "Clean and transform spreadsheet data",
                    "Get AI-powered insights from your data",
                  ].map((item) => (

                    <div
                      key={item}
                      className="flex items-center gap-3"
                    >

                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#2F6B4F]/20 text-[#A9C7B4]">
                        <Check size={13} />
                      </div>

                      <span className="text-sm text-[#C8CEC9]">
                        {item}
                      </span>

                    </div>

                  ))}

                </div>


                {/* Mini Spreadsheet */}

                <div className="mt-10 overflow-hidden rounded-xl border border-[#303733] bg-[#191C1A]">

                  <div className="flex items-center gap-2 border-b border-[#303733] px-4 py-3">

                    <Table2 size={14} className="text-[#A9C7B4]" />

                    <span className="text-xs font-medium text-[#929A94]">
                      MoxcelAI workspace
                    </span>

                  </div>


                  <div className="grid grid-cols-4 text-[10px]">

                    {[
                      "Product",
                      "Sales",
                      "Profit",
                      "Region",
                      "Laptop",
                      "₹85,000",
                      "₹12,400",
                      "North",
                      "Phone",
                      "₹45,000",
                      "₹8,200",
                      "South",
                    ].map((item, index) => (

                      <div
                        key={index}
                        className={`border-b border-r border-[#303733] px-3 py-2 ${
                          index < 4
                            ? "bg-[#151816] font-medium text-[#929A94]"
                            : "text-[#6F7973]"
                        }`}
                      >
                        {item}
                      </div>

                    ))}

                  </div>


                  <div className="flex items-center gap-2 border-t border-[#303733] bg-[#151816] px-4 py-3">

                    <Sparkles
                      size={13}
                      className="text-[#F2A07B]"
                    />

                    <span className="text-[10px] text-[#929A94]">
                      AI can analyze this data for you
                    </span>

                  </div>

                </div>

              </div>

            </div>


            {/* ================= SIGNUP CARD ================= */}

            <div className="w-full max-w-md lg:ml-auto">

              <div className="rounded-2xl border border-[#303733] bg-[#191C1A] p-8 shadow-2xl shadow-black/40 sm:p-10">


                {/* Mobile Icon */}

                <div className="flex justify-center lg:hidden">

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#2F6B4F]/50 bg-[#2F6B4F]/15 text-[#A9C7B4]">
                    <Table2 size={27} />
                  </div>

                </div>


                {/* Heading */}

                <div className="mt-6 text-center">

                  <h2 className="text-3xl font-bold tracking-tight">
                    Create your account
                  </h2>

                  <p className="mt-2 text-sm text-[#929A94]">
                    Start working smarter with MoxcelAI.
                  </p>

                </div>


                {/* ================= FORM ================= */}

                <form className="mt-8 space-y-4">


                  {/* Full Name */}

                  <div>

                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-medium text-[#C8CEC9]"
                    >
                      Full name
                    </label>

                    <div className="relative">

                      <User
                        size={17}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6F7973]"
                      />

                      <input
                        id="name"
                        type="text"
                        placeholder="Enter your name"
                        className="w-full rounded-lg border border-[#303733] bg-[#111312] py-3.5 pl-10 pr-4 text-sm text-[#F5F3ED] outline-none transition placeholder:text-[#5F6862] focus:border-[#2F6B4F] focus:ring-2 focus:ring-[#2F6B4F]/20"
                      />

                    </div>

                  </div>


                  {/* Email */}

                  <div>

                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium text-[#C8CEC9]"
                    >
                      Email address
                    </label>

                    <div className="relative">

                      <Mail
                        size={17}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6F7973]"
                      />

                      <input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        className="w-full rounded-lg border border-[#303733] bg-[#111312] py-3.5 pl-10 pr-4 text-sm text-[#F5F3ED] outline-none transition placeholder:text-[#5F6862] focus:border-[#2F6B4F] focus:ring-2 focus:ring-[#2F6B4F]/20"
                      />

                    </div>

                  </div>


                  {/* Password */}

                  <div>

                    <label
                      htmlFor="password"
                      className="mb-2 block text-sm font-medium text-[#C8CEC9]"
                    >
                      Password
                    </label>

                    <div className="relative">

                      <Lock
                        size={17}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6F7973]"
                      />

                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        className="w-full rounded-lg border border-[#303733] bg-[#111312] py-3.5 pl-10 pr-12 text-sm text-[#F5F3ED] outline-none transition placeholder:text-[#5F6862] focus:border-[#2F6B4F] focus:ring-2 focus:ring-[#2F6B4F]/20"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(!showPassword)
                        }
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6F7973] transition hover:text-[#F2A07B]"
                      >
                        {showPassword ? (
                          <EyeOff size={17} />
                        ) : (
                          <Eye size={17} />
                        )}
                      </button>

                    </div>

                  </div>


                  {/* Confirm Password */}

                  <div>

                    <label
                      htmlFor="confirmPassword"
                      className="mb-2 block text-sm font-medium text-[#C8CEC9]"
                    >
                      Confirm password
                    </label>

                    <div className="relative">

                      <Lock
                        size={17}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6F7973]"
                      />

                      <input
                        id="confirmPassword"
                        type={
                          showConfirmPassword
                            ? "text"
                            : "password"
                        }
                        placeholder="Confirm your password"
                        className="w-full rounded-lg border border-[#303733] bg-[#111312] py-3.5 pl-10 pr-12 text-sm text-[#F5F3ED] outline-none transition placeholder:text-[#5F6862] focus:border-[#2F6B4F] focus:ring-2 focus:ring-[#2F6B4F]/20"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(
                            !showConfirmPassword
                          )
                        }
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6F7973] transition hover:text-[#F2A07B]"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={17} />
                        ) : (
                          <Eye size={17} />
                        )}
                      </button>

                    </div>

                  </div>


                  {/* Terms */}

                  <div className="flex items-start gap-3 pt-1">

                    <input
                      id="terms"
                      type="checkbox"
                      className="mt-0.5 h-4 w-4 shrink-0 rounded border-[#303733] bg-[#111312] accent-[#2F6B4F]"
                    />

                    <label
                      htmlFor="terms"
                      className="text-xs leading-5 text-[#929A94]"
                    >
                      I agree to the{" "}

                      <Link
                        href="/terms"
                        className="text-[#F2A07B] hover:text-[#FFD0B5]"
                      >
                        Terms of Service
                      </Link>

                      {" "}and{" "}

                      <Link
                        href="/privacy"
                        className="text-[#F2A07B] hover:text-[#FFD0B5]"
                      >
                        Privacy Policy
                      </Link>
                      .
                    </label>

                  </div>


                  {/* Create Account */}

                  <button
                    type="submit"
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-[#2F6B4F] py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#2F6B4F]/10 transition hover:bg-[#3A815D]"
                  >
                    Create MoxcelAI account
                  </button>

                </form>


                {/* Divider */}

                <div className="my-6 flex items-center gap-4">

                  <div className="h-px flex-1 bg-[#303733]" />

                  <span className="text-[10px] font-medium text-[#6F7973]">
                    OR
                  </span>

                  <div className="h-px flex-1 bg-[#303733]" />

                </div>


                {/* Google */}

                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-3 rounded-lg border border-[#303733] bg-[#111312] py-3 text-sm font-medium text-[#C8CEC9] transition hover:border-[#4A544F] hover:bg-[#202522]"
                >

                  <span className="font-bold text-[#F2A07B]">
                    G
                  </span>

                  Continue with Google

                </button>


                {/* Login */}

                <p className="mt-7 text-center text-sm text-[#929A94]">

                  Already have an account?{" "}

                  <Link
                    href="/login"
                    className="font-semibold text-[#F2A07B] transition hover:text-[#FFD0B5]"
                  >
                    Sign in
                  </Link>

                </p>

              </div>


              {/* Security */}

              <div className="mt-5 flex items-center justify-center gap-2 text-xs text-[#6F7973]">

                <ShieldCheck size={14} />

                <span>
                  Your account and spreadsheet data stay private.
                </span>

              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}