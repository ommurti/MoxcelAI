"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BarChart3,
  Bot,
  ChevronDown,
  FileSpreadsheet,
  Lightbulb,
  Menu,
  MessageSquare,
  Paperclip,
  Plus,
  Send,
  Settings,
  Sparkles,
  Table2,
  Upload,
  User,
  X,
} from "lucide-react";

export default function Chatbot() {
  const [message, setMessage] = useState("");
  const [mobileSidebar, setMobileSidebar] = useState(false);

  const suggestions = [
    "Summarize this spreadsheet",
    "What is the total sales?",
    "How many rows are there?",
    "Which product has the highest sales?",
  ];

  return (
    <main className="min-h-screen bg-[#111312] text-[#F5F3ED]">

      {/* ================= HEADER ================= */}

      <header className="h-16 border-b border-[#303733] bg-[#111312]">

        <div className="flex h-full items-center justify-between px-5">

          {/* LEFT */}

          <div className="flex items-center gap-4">

            <button
              onClick={() => setMobileSidebar(!mobileSidebar)}
              className="rounded-lg p-2 text-[#929A94] hover:bg-[#191C1A] hover:text-white lg:hidden"
            >
              {mobileSidebar ? <X size={19} /> : <Menu size={19} />}
            </button>

            <Link href="/" className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2F6B4F]">
                <Table2 size={18} />
              </div>

              <div className="text-lg font-bold">
                Moxcel<span className="text-[#F2A07B]">AI</span>
              </div>

            </Link>

            <div className="hidden h-6 w-px bg-[#303733] sm:block" />

            <div className="hidden items-center gap-2 sm:flex">

              <FileSpreadsheet
                size={15}
                className="text-[#A9C7B4]"
              />

              <span className="text-sm text-[#C8CEC9]">
                Sales_Report.xlsx
              </span>

              <ChevronDown
                size={14}
                className="text-[#6F7973]"
              />

            </div>

          </div>


          {/* RIGHT */}

          <div className="flex items-center gap-2">

            <Link
              href="/"
              className="hidden items-center gap-2 rounded-lg px-3 py-2 text-xs text-[#929A94] hover:bg-[#191C1A] hover:text-white sm:flex"
            >
              <ArrowLeft size={14} />
              Home
            </Link>

            <button className="rounded-lg p-2 text-[#929A94] hover:bg-[#191C1A] hover:text-white">
              <Settings size={17} />
            </button>

            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2F6B4F]/20 text-[#A9C7B4]">
              <User size={15} />
            </div>

          </div>

        </div>

      </header>


      {/* ================= BODY ================= */}

      <div className="relative flex h-[calc(100vh-64px)]">


        {/* ================= SIDEBAR ================= */}

        <aside
          className={`
            absolute inset-y-0 left-0 z-30 w-72 border-r border-[#303733]
            bg-[#151816] transition-transform lg:relative lg:translate-x-0
            ${mobileSidebar ? "translate-x-0" : "-translate-x-full"}
          `}
        >

          <div className="flex h-full flex-col">


            {/* File */}

            <div className="border-b border-[#303733] p-5">

              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6F7973]">
                Current spreadsheet
              </p>


              <div className="rounded-xl border border-[#303733] bg-[#191C1A] p-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2F6B4F]/15 text-[#A9C7B4]">
                    <FileSpreadsheet size={19} />
                  </div>

                  <div className="min-w-0">

                    <p className="truncate text-sm font-semibold">
                      Sales_Report.xlsx
                    </p>

                    <p className="mt-1 text-[10px] text-[#6F7973]">
                      2,450 rows • 18 columns
                    </p>

                  </div>

                </div>


                <div className="mt-4 flex gap-2">

                  <div className="flex-1 rounded-md bg-[#111312] px-3 py-2 text-center">

                    <p className="text-sm font-semibold text-[#C8CEC9]">
                      5
                    </p>

                    <p className="text-[9px] text-[#6F7973]">
                      Sheets
                    </p>

                  </div>

                  <div className="flex-1 rounded-md bg-[#111312] px-3 py-2 text-center">

                    <p className="text-sm font-semibold text-[#C8CEC9]">
                      2.4K
                    </p>

                    <p className="text-[9px] text-[#6F7973]">
                      Rows
                    </p>

                  </div>

                  <div className="flex-1 rounded-md bg-[#111312] px-3 py-2 text-center">

                    <p className="text-sm font-semibold text-[#C8CEC9]">
                      18
                    </p>

                    <p className="text-[9px] text-[#6F7973]">
                      Columns
                    </p>

                  </div>

                </div>

              </div>

            </div>


            {/* Sheets */}

            <div className="flex-1 overflow-y-auto p-5">

              <div className="mb-3 flex items-center justify-between">

                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6F7973]">
                  Sheets
                </p>

                <Plus
                  size={15}
                  className="cursor-pointer text-[#6F7973] hover:text-[#F2A07B]"
                />

              </div>


              <div className="space-y-1">

                {[
                  { name: "Sales", active: true },
                  { name: "Customers", active: false },
                  { name: "Products", active: false },
                  { name: "Regions", active: false },
                  { name: "Summary", active: false },
                ].map((sheet) => (

                  <button
                    key={sheet.name}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${
                      sheet.active
                        ? "bg-[#2F6B4F]/15 text-[#A9C7B4]"
                        : "text-[#929A94] hover:bg-[#191C1A] hover:text-[#C8CEC9]"
                    }`}
                  >

                    <Table2 size={15} />

                    {sheet.name}

                  </button>

                ))}

              </div>


              {/* Upload */}

              <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-[#303733] px-3 py-3 text-xs text-[#6F7973] transition hover:border-[#F2A07B]/40 hover:text-[#F2A07B]">

                <Upload size={14} />

                Upload another file

              </button>

            </div>


            {/* Sidebar Bottom */}

            <div className="border-t border-[#303733] p-4">

              <div className="flex items-center gap-2 rounded-lg bg-[#F2A07B]/5 p-3">

                <Sparkles
                  size={15}
                  className="shrink-0 text-[#F2A07B]"
                />

                <p className="text-[10px] leading-4 text-[#929A94]">
                  Ask questions in natural language.
                  MoxcelAI understands your spreadsheet.
                </p>

              </div>

            </div>

          </div>

        </aside>


        {/* Mobile overlay */}

        {mobileSidebar && (

          <div
            onClick={() => setMobileSidebar(false)}
            className="absolute inset-0 z-20 bg-black/50 lg:hidden"
          />

        )}


        {/* ================= CHAT ================= */}

        <section className="flex min-w-0 flex-1 flex-col">


          {/* Chat Header */}

          <div className="border-b border-[#303733] px-5 py-4">

            <div className="mx-auto flex max-w-4xl items-center gap-3">

              <div className="relative">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F2A07B]/10 text-[#F2A07B]">
                  <Bot size={21} />
                </div>

                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#111312] bg-[#5CA875]" />

              </div>


              <div>

                <h1 className="text-sm font-semibold">
                  MoxcelAI Chat
                </h1>

                <p className="text-[10px] text-[#6F7973]">
                  Analyzing Sales_Report.xlsx
                </p>

              </div>

            </div>

          </div>


          {/* Messages */}

          <div className="flex-1 overflow-y-auto px-5 py-8">

            <div className="mx-auto max-w-3xl space-y-8">


              {/* Welcome */}

              <div className="text-center">

                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2F6B4F]/15 text-[#A9C7B4]">

                  <Sparkles size={22} />

                </div>

                <h2 className="mt-4 text-xl font-semibold">
                  Ask anything about your data
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#929A94]">
                  I can calculate values, explain columns,
                  summarize sheets, find patterns and answer
                  questions about your spreadsheet.
                </p>

              </div>


              {/* User Message */}

              <div className="flex justify-end">

                <div className="max-w-[80%] rounded-2xl rounded-br-md bg-[#2F6B4F] px-4 py-3">

                  <p className="text-sm leading-6">
                    What is the total sales and which product
                    has the highest sales?
                  </p>

                </div>

              </div>


              {/* AI Message */}

              <div className="flex gap-3">

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F2A07B]/10 text-[#F2A07B]">
                  <Bot size={16} />
                </div>


                <div className="max-w-[85%]">

                  <div className="rounded-2xl rounded-tl-md border border-[#303733] bg-[#191C1A] px-5 py-4">

                    <p className="text-sm leading-6 text-[#C8CEC9]">

                      The total sales across the spreadsheet
                      are{" "}

                      <strong className="text-[#F2A07B]">
                        ₹18,45,000
                      </strong>
                      .

                      <br />
                      <br />

                      The product with the highest sales is{" "}

                      <strong className="text-[#A9C7B4]">
                        Laptop
                      </strong>

                      with sales of{" "}

                      <strong className="text-[#F2A07B]">
                        ₹85,000
                      </strong>
                      .

                    </p>


                    {/* Source */}

                    <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[#303733] pt-3">

                      <BarChart3
                        size={13}
                        className="text-[#6F7973]"
                      />

                      <span className="text-[10px] text-[#6F7973]">
                        Based on Sales sheet • 2,450 records
                      </span>

                    </div>

                  </div>


                  {/* AI actions */}

                  <div className="mt-2 flex gap-2">

                    <button className="rounded-md px-2 py-1 text-[10px] text-[#6F7973] hover:bg-[#191C1A] hover:text-[#C8CEC9]">
                      Copy
                    </button>

                    <button className="rounded-md px-2 py-1 text-[10px] text-[#6F7973] hover:bg-[#191C1A] hover:text-[#C8CEC9]">
                      Explain
                    </button>

                  </div>

                </div>

              </div>


              {/* Suggested Questions */}

              <div>

                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#6F7973]">
                  Try asking
                </p>

                <div className="grid gap-2 sm:grid-cols-2">

                  {suggestions.map((item) => (

                    <button
                      key={item}
                      onClick={() => setMessage(item)}
                      className="flex items-center justify-between rounded-xl border border-[#303733] bg-[#151816] px-4 py-3 text-left text-xs text-[#929A94] transition hover:border-[#F2A07B]/30 hover:text-[#C8CEC9]"
                    >

                      <span>{item}</span>

                      <ChevronDown
                        size={13}
                        className="-rotate-90 text-[#6F7973]"
                      />

                    </button>

                  ))}

                </div>

              </div>

            </div>

          </div>


          {/* ================= INPUT ================= */}

          <div className="border-t border-[#303733] bg-[#111312] px-5 py-5">

            <div className="mx-auto max-w-3xl">


              <div className="relative rounded-2xl border border-[#303733] bg-[#191C1A] p-2 transition focus-within:border-[#2F6B4F]">

                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={2}
                  placeholder="Ask anything about your spreadsheet..."
                  className="w-full resize-none bg-transparent px-3 py-2 pr-14 text-sm text-[#F5F3ED] outline-none placeholder:text-[#5F6862]"
                />


                <div className="flex items-center justify-between px-2 pb-1">

                  <button className="rounded-lg p-2 text-[#6F7973] hover:bg-[#111312] hover:text-[#F2A07B]">
                    <Paperclip size={17} />
                  </button>


                  <button
                    disabled={!message.trim()}
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2F6B4F] text-white transition hover:bg-[#3A815D] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Send size={16} />
                  </button>

                </div>

              </div>


              <p className="mt-2 text-center text-[9px] text-[#4F5953]">
                MoxcelAI analyzes your uploaded spreadsheet to answer
                your questions. Always verify important calculations.
              </p>

            </div>

          </div>

        </section>

      </div>

    </main>
  );
}