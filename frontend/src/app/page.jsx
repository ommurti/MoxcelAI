"use client";

import React from "react";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f9f7] text-gray-900">

      {/* ================= NAVBAR ================= */}

      <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">

        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

          {/* Logo */}
          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#217346] text-xl font-bold text-white shadow-sm">
              MO
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight">
                Moxcel<span className="text-[#217346]">AI</span>
              </h1>

              <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
                Intelligent spreadsheets
              </p>
            </div>

          </div>


          {/* Navigation */}

          <div className="hidden items-center gap-8 text-sm md:flex">

            <a
              href="#features"
              className="font-medium text-gray-600 transition hover:text-[#217346]"
            >
              Features
            </a>

            <a
              href="#workflow"
              className="font-medium text-gray-600 transition hover:text-[#217346]"
            >
              How it works
            </a>

            <a
              href="#preview"
              className="font-medium text-gray-600 transition hover:text-[#217346]"
            >
              Preview
            </a>

          </div>


          {/* Right */}

          <div className="flex items-center gap-3">

            <button className="hidden px-3 py-2 text-sm font-medium text-gray-600 hover:text-[#217346] sm:block">
              Login
            </button>

            <button className="rounded-lg bg-[#217346] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#185c37]">
              Open MoxcelAI
            </button>

          </div>

        </div>

      </nav>


      {/* ================= HERO ================= */}

      <section className="relative overflow-hidden">

        {/* Spreadsheet Grid Background */}

        <div className="absolute inset-0 opacity-40">

          <div
            className="h-full w-full"
            style={{
              backgroundImage: `
                linear-gradient(#dfe7e1 1px, transparent 1px),
                linear-gradient(90deg, #dfe7e1 1px, transparent 1px)
              `,
              backgroundSize: "40px 40px",
            }}
          />

        </div>


        <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-20">

          <div className="grid items-center gap-14 lg:grid-cols-2">


            {/* LEFT */}

            <div>

              {/* Small Label */}

              <div className="mb-6 inline-flex items-center gap-2 rounded-md border border-[#b7d8c3] bg-white px-3 py-2 text-sm font-medium text-[#217346] shadow-sm">

                <span className="flex h-5 w-5 items-center justify-center rounded bg-[#217346] text-xs text-white">
                  ✦
                </span>

                AI for your spreadsheets

              </div>


              {/* Heading */}

              <h2 className="max-w-2xl text-5xl font-bold leading-[1.08] tracking-tight text-gray-900 md:text-6xl">

                Work with Excel
                <span className="text-[#217346]">
                  {" "}without doing everything manually.
                </span>

              </h2>


              {/* Description */}

              <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600">

                Upload your spreadsheet and tell SheetAI what you need.
                Create formulas, clean data, analyze numbers and generate
                insights using simple instructions.

              </p>


              {/* AI Command */}

              <div className="mt-8 max-w-xl rounded-xl border border-gray-200 bg-white p-2 shadow-lg shadow-gray-200/50">

                <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-[#fafcfb] px-4 py-3">

                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#217346] text-sm text-white">
                    ✦
                  </div>

                  <span className="flex-1 text-sm text-gray-500">
                    "Calculate total sales and sort by highest..."
                  </span>

                  <button className="rounded-md bg-[#217346] px-4 py-2 text-sm font-semibold text-white hover:bg-[#185c37]">
                    Run
                  </button>

                </div>

              </div>


              {/* Buttons */}

              <div className="mt-6 flex flex-wrap gap-3">

                <button className="rounded-lg bg-[#217346] px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-[#185c37]">
                  Upload Excel File
                </button>

                <button className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition hover:border-[#217346] hover:text-[#217346]">
                  Explore Demo
                </button>

              </div>


              {/* Trust */}

              <div className="mt-7 flex items-center gap-6 text-sm text-gray-500">

                <span>✓ Excel compatible</span>

                <span>✓ AI powered</span>

                <span>✓ Easy to use</span>

              </div>

            </div>


            {/* RIGHT — SPREADSHEET */}

            <div
              id="preview"
              className="relative"
            >

              {/* Floating AI Card */}

              <div className="absolute -right-3 -top-7 z-20 w-56 rounded-xl border border-gray-200 bg-white p-4 shadow-xl">

                <div className="flex items-center gap-2">

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e8f4ec] text-[#217346]">
                    ✦
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-900">
                      AI Suggestion
                    </p>

                    <p className="text-[10px] text-gray-500">
                      Formula detected
                    </p>
                  </div>

                </div>

                <div className="mt-3 rounded-md bg-gray-50 px-3 py-2 font-mono text-xs text-[#217346]">
                  =SUM(E2:E25)
                </div>

              </div>


              {/* Spreadsheet Window */}

              <div className="overflow-hidden rounded-xl border border-gray-300 bg-white shadow-2xl shadow-gray-300/50">

                {/* Top Bar */}

                <div className="flex items-center justify-between border-b border-gray-200 bg-[#f3f6f4] px-4 py-3">

                  <div className="flex items-center gap-2">

                    <div className="flex h-7 w-7 items-center justify-center rounded bg-[#217346] text-xs font-bold text-white">
                      S
                    </div>

                    <span className="text-sm font-semibold">
                      sales_data.xlsx
                    </span>

                  </div>

                  <button className="rounded-md bg-[#217346] px-3 py-1.5 text-xs font-semibold text-white">
                    ✦ AI Assist
                  </button>

                </div>


                {/* Formula Bar */}

                <div className="flex border-b border-gray-200">

                  <div className="flex w-14 items-center justify-center border-r border-gray-200 bg-gray-50 text-xs text-gray-500">
                    E2
                  </div>

                  <div className="flex-1 px-3 py-2 font-mono text-xs text-gray-600">
                    =SUM(C2:D2)
                  </div>

                </div>


                {/* Spreadsheet */}

                <div className="overflow-x-auto">

                  <table className="w-full min-w-[550px] border-collapse text-xs">

                    <thead>

                      <tr className="bg-[#f3f6f4]">

                        <th className="w-10 border border-gray-200 px-2 py-2 text-gray-400">
                          #
                        </th>

                        <th className="border border-gray-200 px-4 py-2 text-left font-semibold text-gray-600">
                          Customer
                        </th>

                        <th className="border border-gray-200 px-4 py-2 text-left font-semibold text-gray-600">
                          Product
                        </th>

                        <th className="border border-gray-200 px-4 py-2 text-left font-semibold text-gray-600">
                          Quantity
                        </th>

                        <th className="border border-gray-200 px-4 py-2 text-left font-semibold text-gray-600">
                          Sales
                        </th>

                      </tr>

                    </thead>


                    <tbody>

                      {[
                        ["1", "Rahul Sharma", "Laptop", "2", "₹1,30,000"],
                        ["2", "Priya Singh", "Monitor", "3", "₹54,000"],
                        ["3", "Aman Verma", "Keyboard", "5", "₹12,500"],
                        ["4", "Neha Gupta", "Laptop", "1", "₹65,000"],
                        ["5", "Arjun Mehta", "Mouse", "8", "₹8,000"],
                        ["6", "Sneha Kapoor", "Laptop", "3", "₹1,95,000"],
                      ].map((row, index) => (

                        <tr
                          key={index}
                          className="group transition hover:bg-[#f1f8f3]"
                        >

                          {row.map((cell, cellIndex) => (

                            <td
                              key={cellIndex}
                              className={`border border-gray-200 px-4 py-3 ${
                                cellIndex === 4
                                  ? "font-semibold text-[#217346]"
                                  : "text-gray-600"
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


                {/* Sheet Tabs */}

                <div className="flex items-center gap-1 border-t border-gray-200 bg-[#f5f7f6] px-3 pt-2">

                  <div className="rounded-t-md border border-b-0 border-gray-200 bg-white px-5 py-2 text-xs font-semibold text-[#217346]">
                    Sales
                  </div>

                  <div className="px-5 py-2 text-xs text-gray-500">
                    Customers
                  </div>

                  <div className="px-5 py-2 text-xs text-gray-500">
                    Summary
                  </div>

                  <div className="px-3 py-2 text-gray-400">
                    +
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ================= FEATURES ================= */}

      <section
        id="features"
        className="border-t border-gray-200 bg-white px-6 py-24"
      >

        <div className="mx-auto max-w-7xl">

          <div className="mb-14">

            <p className="mb-3 text-sm font-bold uppercase tracking-widest text-[#217346]">
              What SheetAI can do
            </p>

            <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
              Your spreadsheet,
              <br />
              with an intelligent layer.
            </h2>

          </div>


          <div className="grid gap-5 md:grid-cols-4">


            {/* Card */}

            <div className="rounded-xl border border-gray-200 bg-[#fafcfb] p-6 transition hover:-translate-y-1 hover:border-[#9bc8aa] hover:shadow-lg">

              <div className="mb-8 text-3xl">
                ƒx
              </div>

              <h3 className="text-lg font-bold">
                Generate formulas
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                Explain what you want to calculate and let AI create
                the formula for you.
              </p>

            </div>


            {/* Card */}

            <div className="rounded-xl border border-gray-200 bg-[#fafcfb] p-6 transition hover:-translate-y-1 hover:border-[#9bc8aa] hover:shadow-lg">

              <div className="mb-8 text-3xl">
                ⇅
              </div>

              <h3 className="text-lg font-bold">
                Clean & transform
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                Sort, filter, organize and transform large amounts
                of spreadsheet data.
              </p>

            </div>


            {/* Card */}

            <div className="rounded-xl border border-gray-200 bg-[#fafcfb] p-6 transition hover:-translate-y-1 hover:border-[#9bc8aa] hover:shadow-lg">

              <div className="mb-8 text-3xl">
                ◫
              </div>

              <h3 className="text-lg font-bold">
                Analyze data
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                Ask questions about your spreadsheet and get
                meaningful answers.
              </p>

            </div>


            {/* Card */}

            <div className="rounded-xl border border-gray-200 bg-[#fafcfb] p-6 transition hover:-translate-y-1 hover:border-[#9bc8aa] hover:shadow-lg">

              <div className="mb-8 text-3xl">
                ↗
              </div>

              <h3 className="text-lg font-bold">
                Find insights
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                Discover trends, unusual values and important
                patterns in your data.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ================= WORKFLOW ================= */}

      <section
        id="workflow"
        className="bg-[#f3f7f4] px-6 py-24"
      >

        <div className="mx-auto max-w-7xl">

          <div className="text-center">

            <p className="mb-3 text-sm font-bold uppercase tracking-widest text-[#217346]">
              Simple workflow
            </p>

            <h2 className="text-4xl font-bold">
              Just tell your spreadsheet what to do.
            </h2>

          </div>


          <div className="mt-16 grid gap-5 md:grid-cols-5">

            {[
              ["01", "Upload", "Drop your Excel file"],
              ["02", "Ask", "Write your request"],
              ["03", "Understand", "AI reads your data"],
              ["04", "Apply", "Changes happen automatically"],
              ["05", "Export", "Download your result"],
            ].map(([number, title, description], index) => (

              <div
                key={number}
                className="relative rounded-xl border border-gray-200 bg-white p-6"
              >

                <span className="text-xs font-bold text-[#217346]">
                  {number}
                </span>

                <h3 className="mt-5 font-bold">
                  {title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {description}
                </p>

                {index < 4 && (
                  <div className="absolute -right-3 top-1/2 hidden text-gray-300 md:block">
                    →
                  </div>
                )}

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* ================= FINAL CTA ================= */}

      <section className="bg-white px-6 py-24">

        <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl bg-[#217346] px-8 py-16 text-center text-white md:px-20">

          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 text-xl">
            ✦
          </div>

          <h2 className="text-4xl font-bold md:text-5xl">
            Let AI handle the spreadsheet work.
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-green-100">
            Upload a file, write a command and see your spreadsheet
            transform in seconds.
          </p>

          <button className="mt-8 rounded-lg bg-white px-7 py-3 font-semibold text-[#217346] shadow-sm transition hover:bg-green-50">
            Upload your first spreadsheet →
          </button>

        </div>

      </section>


      {/* ================= FOOTER ================= */}

      <footer className="border-t border-gray-200 bg-[#fafafa]">

        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 px-6 py-8 text-sm text-gray-500 md:flex-row">

          <div>
            <span className="font-semibold text-gray-700">
              MoxcelAI
            </span>

            <span className="ml-2">
              Intelligent spreadsheet automation
            </span>
          </div>

          <div className="flex gap-6">
            <span className="cursor-pointer hover:text-[#217346]">
              Privacy
            </span>

            <span className="cursor-pointer hover:text-[#217346]">
              Terms
            </span>

            <span className="cursor-pointer hover:text-[#217346]">
              Contact
            </span>
          </div>

        </div>

      </footer>

    </main>
  );
}