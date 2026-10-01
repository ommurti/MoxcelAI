"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Mail,
  Lock,
  Table2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="min-h-screen bg-[#111312] text-[#F5F3ED]">

      {/* ================= HEADER ================= */}

      <header className="border-b border-[#303733] bg-[#111312]/95">

        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

          <Link href="/" className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2F6B4F]">
              <Table2 size={21} />
            </div>

            <div>

              <div className="text-xl font-bold">
                Moxcel<span className="text-[#F2A07B]">AI</span>
              </div>

              <div className="text-[9px] uppercase tracking-[0.2em] text-[#929A94]">
                Intelligent spreadsheets
              </div>

            </div>

          </Link>


          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-[#929A94] transition hover:text-[#F2A07B]"
          >
            <ArrowLeft size={16} />
            Back to home
          </Link>

        </div>

      </header>


      {/* ================= LOGIN ================= */}

      <section className="relative flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden px-6 py-12">

        {/* Green Glow */}

        <div className="absolute left-1/2 top-[-100px] h-[500px] w-[600px] -translate-x-1/2 rounded-full bg-[#2F6B4F]/15 blur-[120px]" />

        {/* Peach Glow */}

        <div className="absolute bottom-[-150px] right-[-100px] h-[400px] w-[400px] rounded-full bg-[#F2A07B]/8 blur-[120px]" />


        {/* Subtle Grid */}

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


        {/* Login Card */}

        <div className="relative z-10 w-full max-w-md">

          <div className="rounded-2xl border border-[#303733] bg-[#191C1A] p-8 shadow-2xl shadow-black/40 sm:p-10">

            {/* Icon */}

            <div className="flex justify-center">

              <div className="relative">

                <div className="absolute inset-0 rounded-2xl bg-[#F2A07B]/10 blur-xl" />

                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-[#2F6B4F]/50 bg-[#2F6B4F]/15 text-[#A9C7B4]">
                  <Table2 size={27} />
                </div>

              </div>

            </div>


            {/* Heading */}

            <div className="mt-6 text-center">

              <h1 className="text-3xl font-bold tracking-tight">
                Welcome back
              </h1>

              <p className="mt-2 text-sm text-[#929A94]">
                Continue working with your spreadsheets.
              </p>

            </div>


            {/* Form */}

            <form className="mt-8 space-y-5">

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

                <div className="mb-2 flex items-center justify-between">

                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-[#C8CEC9]"
                  >
                    Password
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-xs font-medium text-[#F2A07B] hover:text-[#FFD0B5]"
                  >
                    Forgot password?
                  </Link>

                </div>


                <div className="relative">

                  <Lock
                    size={17}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6F7973]"
                  />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="w-full rounded-lg border border-[#303733] bg-[#111312] py-3.5 pl-10 pr-12 text-sm text-[#F5F3ED] outline-none transition placeholder:text-[#5F6862] focus:border-[#2F6B4F] focus:ring-2 focus:ring-[#2F6B4F]/20"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
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


              {/* Remember */}

              <div className="flex items-center gap-2">

                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 rounded border-[#303733] bg-[#111312] accent-[#2F6B4F]"
                />

                <label
                  htmlFor="remember"
                  className="text-sm text-[#929A94]"
                >
                  Remember me
                </label>

              </div>


              {/* Submit */}

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#2F6B4F] py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#2F6B4F]/10 transition hover:bg-[#3A815D]"
              >
                Sign in to MoxcelAI
              </button>

            </form>


            {/* Divider */}

            <div className="my-7 flex items-center gap-4">

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


            {/* Signup */}

            <p className="mt-7 text-center text-sm text-[#929A94]">

              Don't have an account?{" "}

              <Link
                href="/signup"
                className="font-semibold text-[#F2A07B] transition hover:text-[#FFD0B5]"
              >
                Create account
              </Link>

            </p>

          </div>


          {/* Security */}

          <div className="mt-5 flex items-center justify-center gap-2 text-xs text-[#6F7973]">

            <ShieldCheck size={14} />

            <span>
              Your spreadsheet data stays private and secure.
            </span>

          </div>


          {/* Small AI line */}

          <div className="mt-4 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.15em] text-[#4F5953]">

            <Sparkles size={11} />

            AI-powered spreadsheet workspace

          </div>

        </div>

      </section>

    </main>
  );
}