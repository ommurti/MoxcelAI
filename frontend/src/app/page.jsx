"use client";

import React from "react";
import Link from "next/link";
import {
ArrowRight,
BarChart3,
Bot,
Calculator,
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

const tools = [
{
number: "01",
title: "AI Chatbot",
category: "AI ASSISTANT",
description:
"Chat with your spreadsheet using natural language. Ask questions, understand your data, and discover useful insights without manually analyzing rows and columns.",
features: ["Ask questions", "Data insights"],
href: "/chatbot",
buttonText: "Open AI Chatbot",
icon: Bot,
accent: "#F2A07B",
iconBg: "rgba(242, 160, 123, 0.10)",
borderHover: "hover:border-[#F2A07B]/50",
},
{
number: "02",
title: "Formula Generator",
category: "SMART FORMULAS",
description:
"Describe a calculation in simple language and generate Excel formulas for totals, averages, conditions, lookups, and other spreadsheet operations.",
features: ["AI formulas", "Smart calculations"],
href: "/formula",
buttonText: "Generate a formula",
icon: Calculator,
accent: "#8AC7A0",
iconBg: "rgba(138, 199, 160, 0.10)",
borderHover: "hover:border-[#8AC7A0]/50",
},
{
number: "03",
title: "Data Manipulation",
category: "DATA WORKSPACE",
description:
"Clean and organize spreadsheet data. Remove duplicate records, sort and filter information, and transform messy datasets into structured data.",
features: ["Data cleaning", "Transformation"],
href: "/manipulation",
buttonText: "Manipulate data",
icon: WandSparkles,
accent: "#B6A1F8",
iconBg: "rgba(182, 161, 248, 0.10)",
borderHover: "hover:border-[#B6A1F8]/50",
},
];

return ( <main className="min-h-screen overflow-hidden bg-[#111312] text-[#F5F3ED]">
{/* ================= NAVBAR ================= */}

```
  <header className="sticky top-0 z-50 border-b border-[#303733]/70 bg-[#111312]/90 backdrop-blur-xl">
    <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
      {/* Logo */}

      <Link href="/" className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2F6B4F] shadow-lg shadow-[#2F6B4F]/20">
          <Table2 size={21} strokeWidth={2} />
        </div>

        <div>
          <div className="text-xl font-bold tracking-tight">
            Moxel<span className="text-[#F2A07B]">AI</span>
          </div>

          <div className="text-[9px] uppercase tracking-[0.2em] text-[#929A94]">
            Intelligent spreadsheets
          </div>
        </div>
      </Link>

      {/* Desktop Navigation */}

      <nav className="hidden items-center gap-7 md:flex">
        <a
          href="#tools"
          className="text-sm text-[#929A94] transition hover:text-[#F5F3ED]"
        >
          Tools
        </a>

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
        type="button"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        className="rounded-lg border border-[#303733] p-2 text-[#C8CEC9] md:hidden"
      >
        {menuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
    </div>

    {/* Mobile Navigation */}

    {menuOpen && (
      <div className="border-t border-[#303733] bg-[#111312] px-6 py-5 md:hidden">
        <div className="flex flex-col gap-4">
          <a
            href="#tools"
            onClick={() => setMenuOpen(false)}
            className="text-[#C8CEC9]"
          >
            Tools
          </a>

          <a
            href="#features"
            onClick={() => setMenuOpen(false)}
            className="text-[#C8CEC9]"
          >
            Features
          </a>

          <a
            href="#how-it-works"
            onClick={() => setMenuOpen(false)}
            className="text-[#C8CEC9]"
          >
            How it works
          </a>

          <a
            href="#preview"
            onClick={() => setMenuOpen(false)}
            className="text-[#C8CEC9]"
          >
            Preview
          </a>

          <Link
            href="/login"
            onClick={() => setMenuOpen(false)}
            className="text-[#C8CEC9]"
          >
            Log in
          </Link>

          <Link
            href="/signup"
            onClick={() => setMenuOpen(false)}
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

    <div className="absolute right-[-150px] top-[300px] h-[350px] w-[350px] rounded-full bg-[#F2A07B]/[0.08] blur-[120px]" />

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
          <span className="text-[#F2A07B]">Smarter with AI.</span>
        </h1>

        <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-[#929A94] sm:text-lg">
          Upload your spreadsheet, describe what you want, and let
          MoxelAI handle the formulas, data, analysis and insights.
        </p>

        {/* CTA */}

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/signup"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#2F6B4F] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#2F6B4F]/20 transition hover:bg-[#3A815D] sm:w-auto"
          >
            Start with MoxelAI
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
                Ask MoxelAI anything about your spreadsheet...
              </span>

              <span className="sm:hidden">Ask MoxelAI...</span>
            </div>

            <Link
              href="/chat"
              className="rounded-lg bg-[#2F6B4F] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#3A815D]"
            >
              Run
            </Link>
          </div>

          {/* Example commands */}

          <div className="flex flex-wrap gap-2 px-2 pb-1 pt-3">
            {[
              "Calculate total revenue",
              "Find duplicate rows",
              "Create a profit summary",
            ].map((item) => (
              <Link
                key={item}
                href="/chat"
                className="rounded-md border border-[#303733] px-3 py-1.5 text-[11px] text-[#929A94] transition hover:border-[#F2A07B]/40 hover:text-[#F2A07B]"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>

  {/* ================= TOOLS SECTION ================= */}

  <section
    id="tools"
    className="relative scroll-mt-24 overflow-hidden border-y border-[#303733] bg-[#151816] px-6 py-20 sm:py-24"
  >
    {/* Background decoration */}

    <div className="pointer-events-none absolute -left-40 top-20 h-72 w-72 rounded-full bg-[#2F6B4F]/10 blur-[110px]" />

    <div className="pointer-events-none absolute -right-40 bottom-0 h-72 w-72 rounded-full bg-[#F2A07B]/[0.06] blur-[110px]" />

    <div className="relative mx-auto max-w-7xl">
      {/* Section heading */}

      <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div className="max-w-2xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#2F6B4F]/40 bg-[#2F6B4F]/10 px-3 py-1.5 text-xs font-medium tracking-wide text-[#A9C7B4]">
            <Sparkles size={13} className="text-[#F2A07B]" />
            YOUR AI WORKSPACE
          </div>

          <h2 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            Everything you need.
            <br />
            <span className="text-[#929A94]">
              One smarter workspace.
            </span>
          </h2>

          <p className="mt-5 max-w-xl text-sm leading-7 text-[#929A94] sm:text-base">
            From generating formulas to cleaning datasets and chatting
            with your data, explore tools designed to make spreadsheet
            work simpler, faster, and more intelligent.
          </p>
        </div>

        <Link
          href="/tools"
          className="inline-flex w-fit shrink-0 items-center gap-2 rounded-lg border border-[#303733] px-5 py-3 text-sm font-semibold text-[#F5F3ED] transition hover:border-[#2F6B4F] hover:bg-[#2F6B4F]/10"
        >
          Explore all tools
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Three independent tool cards */}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {tools.map((tool) => {
          const Icon = tool.icon;

          return (
            <article
              key={tool.number}
              className={`group relative flex flex-col overflow-hidden rounded-2xl border border-[#303733] bg-[#191C1A] p-6 transition duration-300 hover:-translate-y-1 ${tool.borderHover} sm:p-7`}
            >
              {/* Top accent */}

              <div
                className="absolute left-0 top-0 h-[2px] w-0 transition-all duration-500 group-hover:w-full"
                style={{ backgroundColor: tool.accent }}
              />

              {/* Card header */}

              <div className="flex items-start justify-between">
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-2xl border"
                  style={{
                    color: tool.accent,
                    backgroundColor: tool.iconBg,
                    borderColor: `${tool.accent}35`,
                  }}
                >
                  <Icon size={26} strokeWidth={1.7} />
                </div>

                <span className="font-mono text-xs text-[#68716B]">
                  {tool.number} / 03
                </span>
              </div>

              {/* Card content */}

              <div className="mt-7">
                <p
                  className="text-[10px] font-semibold tracking-[0.2em]"
                  style={{ color: tool.accent }}
                >
                  {tool.category}
                </p>

                <h3 className="mt-2 text-2xl font-semibold tracking-tight text-[#F5F3ED]">
                  {tool.title}
                </h3>

                <p className="mt-3 min-h-[112px] text-sm leading-7 text-[#929A94]">
                  {tool.description}
                </p>
              </div>

              {/* Feature tags */}

              <div className="mt-5 flex flex-wrap gap-2">
                {tool.features.map((feature) => (
                  <span
                    key={feature}
                    className="rounded-full border border-[#303733] bg-[#111312] px-3 py-1.5 text-xs text-[#C8CEC9]"
                  >
                    {feature}
                  </span>
                ))}
              </div>

              {/* Card button */}

              <div className="mt-7 border-t border-[#303733] pt-5">
                <Link
                  href={tool.href}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-semibold transition"
                  style={{
                    color: tool.accent,
                    borderColor: `${tool.accent}45`,
                    backgroundColor: tool.iconBg,
                  }}
                >
                  {tool.buttonText}
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      {/* Bottom note */}

      <div className="mt-8 flex flex-col items-start gap-3 rounded-xl border border-[#303733] bg-[#111312]/70 px-5 py-4 sm:flex-row sm:items-center">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#2F6B4F]/15 text-[#8AC7A0]">
          <Zap size={18} />
        </div>

        <div>
          <p className="text-sm font-medium text-[#F5F3ED]">
            One workspace. Three powerful tools.
          </p>

          <p className="mt-1 text-xs leading-6 text-[#929A94]">
            Choose the tool that fits your task and simplify your
            spreadsheet workflow.
          </p>
        </div>
      </div>
    </div>
  </section>

  {/* ================= SPREADSHEET PREVIEW ================= */}

  <section id="preview" className="relative scroll-mt-24 px-6 pb-28 pt-20">
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
              <p className="text-sm font-semibold">Sales_Report.xlsx</p>

              <p className="text-[10px] text-[#929A94]">
                Last edited just now
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/formula"
              aria-label="Open Formula Generator"
              className="rounded-md border border-[#303733] p-2 text-[#929A94] transition hover:text-white"
            >
              <Upload size={15} />
            </Link>

            <Link
              href="/chat"
              className="flex items-center gap-2 rounded-md bg-[#2F6B4F] px-3 py-2 text-xs font-semibold transition hover:bg-[#3A815D]"
            >
              <Sparkles size={13} />
              Ask AI
            </Link>
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
                MoxelAI insight
              </p>

              <p className="mt-1 text-xs leading-5 text-[#929A94]">
                Profit margin is highest in the North region. I also
                detected 2 products with unusually high sales growth.
              </p>
            </div>
          </div>
        </div>

        {/* Sheet tabs */}

        <div className="flex items-center gap-1 border-t border-[#303733] bg-[#111312] px-3 py-2">
          <button className="rounded-md bg-[#2F6B4F]/20 px-4 py-2 text-[11px] font-medium text-[#A9C7B4]">
            Sales
          </button>

          <button className="rounded-md px-4 py-2 text-[11px] text-[#929A94] transition hover:bg-[#191C1A]">
            Summary
          </button>

          <button className="rounded-md px-4 py-2 text-[11px] text-[#929A94] transition hover:bg-[#191C1A]">
            Analysis
          </button>
        </div>
      </div>
    </div>
  </section>

  {/* ================= FEATURES ================= */}

  <section
    id="features"
    className="scroll-mt-24 border-y border-[#303733] bg-[#151816] px-6 py-24"
  >
    <div className="mx-auto max-w-7xl">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#F2A07B]">
          What MoxelAI does
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

              <h3 className="mt-5 font-semibold">{feature.title}</h3>

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

  <section
    id="how-it-works"
    className="scroll-mt-24 px-6 py-24"
  >
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
            text: "Upload your Excel file into MoxelAI.",
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
            text: "Choose a tool to work with your spreadsheet.",
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

              <h3 className="mt-5 font-semibold">{step.title}</h3>

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
            Upload your first spreadsheet and experience a faster way to
            work with data.
          </p>

          <Link
            href="/signup"
            className="mx-auto mt-8 flex w-fit items-center gap-2 rounded-lg bg-[#2F6B4F] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#3A815D]"
          >
            Get started with MoxelAI
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  </section>

  {/* ================= FOOTER ================= */}

  <footer className="border-t border-[#303733] px-6 py-8">
    <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
      <Link href="/" className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#2F6B4F]">
          <Table2 size={14} />
        </div>

        <span className="text-sm font-semibold">
          Moxel<span className="text-[#F2A07B]">AI</span>
        </span>
      </Link>

      <p className="text-xs text-[#6F7973]">
        AI-powered spreadsheet workspace
      </p>
    </div>
  </footer>
</main>


);
}
