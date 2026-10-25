"use client";

import Link from "next/link";
import { useState } from "react";
import {
ArrowRight,
Bot,
Calculator,
WandSparkles,
Sparkles,
Search,
Zap,
FileSpreadsheet,
CheckCircle2,
Menu,
X,
} from "lucide-react";

const tools = [
{
id: 1,
name: "AI Chatbot",
category: "AI ASSISTANT",
description:
"Chat with your spreadsheet using natural language. Ask questions, understand your data, and get clear answers without manually analyzing rows and columns.",
features: [
"Ask questions about your data",
"Get instant explanations",
"Discover useful insights",
],
href: "/chat",
icon: Bot,
accent: "#F2A07B",
iconBackground: "rgba(242, 160, 123, 0.12)",
badge: "Ask anything",
number: "01",
},
{
id: 2,
name: "Formula Generator",
category: "SMART FORMULAS",
description:
"Generate Excel formulas simply by describing what you want to calculate. Let AI help you build formulas for totals, averages, conditions, lookups, and more.",
features: [
"Generate formulas from instructions",
"Simplify complex calculations",
"Understand how formulas work",
],
href: "/formula",
icon: Calculator,
accent: "#8AC7A0",
iconBackground: "rgba(138, 199, 160, 0.12)",
badge: "Formula assistant",
number: "02",
},
{
id: 3,
name: "Data Manipulation",
category: "DATA WORKSPACE",
description:
"Prepare and organize your spreadsheet data with ease. Clean messy datasets, remove duplicates, sort records, filter rows, and transform your data efficiently.",
features: [
"Clean and organize datasets",
"Sort, filter, and remove duplicates",
"Transform spreadsheet data",
],
href: "/manipulation",
icon: WandSparkles,
accent: "#B6A1F8",
iconBackground: "rgba(182, 161, 248, 0.12)",
badge: "Data transformation",
number: "03",
},
];

