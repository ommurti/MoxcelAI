"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Bot,
  Check,
  ChevronRight,
  FileSpreadsheet,
  Lightbulb,
  Menu,
  Play,
  Sparkles,
  Table2,
  Upload,
  WandSparkles,
  X,
  Zap,
} from "lucide-react";

export default function Home() {
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <main className="min-h-screen overflow-hidden bg-[#111312] text-[#F5F3ED]">

      {/* ================= NAVBAR ================= */}

      <header className="sticky top-0 z-50 border-b border-[#303733]/70 bg-[#111312]/90 backdrop-blur-xl">

        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

          {/* Logo */}

          <Link href="/" className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2F6B4F] shadow-lg shadow-[#2F6B4F]/20">
              <Table2 size={21} strokeWidth={2} />
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


          {/* Desktop Navigation */}

          <nav className="hidden items-center gap-8 md:flex">

            <a
              href="#features"
              className="text-sm text-[#929A94] transition hover:text-[#F5F3ED]"
            >
              Features
            </a>

            <a
              href="#how-it-works"
              className="text-sm text-[#929A94] transition hover:text-[#F5F3ED]"
            >
              How it works
            </a>

            <a
              href="#preview"
              className="text-sm text-[#929A94] transition hover:text-[#F5F3ED]"
            >
              Preview
            </a>

          </nav>


          {/* Desktop Actions */}

          <div className="hidden items-center gap-3 md:flex">

            <Link
              href="/login"
              className="rounded-lg px-4 py-2.5 text-sm font-medium text-[#C8CEC9] transition hover:text-white"
            >
              Log in
            </Link>

            <Link
              href="/signup"
              className="flex items-center gap-2 rounded-lg bg-[#2F6B4F] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#3A815D]"
            >
              Get started
              <ArrowRight size={15} />
            </Link>

          </div>


          {/* Mobile Menu */}

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-lg border border-[#303733] p-2 text-[#C8CEC9] md:hidden"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

        </div>


        {/* Mobile Navigation */}

        {menuOpen && (

          <div className="border-t border-[#303733] bg-[#111312] px-6 py-5 md:hidden">

            <div className="flex flex-col gap-4">

              <a href="#features" className="text-[#C8CEC9]">
                Features
              </a>

              <a href="#how-it-works" className="text-[#C8CEC9]">
                How it works
              </a>

              <a href="#preview" className="text-[#C8CEC9]">
                Preview
              </a>

              <Link href="/login" className="text-[#C8CEC9]">
                Log in
              </Link>

              <Link
                href="/signup"
                className="rounded-lg bg-[#2F6B4F] px-4 py-3 text-center font-semibold"
              >
                Get started
              </Link>

            </div>

          </div>

        )}

      </header>


      {/* ================= HERO ================= */}

      <section className="relative">

        {/* Green glow */}

        <div className="absolute left-1/2 top-[-200px] h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-[#2F6B4F]/15 blur-[120px]" />

        {/* Peach glow */}

        <div className="absolute right-[-150px] top-[300px] h-[350px] w-[350px] rounded-full bg-[#F2A07B]/8 blur-[120px]" />


        <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-24 lg:pb-32 lg:pt-32">

          {/* Badge */}

          <div className="mb-8 flex justify-center">

            <div className="flex items-center gap-2 rounded-full border border-[#2F6B4F]/50 bg-[#2F6B4F]/10 px-4 py-2 text-xs font-medium text-[#A9C7B4]">

              <Sparkles size={14} className="text-[#F2A07B]" />

              AI-powered spreadsheet workspace

            </div>

          </div>


          {/* Heading */}

          <div className="mx-auto max-w-4xl text-center">

            <h1 className="text-5xl font-bold leading-[1.05] tracking-[-0.04em] sm:text-6xl lg:text-7xl">

              Your spreadsheet.

              <br />

              <span className="text-[#F2A07B]">
                Smarter with AI.
              </span>

            </h1>


            <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-[#929A94] sm:text-lg">

              Upload your spreadsheet, describe what you want,
              and let MoxcelAI handle the formulas, data,
              analysis and insights.

            </p>


            {/* CTA */}

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">

              <Link
                href="/signup"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#2F6B4F] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#2F6B4F]/20 transition hover:bg-[#3A815D] sm:w-auto"
              >
                Start with MoxcelAI
                <ArrowRight size={17} />
              </Link>


              <a
                href="#preview"
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#303733] bg-[#191C1A] px-6 py-3.5 text-sm font-semibold text-[#D4D8D4] transition hover:border-[#4A544F] hover:bg-[#202522] sm:w-auto"
              >
                <Play size={15} />
                See how it works
              </a>

            </div>

          </div>


          {/* ================= AI COMMAND ================= */}

          <div className="relative mx-auto mt-20 max-w-4xl">

            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#2F6B4F]/20 via-[#F2A07B]/10 to-[#2F6B4F]/20 blur-xl" />

            <div className="relative rounded-2xl border border-[#303733] bg-[#191C1A] p-3 shadow-2xl shadow-black/30">

              <div className="flex items-center gap-3 rounded-xl border border-[#303733] bg-[#111312] px-4 py-4">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#2F6B4F]/15 text-[#F2A07B]">
                  <WandSparkles size={18} />
                </div>

                <div className="flex-1 text-sm text-[#929A94]">

                  <span className="hidden sm:inline">
                    Ask MoxcelAI anything about your spreadsheet...
                  </span>

                  <span className="sm:hidden">
                    Ask MoxcelAI...
                  </span>

                </div>

                <button className="rounded-lg bg-[#2F6B4F] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#3A815D]">
                  Run
                </button>

              </div>


              {/* Example commands */}

              <div className="flex flex-wrap gap-2 px-2 pb-1 pt-3">

                {[
                  "Calculate total revenue",
                  "Find duplicate rows",
                  "Create a profit summary",
                ].map((item) => (

                  <button
                    key={item}
                    className="rounded-md border border-[#303733] px-3 py-1.5 text-[11px] text-[#929A94] transition hover:border-[#F2A07B]/40 hover:text-[#F2A07B]"
                  >
                    {item}
                  </button>

                ))}

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ================= SPREADSHEET PREVIEW ================= */}

      <section id="preview" className="relative px-6 pb-28">

        <div className="mx-auto max-w-6xl">

          <div className="mb-8 text-center">

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#F2A07B]">
              Your workspace
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              A spreadsheet with intelligence built in.
            </h2>

          </div>


          {/* Spreadsheet */}

          <div className="overflow-hidden rounded-2xl border border-[#303733] bg-[#191C1A] shadow-2xl shadow-black/30">

            {/* Toolbar */}

            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#303733] px-5 py-4">

              <div className="flex items-center gap-3">

                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#2F6B4F]">
                  <FileSpreadsheet size={16} />
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    Sales_Report.xlsx
                  </p>

                  <p className="text-[10px] text-[#929A94]">
                    Last edited just now
                  </p>
                </div>

              </div>


              <div className="flex items-center gap-2">

                <button className="rounded-md border border-[#303733] p-2 text-[#929A94] hover:text-white">
                  <Upload size={15} />
                </button>

                <button className="flex items-center gap-2 rounded-md bg-[#2F6B4F] px-3 py-2 text-xs font-semibold">
                  <Sparkles size={13} />
                  Ask AI
                </button>

              </div>

            </div>


            {/* Formula bar */}

            <div className="flex items-center gap-3 border-b border-[#303733] bg-[#111312] px-4 py-3">

              <span className="text-xs font-semibold text-[#F2A07B]">
                fx
              </span>

              <div className="h-7 flex-1 rounded border border-[#303733] px-3 py-1.5 text-xs text-[#C8CEC9]">
                =SUM(B2:B8)
              </div>

            </div>


            {/* Table */}

            <div className="overflow-x-auto">

              <table className="w-full min-w-[650px] border-collapse text-left text-xs">

                <thead>

                  <tr className="bg-[#151816] text-[#929A94]">

                    <th className="w-12 border-b border-r border-[#303733] px-4 py-3">
                      #
                    </th>

                    <th className="border-b border-r border-[#303733] px-4 py-3">
                      Product
                    </th>

                    <th className="border-b border-r border-[#303733] px-4 py-3">
                      Sales
                    </th>

                    <th className="border-b border-r border-[#303733] px-4 py-3">
                      Profit
                    </th>

                    <th className="border-b border-[#303733] px-4 py-3">
                      Region
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {[
                    ["1", "Laptop", "₹85,000", "₹12,400", "North"],
                    ["2", "Smartphone", "₹45,000", "₹8,200", "South"],
                    ["3", "Monitor", "₹32,000", "₹6,700", "East"],
                    ["4", "Keyboard", "₹12,000", "₹3,100", "West"],
                    ["5", "Headphones", "₹18,500", "₹4,250", "North"],
                  ].map((row, index) => (

                    <tr
                      key={index}
                      className="transition hover:bg-[#202522]"
                    >

                      {row.map((cell, cellIndex) => (

                        <td
                          key={cellIndex}
                          className={`border-b border-r border-[#303733] px-4 py-3.5 ${
                            cellIndex === 2
                              ? "text-[#A9C7B4]"
                              : cellIndex === 3
                              ? "text-[#F2A07B]"
                              : "text-[#C8CEC9]"
                          }`}
                        >
                          {cell}
                        </td>

                      ))}

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>


            {/* AI Result */}

            <div className="border-t border-[#303733] bg-[#151816] px-5 py-4">

              <div className="flex gap-3">

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F2A07B]/10 text-[#F2A07B]">
                  <Bot size={17} />
                </div>

                <div>

                  <p className="text-xs font-semibold text-[#F2A07B]">
                    MoxcelAI insight
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#929A94]">
                    Profit margin is highest in the North region.
                    I also detected 2 products with unusually high
                    sales growth.
                  </p>

                </div>

              </div>

            </div>


            {/* Sheet tabs */}

            <div className="flex items-center gap-1 border-t border-[#303733] bg-[#111312] px-3 py-2">

              <button className="rounded-md bg-[#2F6B4F]/20 px-4 py-2 text-[11px] font-medium text-[#A9C7B4]">
                Sales
              </button>

              <button className="rounded-md px-4 py-2 text-[11px] text-[#929A94] hover:bg-[#191C1A]">
                Summary
              </button>

              <button className="rounded-md px-4 py-2 text-[11px] text-[#929A94] hover:bg-[#191C1A]">
                Analysis
              </button>

            </div>

          </div>

        </div>

      </section>


      {/* ================= FEATURES ================= */}

      <section id="features" className="border-y border-[#303733] bg-[#151816] px-6 py-24">

        <div className="mx-auto max-w-7xl">

          <div className="max-w-2xl">

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#F2A07B]">
              What MoxcelAI does
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Stop fighting with spreadsheets.
            </h2>

            <p className="mt-4 text-[#929A94]">
              Let AI handle the repetitive work while you focus on
              understanding your data.
            </p>

          </div>


          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">

            {[
              {
                icon: WandSparkles,
                title: "AI formulas",
                text: "Describe the calculation you need and let AI create the formula.",
              },
              {
                icon: Table2,
                title: "Data cleaning",
                text: "Find duplicates, missing values and inconsistent data automatically.",
              },
              {
                icon: BarChart3,
                title: "Smart analysis",
                text: "Turn raw spreadsheet data into useful summaries and analysis.",
              },
              {
                icon: Lightbulb,
                title: "AI insights",
                text: "Discover trends and patterns hidden inside your spreadsheet.",
              },
            ].map((feature) => {

              const Icon = feature.icon;

              return (

                <div
                  key={feature.title}
                  className="group rounded-2xl border border-[#303733] bg-[#191C1A] p-6 transition hover:-translate-y-1 hover:border-[#F2A07B]/30"
                >

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#2F6B4F]/15 text-[#A9C7B4] transition group-hover:bg-[#F2A07B]/10 group-hover:text-[#F2A07B]">
                    <Icon size={21} />
                  </div>

                  <h3 className="mt-5 font-semibold">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[#929A94]">
                    {feature.text}
                  </p>

                </div>

              );

            })}

          </div>

        </div>

      </section>


      {/* ================= HOW IT WORKS ================= */}

      <section id="how-it-works" className="px-6 py-24">

        <div className="mx-auto max-w-7xl">

          <div className="text-center">

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#F2A07B]">
              Simple workflow
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              From spreadsheet to insight.
            </h2>

          </div>


          <div className="mt-14 grid gap-5 md:grid-cols-4">

            {[
              {
                number: "01",
                icon: Upload,
                title: "Upload",
                text: "Drop your Excel file into MoxcelAI.",
              },
              {
                number: "02",
                icon: WandSparkles,
                title: "Describe",
                text: "Tell AI what you want in natural language.",
              },
              {
                number: "03",
                icon: Zap,
                title: "Process",
                text: "MoxcelAI works with your spreadsheet.",
              },
              {
                number: "04",
                icon: Lightbulb,
                title: "Understand",
                text: "Get formulas, results and useful insights.",
              },
            ].map((step) => {

              const Icon = step.icon;

              return (

                <div
                  key={step.number}
                  className="relative rounded-2xl border border-[#303733] bg-[#191C1A] p-6"
                >

                  <span className="text-xs font-bold text-[#F2A07B]">
                    {step.number}
                  </span>

                  <div className="mt-6 flex h-10 w-10 items-center justify-center rounded-lg bg-[#2F6B4F]/15 text-[#A9C7B4]">
                    <Icon size={19} />
                  </div>

                  <h3 className="mt-5 font-semibold">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[#929A94]">
                    {step.text}
                  </p>

                </div>

              );

            })}

          </div>

        </div>

      </section>


      {/* ================= CTA ================= */}

      <section className="px-6 pb-24">

        <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-[#303733] bg-[#191C1A]">

          <div className="relative px-6 py-16 text-center sm:px-12">

            <div className="absolute left-1/2 top-0 h-48 w-96 -translate-x-1/2 rounded-full bg-[#2F6B4F]/15 blur-3xl" />

            <div className="relative">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#F2A07B]/10 text-[#F2A07B]">
                <Sparkles size={22} />
              </div>

              <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
                Give your spreadsheets
                <br />
                a smarter workflow.
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-[#929A94]">
                Upload your first spreadsheet and experience a
                faster way to work with data.
              </p>

              <Link
                href="/signup"
                className="mx-auto mt-8 flex w-fit items-center gap-2 rounded-lg bg-[#2F6B4F] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#3A815D]"
              >
                Get started with MoxcelAI
                <ArrowRight size={16} />
              </Link>

            </div>

          </div>

        </div>

      </section>


      {/* ================= FOOTER ================= */}

      <footer className="border-t border-[#303733] px-6 py-8">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">

          <div className="flex items-center gap-2">

            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#2F6B4F]">
              <Table2 size={14} />
            </div>

            <span className="text-sm font-semibold">
              Moxcel<span className="text-[#F2A07B]">AI</span>
            </span>

          </div>

          <p className="text-xs text-[#6F7973]">
            AI-powered spreadsheet workspace
          </p>

        </div>

      </footer>

    </main>
  );
}