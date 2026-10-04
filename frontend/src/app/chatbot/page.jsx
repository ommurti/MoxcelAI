"use client";

import React, { useState } from "react";
import Link from "next/link";

import {
  ArrowLeft,
  Bot,
  ChevronDown,
  FileSpreadsheet,
  Menu,
  Paperclip,
  Send,
  Settings,
  Sparkles,
  Table2,
  Upload,
  User,
  X,
  Copy,
  Check,
} from "lucide-react";

const API_URL = "http://localhost:5000/api/chat";

export default function ChatbotPage() {
  const [file, setFile] = useState(null);
  const [workbookId, setWorkbookId] = useState(null);

  const [fileName, setFileName] = useState("");
  const [sheets, setSheets] = useState({});
  const [selectedSheet, setSelectedSheet] = useState("");

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const [uploading, setUploading] = useState(false);
  const [sending, setSending] = useState(false);

  const [mobileSidebar, setMobileSidebar] =
    useState(false);

  const [copied, setCopied] = useState(null);

  /*
  --------------------------------------------------
  UPLOAD EXCEL
  --------------------------------------------------
  */

  const handleFileUpload = async (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    const extension = selectedFile.name
      .split(".")
      .pop()
      .toLowerCase();

    if (!["xlsx", "xls", "csv"].includes(extension)) {
      alert("Please upload an Excel or CSV file.");
      return;
    }

    setFile(selectedFile);
    setUploading(true);

    try {
      const formData = new FormData();

      formData.append("file", selectedFile);

      const response = await fetch(
        `${API_URL}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!data.success) {
        alert(data.message);
        return;
      }

      setWorkbookId(data.workbookId);
      setFileName(data.fileName);
      setSheets(data.sheets);

      const firstSheet =
        Object.keys(data.sheets)[0];

      setSelectedSheet(firstSheet);

      setMessages([
        {
          id: Date.now(),
          type: "ai",
          text: `I've loaded "${data.fileName}". You can now ask me questions about your spreadsheet.`,
          source: `Workbook loaded • ${Object.keys(data.sheets).length} sheet(s)`,
        },
      ]);
    } catch (error) {
      console.error(error);

      alert(
        "Could not connect to the backend."
      );
    } finally {
      setUploading(false);
    }
  };

  /*
  --------------------------------------------------
  ASK QUESTION
  --------------------------------------------------
  */

  const sendMessage = async () => {
    if (!message.trim()) return;

    if (!workbookId) {
      alert("Please upload an Excel file first.");
      return;
    }

    const userQuestion = message.trim();

    setMessage("");

    setMessages((previous) => [
      ...previous,
      {
        id: Date.now(),
        type: "user",
        text: userQuestion,
      },
    ]);

    setSending(true);

    try {
      const response = await fetch(
        `${API_URL}/ask`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            workbookId,
            question: userQuestion,
            sheetName: selectedSheet,
          }),
        }
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      setMessages((previous) => [
        ...previous,
        {
          id: Date.now() + 1,
          type: "ai",
          text: data.answer,
          source: `Based on ${data.source.sheet} sheet • ${data.source.rows.toLocaleString()} records`,
        },
      ]);
    } catch (error) {
      console.error(error);

      setMessages((previous) => [
        ...previous,
        {
          id: Date.now() + 1,
          type: "ai",
          text: "I couldn't analyze the spreadsheet right now. Please make sure the backend and Gemini API are running.",
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  /*
  --------------------------------------------------
  SUGGESTED QUESTION
  --------------------------------------------------
  */

  const askSuggestedQuestion = (question) => {
    setMessage(question);
  };

  /*
  --------------------------------------------------
  COPY
  --------------------------------------------------
  */

  const copyAnswer = async (text, id) => {
    await navigator.clipboard.writeText(text);

    setCopied(id);

    setTimeout(() => {
      setCopied(null);
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-[#111312] text-[#F5F3ED]">
      {/* HEADER */}

      <header className="h-16 border-b border-[#303733] bg-[#111312]/95 backdrop-blur-xl flex items-center justify-between px-4 md:px-6 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button
            onClick={() =>
              setMobileSidebar(!mobileSidebar)
            }
            className="lg:hidden p-2 rounded-lg hover:bg-[#191C1A]"
          >
            {mobileSidebar ? (
              <X size={20} />
            ) : (
              <Menu size={20} />
            )}
          </button>

          <Link
            href="/"
            className="text-xl font-bold tracking-tight"
          >
            Moxcel
            <span className="text-[#F2A07B]">
              AI
            </span>
          </Link>

          <div className="hidden md:block h-6 w-px bg-[#303733]" />

          <div className="hidden md:flex items-center gap-2 text-sm text-[#929A94]">
            <Bot
              size={17}
              className="text-[#F2A07B]"
            />

            <span>Spreadsheet Chat</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#929A94] hover:bg-[#191C1A] hover:text-[#F5F3ED]"
          >
            <ArrowLeft size={16} />
            Home
          </Link>

          <button className="p-2 rounded-lg hover:bg-[#191C1A] text-[#929A94]">
            <Settings size={18} />
          </button>

          <div className="w-9 h-9 rounded-full bg-[#2F6B4F] flex items-center justify-center">
            <User size={17} />
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-64px)]">
        {/* SIDEBAR */}

        <aside
          className={`
            fixed lg:static z-40
            top-16 bottom-0 left-0
            w-72
            border-r border-[#303733]
            bg-[#111312]
            transform transition-transform duration-200
            ${
              mobileSidebar
                ? "translate-x-0"
                : "-translate-x-full lg:translate-x-0"
            }
          `}
        >
          <div className="h-full flex flex-col">
            <div className="p-4 border-b border-[#303733]">
              <p className="text-xs uppercase tracking-wider text-[#6F7973] mb-3">
                Current spreadsheet
              </p>

              <div className="rounded-xl border border-[#303733] bg-[#191C1A] p-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#2F6B4F]/20 flex items-center justify-center">
                    <FileSpreadsheet
                      size={21}
                      className="text-[#A9C7B4]"
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">
                      {fileName ||
                        "No spreadsheet uploaded"}
                    </p>

                    <p className="text-xs text-[#6F7973] mt-1">
                      {file
                        ? `${(
                            file.size / 1024
                          ).toFixed(1)} KB`
                        : "Upload a file to begin"}
                    </p>
                  </div>
                </div>

                {file && (
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <div className="bg-[#111312] rounded-lg p-2">
                      <p className="text-[11px] text-[#6F7973]">
                        Sheets
                      </p>
                      <p className="text-sm font-semibold mt-1">
                        {Object.keys(sheets).length}
                      </p>
                    </div>

                    <div className="bg-[#111312] rounded-lg p-2">
                      <p className="text-[11px] text-[#6F7973]">
                        Columns
                      </p>

                      <p className="text-sm font-semibold mt-1">
                        {selectedSheet
                          ? sheets[selectedSheet]
                              ?.columnCount || 0
                          : 0}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* SHEETS */}

            <div className="flex-1 overflow-y-auto p-4">
              <p className="text-xs uppercase tracking-wider text-[#6F7973] mb-3">
                Sheets
              </p>

              <div className="space-y-1">
                {Object.keys(sheets).map(
                  (sheetName) => (
                    <button
                      key={sheetName}
                      onClick={() =>
                        setSelectedSheet(sheetName)
                      }
                      className={`
                        w-full flex items-center justify-between
                        px-3 py-2.5 rounded-lg text-sm
                        transition
                        ${
                          selectedSheet ===
                          sheetName
                            ? "bg-[#2F6B4F]/20 text-[#A9C7B4]"
                            : "text-[#929A94] hover:bg-[#191C1A] hover:text-[#F5F3ED]"
                        }
                      `}
                    >
                      <span className="flex items-center gap-2">
                        <Table2 size={16} />
                        {sheetName}
                      </span>

                      <span className="text-xs text-[#6F7973]">
                        {sheets[sheetName].rowCount}
                      </span>
                    </button>
                  )
                )}
              </div>
            </div>

            {/* UPLOAD */}

            <div className="p-4 border-t border-[#303733]">
              <label className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-[#3A815D] bg-[#2F6B4F]/10 text-sm text-[#A9C7B4] hover:bg-[#2F6B4F]/20 cursor-pointer transition">
                <Upload size={17} />

                {uploading
                  ? "Reading spreadsheet..."
                  : "Upload another file"}

                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <div className="flex gap-2 mt-3 text-xs text-[#6F7973]">
                <Sparkles
                  size={14}
                  className="text-[#F2A07B] shrink-0"
                />

                <p>
                  Ask questions about your data.
                  MoxcelAI will analyze it without
                  changing your file.
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN CHAT */}

        <section className="flex-1 min-w-0 flex flex-col">
          {/* CHAT HEADER */}

          <div className="h-16 border-b border-[#303733] flex items-center justify-between px-4 md:px-8">
            <div>
              <h1 className="font-semibold">
                MoxcelAI Chat
              </h1>

              <p className="text-xs text-[#6F7973] mt-0.5">
                {fileName
                  ? `Analyzing ${fileName}`
                  : "Upload a spreadsheet to start"}
              </p>
            </div>

            {selectedSheet && (
              <button className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg border border-[#303733] bg-[#191C1A] text-sm">
                <Table2 size={15} />

                {selectedSheet}

                <ChevronDown size={14} />
              </button>
            )}
          </div>

          {/* MESSAGES */}

          <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
              {!file && messages.length === 0 && (
                <div className="flex flex-col items-center justify-center min-h-[55vh] text-center">
                  <div className="w-16 h-16 rounded-2xl bg-[#F2A07B]/10 border border-[#F2A07B]/20 flex items-center justify-center mb-5">
                    <Bot
                      size={30}
                      className="text-[#F2A07B]"
                    />
                  </div>

                  <h2 className="text-2xl font-semibold">
                    Ask your spreadsheet
                  </h2>

                  <p className="text-[#929A94] max-w-md mt-3">
                    Upload an Excel file and ask
                    questions about your data. I can
                    calculate values, find trends,
                    summarize sheets, and generate
                    insights.
                  </p>

                  <label className="mt-6 flex items-center gap-2 px-5 py-3 rounded-xl bg-[#2F6B4F] hover:bg-[#3A815D] cursor-pointer font-medium transition">
                    <Upload size={18} />
                    Upload Excel file

                    <input
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              )}

              <div className="space-y-6">
                {messages.map((item) => (
                  <div
                    key={item.id}
                    className={`flex gap-3 ${
                      item.type === "user"
                        ? "justify-end"
                        : ""
                    }`}
                  >
                    {item.type === "ai" && (
                      <div className="w-9 h-9 rounded-xl bg-[#F2A07B]/10 border border-[#F2A07B]/20 flex items-center justify-center shrink-0">
                        <Sparkles
                          size={17}
                          className="text-[#F2A07B]"
                        />
                      </div>
                    )}

                    <div
                      className={`
                        max-w-[85%]
                        ${
                          item.type === "user"
                            ? "bg-[#2F6B4F] rounded-2xl rounded-tr-md px-4 py-3"
                            : "bg-[#191C1A] border border-[#303733] rounded-2xl rounded-tl-md px-5 py-4"
                        }
                      `}
                    >
                      <div className="whitespace-pre-wrap text-sm leading-7">
                        {item.text}
                      </div>

                      {item.source && (
                        <div className="mt-4 pt-3 border-t border-[#303733] flex items-center justify-between gap-3">
                          <p className="text-xs text-[#6F7973]">
                            {item.source}
                          </p>

                          <button
                            onClick={() =>
                              copyAnswer(
                                item.text,
                                item.id
                              )
                            }
                            className="text-[#929A94] hover:text-[#F5F3ED]"
                          >
                            {copied === item.id ? (
                              <Check size={15} />
                            ) : (
                              <Copy size={15} />
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {sending && (
                  <div className="flex gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#F2A07B]/10 border border-[#F2A07B]/20 flex items-center justify-center">
                      <Sparkles
                        size={17}
                        className="text-[#F2A07B]"
                      />
                    </div>

                    <div className="bg-[#191C1A] border border-[#303733] rounded-2xl rounded-tl-md px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-[#F2A07B] rounded-full animate-bounce" />
                        <span className="w-2 h-2 bg-[#F2A07B] rounded-full animate-bounce [animation-delay:150ms]" />
                        <span className="w-2 h-2 bg-[#F2A07B] rounded-full animate-bounce [animation-delay:300ms]" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* SUGGESTIONS */}

              {file && messages.length <= 1 && (
                <div className="mt-8">
                  <p className="text-xs text-[#6F7973] mb-3">
                    Try asking
                  </p>

                  <div className="grid sm:grid-cols-2 gap-2">
                    {[
                      "Summarize this spreadsheet",
                      "What is the total sales?",
                      "How many rows are there?",
                      "Give me the details of column 5",
                      "Which product has the highest sales?",
                      "Are there any missing values?",
                    ].map((question) => (
                      <button
                        key={question}
                        onClick={() =>
                          askSuggestedQuestion(
                            question
                          )
                        }
                        className="text-left px-4 py-3 rounded-xl border border-[#303733] bg-[#191C1A] hover:border-[#3A815D] hover:bg-[#2F6B4F]/10 text-sm text-[#929A94] hover:text-[#F5F3ED] transition"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* INPUT */}

          <div className="border-t border-[#303733] p-4 md:p-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-end gap-2 bg-[#191C1A] border border-[#303733] rounded-2xl p-2 focus-within:border-[#3A815D] transition">
                <label className="p-2.5 text-[#6F7973] hover:text-[#A9C7B4] cursor-pointer">
                  <Paperclip size={19} />

                  <input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                <textarea
                  value={message}
                  onChange={(e) =>
                    setMessage(e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (
                      e.key === "Enter" &&
                      !e.shiftKey
                    ) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  rows={1}
                  placeholder={
                    workbookId
                      ? "Ask anything about your spreadsheet..."
                      : "Upload a spreadsheet first..."
                  }
                  disabled={!workbookId || sending}
                  className="flex-1 bg-transparent outline-none resize-none text-sm text-[#F5F3ED] placeholder:text-[#6F7973] py-2.5"
                />

                <button
                  onClick={sendMessage}
                  disabled={
                    !message.trim() ||
                    !workbookId ||
                    sending
                  }
                  className="w-10 h-10 rounded-xl bg-[#2F6B4F] hover:bg-[#3A815D] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition"
                >
                  <Send size={17} />
                </button>
              </div>

              <p className="text-center text-[11px] text-[#6F7973] mt-3">
                MoxcelAI analyzes your spreadsheet
                without modifying it.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}