export default function ToolsPage() {
const [searchQuery, setSearchQuery] = useState("");
const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

const filteredTools = tools.filter((tool) => {
const searchText = [
tool.name,
tool.category,
tool.description,
...tool.features,
]
.join(" ")
.toLowerCase();


return searchText.includes(searchQuery.toLowerCase().trim());


});

return ( <main className="min-h-screen overflow-hidden bg-[#111312] text-[#F5F3ED]">
{/* Background decoration */} <div className="pointer-events-none fixed inset-0 overflow-hidden"> <div className="absolute -top-48 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-[#2F6B4F]/10 blur-[130px]" /> <div className="absolute right-[-150px] top-[450px] h-[350px] w-[350px] rounded-full bg-[#F2A07B]/5 blur-[110px]" />
<div
className="absolute inset-0 opacity-[0.035]"
style={{
backgroundImage:
"linear-gradient(#929A94 1px, transparent 1px), linear-gradient(90deg, #929A94 1px, transparent 1px)",
backgroundSize: "48px 48px",
}}
/> </div>

  {/* Navigation */}
  <header className="relative z-20 border-b border-[#303733] bg-[#111312]/85 backdrop-blur-xl">
    <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
      <Link href="/" className="group flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2F6B4F] shadow-lg shadow-[#2F6B4F]/20 transition-transform group-hover:scale-105">
          <FileSpreadsheet size={21} strokeWidth={1.8} />
        </div>

        <div>
          <p className="text-[20px] font-semibold tracking-tight">
            Moxel<span className="text-[#F2A07B]">AI</span>
          </p>
          <p className="mt-[-2px] text-[10px] tracking-[0.17em] text-[#929A94]">
            INTELLIGENT SPREADSHEETS
          </p>
        </div>
      </Link>

      <nav className="hidden items-center gap-8 md:flex">
        <Link
          href="/"
          className="text-sm text-[#929A94] transition hover:text-[#F5F3ED]"
        >
          Home
        </Link>
        <Link
          href="/tools"
          className="text-sm font-medium text-[#F5F3ED]"
        >
          Tools
        </Link>
        <Link
          href="/#features"
          className="text-sm text-[#929A94] transition hover:text-[#F5F3ED]"
        >
          Features
        </Link>
      </nav>

      <div className="hidden items-center gap-3 md:flex">
        <Link
          href="/login"
          className="rounded-lg px-4 py-2.5 text-sm text-[#F5F3ED] transition hover:bg-white/5"
        >
          Log in
        </Link>
        <Link
          href="/signup"
          className="inline-flex items-center gap-2 rounded-lg bg-[#2F6B4F] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#3A815D]"
        >
          Get started
          <ArrowRight size={15} />
        </Link>
      </div>

      <button
        type="button"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="rounded-lg border border-[#303733] p-2 text-[#F5F3ED] md:hidden"
        aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
      >
        {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
      </button>
    </div>

    {mobileMenuOpen && (
      <nav className="border-t border-[#303733] bg-[#151816] px-5 py-5 md:hidden">
        <div className="mx-auto flex max-w-7xl flex-col gap-4">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm text-[#929A94]"
          >
            Home
          </Link>
          <Link
            href="/tools"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm text-[#F5F3ED]"
          >
            Tools
          </Link>
          <Link
            href="/#features"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm text-[#929A94]"
          >
            Features
          </Link>
          <div className="mt-2 flex gap-3">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 rounded-lg border border-[#303733] py-2.5 text-center text-sm"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 rounded-lg bg-[#2F6B4F] py-2.5 text-center text-sm font-medium"
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>
    )}
  </header>

  {/* Main content */}
  <section className="relative z-10 mx-auto max-w-7xl px-5 pb-20 pt-16 sm:px-8 sm:pt-20 lg:px-10 lg:pt-24">
    {/* Page heading */}
    <div className="mx-auto max-w-3xl text-center">
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#2F6B4F]/50 bg-[#2F6B4F]/10 px-4 py-2 text-xs font-medium tracking-wide text-[#A8D6B5]">
        <Sparkles size={14} />
        YOUR AI-POWERED WORKSPACE
      </div>

      <h1 className="text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl lg:text-6xl">
        Powerful tools.
        <br />
        <span className="text-[#929A94]">Smarter spreadsheets.</span>
      </h1>

      <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[#929A94] sm:text-lg sm:leading-8">
        Everything you need to work with spreadsheet data, all in one
        place. Generate formulas, analyze information, and transform
        datasets with the power of AI.
      </p>
    </div>

    {/* Search bar */}
    <div className="mx-auto mt-10 max-w-xl">
      <div className="flex items-center gap-3 rounded-xl border border-[#303733] bg-[#191C1A] px-4 py-3.5 transition focus-within:border-[#2F6B4F]">
        <Search size={19} className="shrink-0 text-[#929A94]" />

        <input
          type="text"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search tools or features..."
          aria-label="Search tools"
          className="w-full bg-transparent text-sm text-[#F5F3ED] outline-none placeholder:text-[#68716B]"
        />

        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            aria-label="Clear search"
            className="text-[#929A94] transition hover:text-[#F5F3ED]"
          >
            <X size={17} />
          </button>
        )}
      </div>

      <div className="mt-3 flex items-center justify-center gap-2 text-xs text-[#929A94]">
        <Zap size={13} className="text-[#F2A07B]" />
        <span>
          {filteredTools.length}{" "}
          {filteredTools.length === 1 ? "tool" : "tools"} available
        </span>
      </div>
    </div>

    {/* Tool cards */}
    <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {filteredTools.map((tool) => {
        const Icon = tool.icon;

        return (
          <article
            key={tool.id}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#303733] bg-[#191C1A]/90 p-6 transition duration-300 hover:-translate-y-1 hover:border-[#48554C] hover:bg-[#1C201D] sm:p-7"
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
                  backgroundColor: tool.iconBackground,
                  borderColor: `${tool.accent}30`,
                }}
              >
                <Icon size={26} strokeWidth={1.7} />
              </div>

              <span className="font-mono text-sm text-[#68716B]">
                {tool.number}
              </span>
            </div>

            {/* Category */}
            <div className="mt-7">
              <p
                className="text-[10px] font-semibold tracking-[0.2em]"
                style={{ color: tool.accent }}
              >
                {tool.category}
              </p>

              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#F5F3ED]">
                {tool.name}
              </h2>

              <p className="mt-3 min-h-[100px] text-sm leading-7 text-[#929A94]">
                {tool.description}
              </p>
            </div>

            {/* Features */}
            <div className="mt-5 space-y-3 border-t border-[#303733] pt-5">
              {tool.features.map((feature) => (
                <div
                  key={feature}
                  className="flex items-start gap-2.5 text-sm text-[#C4C9C4]"
                >
                  <CheckCircle2
                    size={16}
                    className="mt-0.5 shrink-0"
                    style={{ color: tool.accent }}
                  />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-7 flex items-center justify-between gap-3 border-t border-[#303733] pt-5">
              <span className="rounded-full border border-[#303733] bg-[#111312] px-3 py-1.5 text-[11px] text-[#929A94]">
                {tool.badge}
              </span>

              <Link
                href={tool.href}
                className="inline-flex items-center gap-2 rounded-lg bg-[#2F6B4F] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#3A815D]"
              >
                Open tool
                <ArrowRight
                  size={15}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>
          </article>
        );
      })}
    </div>

    {/* Empty search state */}
    {filteredTools.length === 0 && (
      <div className="mt-10 rounded-2xl border border-dashed border-[#303733] bg-[#191C1A]/60 px-6 py-16 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2F6B4F]/10 text-[#8AC7A0]">
          <Search size={24} />
        </div>

        <h3 className="mt-5 text-lg font-semibold">
          No tools found
        </h3>

        <p className="mt-2 text-sm text-[#929A94]">
          Try a different search term.
        </p>

        <button
          type="button"
          onClick={() => setSearchQuery("")}
          className="mt-5 rounded-lg border border-[#303733] px-4 py-2 text-sm transition hover:bg-white/5"
        >
          Clear search
        </button>
      </div>
    )}

    {/* Bottom callout */}
    <div className="relative mt-16 overflow-hidden rounded-2xl border border-[#303733] bg-[#151816] p-7 sm:p-10">
      <div className="pointer-events-none absolute -right-10 -top-20 h-56 w-56 rounded-full bg-[#2F6B4F]/15 blur-[80px]" />

      <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div className="max-w-xl">
          <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-[#8AC7A0]">
            <Sparkles size={14} />
            Work smarter with MoxelAI
          </div>

          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Your data has more to tell.
          </h2>

          <p className="mt-3 text-sm leading-7 text-[#929A94] sm:text-base">
            Choose a tool and turn spreadsheet work into a simpler,
            faster, and more insightful experience.
          </p>
        </div>

        <Link
          href="/chat"
          className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-[#3D7454] bg-[#2F6B4F]/15 px-5 py-3 text-sm font-medium text-[#B7E0C2] transition hover:bg-[#2F6B4F]/30"
        >
          Try AI Chatbot
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>

    {/* Footer */}
    <footer className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-[#303733] pt-6 text-xs text-[#68716B] sm:flex-row">
      <p>
        © {new Date().getFullYear()} MoxelAI. All rights reserved.
      </p>
      <p>Built for smarter spreadsheet workflows.</p>
    </footer>
  </section>
</main>

);
}
