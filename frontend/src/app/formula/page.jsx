"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  Check,
  ChevronDown,
  Clipboard,
  Copy,
  FileSpreadsheet,
  History,
  Lightbulb,
  Menu,
  Sparkles,
  Table2,
  WandSparkles,
  X,
  Zap,
} from "lucide-react";

export default function FormulaGenerator() {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [description, setDescription] = React.useState("");
  const [cellRange, setCellRange] = React.useState("B2:B100");
  const [platform, setPlatform] = React.useState("Excel");
  const [formula, setFormula] = React.useState("");
  const [copied, setCopied] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const examples = [
    "Calculate total sales",
    "Find the average of column B",
    "Find duplicate values",
    "Calculate profit margin",
  ];

  const generateFormula = () => {
    if (!description.trim()) return;

    setLoading(true);
    setFormula("");

    setTimeout(() => {
      const text = description.toLowerCase();

      let generated = "=SUM(B2:B100)";

      if (text.includes("average") || text.includes("mean")) {
        generated = "=AVERAGE(B2:B100)";
      } else if (
        text.includes("maximum") ||
        text.includes("highest") ||
        text.includes("max")
      ) {
        generated = "=MAX(B2:B100)";
      } else if (
        text.includes("minimum") ||
        text.includes("lowest") ||
        text.includes("min")
      ) {
        generated = "=MIN(B2:B100)";
      } else if (
        text.includes("count") ||
        text.includes("number of")
      ) {
        generated = "=COUNT(B2:B100)";
      } else if (
        text.includes("duplicate")
      ) {
        generated =
          '=IF(COUNTIF(B:B,B2)>1,"Duplicate","Unique")';
      } else if (
        text.includes("profit margin")
      ) {
        generated =
          "=IFERROR((Revenue-Cost)/Revenue,0)";
      }

      setFormula(generated);
      setLoading(false);
    }, 700);
  };

  const copyFormula = async () => {
    if (!formula) return;

    await navigator.clipboard.writeText(formula);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1800);
  };

  return (
    <main className="min-h-screen bg-[#111312] text-[#F5F3ED]">

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

            <Link
              href="/"
              className="text-sm text-[#929A94] transition hover:text-[#F5F3ED]"
            >
              Home
            </Link>

            <Link
              href="/formula"
              className="text-sm font-medium text-[#F2A07B]"
            >
              Formula Generator
            </Link>

            <Link
              href="/#features"
              className="text-sm text-[#929A94] transition hover:text-[#F5F3ED]"
            >
              Features
            </Link>

            <Link
              href="/#preview"
              className="text-sm text-[#929A94] transition hover:text-[#F5F3ED]"
            >
              Preview
            </Link>

          </nav>


          {/* Actions */}

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


        {menuOpen && (

          <div className="border-t border-[#303733] bg-[#111312] px-6 py-5 md:hidden">

            <div className="flex flex-col gap-4">

              <Link href="/" className="text-[#C8CEC9]">
                Home
              </Link>

              <Link href="/formula" className="text-[#F2A07B]">
                Formula Generator
              </Link>

              <Link href="/#features" className="text-[#C8CEC9]">
                Features
              </Link>

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

      <section className="relative overflow-hidden">

        {/* Background glow */}

        <div className="absolute left-1/2 top-[-220px] h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-[#2F6B4F]/15 blur-[120px]" />

        <div className="absolute right-[-100px] top-[250px] h-[300px] w-[300px] rounded-full bg-[#F2A07B]/8 blur-[120px]" />


        <div className="relative mx-auto max-w-7xl px-6 pb-16 pt-16 lg:pb-20 lg:pt-20">

          {/* Back */}

          <Link
            href="/"
            className="mb-10 inline-flex items-center gap-2 text-sm text-[#929A94] transition hover:text-[#F2A07B]"
          >
            <ArrowLeft size={15} />
            Back to workspace
          </Link>


          {/* Heading */}

          <div className="mx-auto max-w-3xl text-center">

            <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-[#2F6B4F]/50 bg-[#2F6B4F]/10 px-4 py-2 text-xs font-medium text-[#A9C7B4]">

              <WandSparkles
                size={14}
                className="text-[#F2A07B]"
              />

              AI Formula Generator

            </div>


            <h1 className="mt-7 text-4xl font-bold tracking-[-0.04em] sm:text-5xl lg:text-6xl">

              Describe it.

              <br />

              <span className="text-[#F2A07B]">
                AI writes the formula.
              </span>

            </h1>


            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#929A94]">

              Tell MoxcelAI what you want to calculate in plain
              language. Get an accurate spreadsheet formula in
              seconds.

            </p>

          </div>


          {/* ================= GENERATOR ================= */}

          <div className="relative mx-auto mt-14 max-w-5xl">

            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#2F6B4F]/20 via-[#F2A07B]/10 to-[#2F6B4F]/20 blur-xl" />

            <div className="relative rounded-3xl border border-[#303733] bg-[#191C1A] p-5 shadow-2xl shadow-black/30 sm:p-7">


              {/* Generator Header */}

              <div className="flex items-center gap-3 border-b border-[#303733] pb-5">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2F6B4F]/15 text-[#F2A07B]">
                  <Bot size={20} />
                </div>

                <div>

                  <h2 className="text-sm font-semibold">
                    Ask MoxcelAI
                  </h2>

                  <p className="text-xs text-[#929A94]">
                    Describe the formula you need
                  </p>

                </div>

              </div>


              {/* Controls */}

              <div className="mt-6 grid gap-4 sm:grid-cols-2">

                {/* Platform */}

                <div>

                  <label className="mb-2 block text-xs font-medium text-[#C8CEC9]">
                    Spreadsheet platform
                  </label>

                  <div className="relative">

                    <select
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value)}
                      className="w-full appearance-none rounded-lg border border-[#303733] bg-[#111312] px-4 py-3 text-sm text-[#C8CEC9] outline-none transition focus:border-[#2F6B4F]"
                    >
                      <option>Excel</option>
                      <option>Google Sheets</option>
                    </select>

                    <ChevronDown
                      size={16}
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#929A94]"
                    />

                  </div>

                </div>


                {/* Cell Range */}

                <div>

                  <label className="mb-2 block text-xs font-medium text-[#C8CEC9]">
                    Cell or range
                  </label>

                  <input
                    value={cellRange}
                    onChange={(e) => setCellRange(e.target.value)}
                    placeholder="Example: B2:B100"
                    className="w-full rounded-lg border border-[#303733] bg-[#111312] px-4 py-3 text-sm text-[#C8CEC9] outline-none placeholder:text-[#626B65] transition focus:border-[#2F6B4F]"
                  />

                </div>

              </div>


              {/* Prompt */}

              <div className="mt-5">

                <label className="mb-2 block text-xs font-medium text-[#C8CEC9]">
                  What do you want to calculate?
                </label>

                <div className="relative">

                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Example: Calculate the total sales from B2 to B100..."
                    rows={5}
                    className="w-full resize-none rounded-xl border border-[#303733] bg-[#111312] px-4 py-4 text-sm leading-6 text-[#C8CEC9] outline-none placeholder:text-[#626B65] transition focus:border-[#2F6B4F]"
                  />

                  <div className="absolute bottom-3 right-3 text-[10px] text-[#626B65]">
                    {description.length}/500
                  </div>

                </div>

              </div>


              {/* Examples */}

              <div className="mt-4">

                <p className="mb-2 text-[11px] font-medium text-[#929A94]">
                  Try an example
                </p>

                <div className="flex flex-wrap gap-2">

                  {examples.map((example) => (

                    <button
                      key={example}
                      onClick={() => setDescription(example)}
                      className="rounded-md border border-[#303733] px-3 py-2 text-[11px] text-[#929A94] transition hover:border-[#F2A07B]/40 hover:text-[#F2A07B]"
                    >
                      {example}
                    </button>

                  ))}

                </div>

              </div>


              {/* Generate */}

              <button
                onClick={generateFormula}
                disabled={!description.trim() || loading}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#2F6B4F] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#3A815D] disabled:cursor-not-allowed disabled:opacity-50"
              >

                {loading ? (
                  <>
                    <Sparkles
                      size={16}
                      className="animate-pulse"
                    />
                    Generating formula...
                  </>
                ) : (
                  <>
                    <WandSparkles size={16} />
                    Generate Formula
                  </>
                )}

              </button>


              {/* ================= RESULT ================= */}

              {formula && (

                <div className="mt-6 overflow-hidden rounded-xl border border-[#2F6B4F]/40 bg-[#111312]">

                  {/* Result Header */}

                  <div className="flex items-center justify-between border-b border-[#303733] px-4 py-3">

                    <div className="flex items-center gap-2">

                      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#2F6B4F]/15 text-[#A9C7B4]">
                        <Check size={15} />
                      </div>

                      <span className="text-xs font-semibold">
                        Generated formula
                      </span>

                    </div>


                    <button
                      onClick={copyFormula}
                      className="flex items-center gap-2 rounded-md border border-[#303733] px-3 py-1.5 text-[11px] text-[#929A94] transition hover:border-[#F2A07B]/40 hover:text-[#F2A07B]"
                    >

                      {copied ? (
                        <>
                          <Check size={13} />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy size={13} />
                          Copy
                        </>
                      )}

                    </button>

                  </div>


                  {/* Formula */}

                  <div className="p-5">

                    <div className="rounded-lg border border-[#303733] bg-[#191C1A] px-4 py-4">

                      <code className="break-all text-sm font-medium text-[#F2A07B]">
                        {formula}
                      </code>

                    </div>


                    {/* Explanation */}

                    <div className="mt-5 flex gap-3">

                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F2A07B]/10 text-[#F2A07B]">
                        <Lightbulb size={16} />
                      </div>

                      <div>

                        <p className="text-xs font-semibold text-[#F2A07B]">
                          How it works
                        </p>

                        <p className="mt-1 text-xs leading-5 text-[#929A94]">
                          MoxcelAI generated this {platform} formula
                          using the range{" "}
                          <span className="text-[#C8CEC9]">
                            {cellRange}
                          </span>
                          . You can copy it directly into your
                          spreadsheet.
                        </p>

                      </div>

                    </div>

                  </div>

                </div>

              )}

            </div>

          </div>

        </div>

      </section>


      {/* ================= FEATURES ================= */}

      <section className="border-y border-[#303733] bg-[#151816] px-6 py-20">

        <div className="mx-auto max-w-6xl">

          <div className="text-center">

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#F2A07B]">
              Formula intelligence
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight">
              Work with formulas without memorizing them.
            </h2>

          </div>


          <div className="mt-12 grid gap-5 md:grid-cols-3">

            {[
              {
                icon: WandSparkles,
                title: "Natural language",
                text: "Explain what you want in simple words instead of remembering complex spreadsheet syntax.",
              },
              {
                icon: Zap,
                title: "Instant generation",
                text: "Generate formulas quickly based on your cells, ranges and calculation requirements.",
              },
              {
                icon: Lightbulb,
                title: "Understand the formula",
                text: "Get a simple explanation so you know exactly what the generated formula does.",
              },
            ].map((item) => {

              const Icon = item.icon;

              return (

                <div
                  key={item.title}
                  className="rounded-2xl border border-[#303733] bg-[#191C1A] p-6 transition hover:-translate-y-1 hover:border-[#F2A07B]/30"
                >

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#2F6B4F]/15 text-[#A9C7B4]">
                    <Icon size={21} />
                  </div>

                  <h3 className="mt-5 font-semibold">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[#929A94]">
                    {item.text}
                  </p>

                </div>

              );

            })}

          </div>

        </div>

      </section>


      {/* ================= RECENT FORMULAS ================= */}

      <section className="px-6 py-20">

        <div className="mx-auto max-w-6xl">

          <div className="flex items-center justify-between">

            <div>

              <div className="flex items-center gap-2">

                <History
                  size={17}
                  className="text-[#F2A07B]"
                />

                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#F2A07B]">
                  History
                </p>

              </div>

              <h2 className="mt-2 text-2xl font-bold">
                Recent formulas
              </h2>

            </div>

            <button className="text-xs text-[#929A94] transition hover:text-[#F2A07B]">
              View all
            </button>

          </div>


          <div className="mt-7 overflow-hidden rounded-2xl border border-[#303733] bg-[#191C1A]">

            {[
              {
                text: "Calculate total sales",
                formula: "=SUM(B2:B100)",
              },
              {
                text: "Find average sales",
                formula: "=AVERAGE(B2:B100)",
              },
              {
                text: "Find highest value",
                formula: "=MAX(B2:B100)",
              },
            ].map((item, index) => (

              <div
                key={item.text}
                className={`flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between ${
                  index !== 2
                    ? "border-b border-[#303733]"
                    : ""
                }`}
              >

                <div>

                  <p className="text-sm font-medium text-[#C8CEC9]">
                    {item.text}
                  </p>

                  <code className="mt-1 block text-xs text-[#F2A07B]">
                    {item.formula}
                  </code>

                </div>

                <button
                  onClick={() =>
                    navigator.clipboard.writeText(item.formula)
                  }
                  className="flex w-fit items-center gap-2 rounded-md border border-[#303733] px-3 py-2 text-[11px] text-[#929A94] transition hover:border-[#F2A07B]/40 hover:text-[#F2A07B]"
                >
                  <Clipboard size={13} />
                  Copy
                </button>

              </div>

            ))}

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