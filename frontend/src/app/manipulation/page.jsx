
"use client";

import { useEffect, useRef, useState } from "react";
import {
  Upload,
  FileSpreadsheet,
  Sparkles,
  Download,
  X,
  CheckCircle2,
  AlertCircle,
  LoaderCircle,
  ArrowRight,
  RotateCcw,
} from "lucide-react";

const API_URL = "http://localhost:5000/api/manipulation";

export default function ManipulationPage() {
  const [file, setFile] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [changes, setChanges] = useState([]);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [downloadName, setDownloadName] = useState("");

  const inputRef = useRef(null);
  const dragCounter = useRef(0);
  const [dragging, setDragging] = useState(false);

  // Clean up the generated download URL when it is replaced
  // or when the component is removed.
  useEffect(() => {
    return () => {
      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl);
      }
    };
  }, [downloadUrl]);

  function clearResult() {
    setSuccess(false);
    setChanges([]);
    setError("");
    setDownloadUrl("");
    setDownloadName("");
  }

  function handleFile(selectedFile) {
    if (!selectedFile) return;

    const isExcel =
      selectedFile.name.toLowerCase().endsWith(".xlsx") ||
      selectedFile.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

    if (!isExcel) {
      setError("Please upload an Excel file in .xlsx format.");
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10 MB.");
      return;
    }

    setFile(selectedFile);
    clearResult();
  }

  function removeFile() {
    setFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    clearResult();
  }

  function handleDragEnter(event) {
    event.preventDefault();
    dragCounter.current += 1;
    setDragging(true);
  }

  function handleDragLeave(event) {
    event.preventDefault();
    dragCounter.current -= 1;

    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setDragging(false);
    }
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDrop(event) {
    event.preventDefault();
    dragCounter.current = 0;
    setDragging(false);

    const droppedFile = event.dataTransfer.files?.[0];

    if (droppedFile) {
      handleFile(droppedFile);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!file) {
      setError("Please upload an Excel file first.");
      return;
    }

    if (!prompt.trim()) {
      setError("Please enter an instruction for MoxcelAI.");
      return;
    }

    setLoading(true);
    setError("");
    clearResult();

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("prompt", prompt.trim());

      const response = await fetch(`${API_URL}/manipulate`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let message = "Unable to process the Excel file.";

        try {
          const data = await response.json();
          message = data.message || data.error || message;
        } catch {
          // Keep the default message if the response is not JSON.
        }

        throw new Error(message);
      }

      const blob = await response.blob();

      if (blob.size === 0) {
        throw new Error("The server returned an empty Excel file.");
      }

      const objectUrl = URL.createObjectURL(blob);

      // Save the file URL for the manual Download button.
      // No automatic download happens here.
      setDownloadUrl(objectUrl);

      const disposition = response.headers.get("Content-Disposition");
      let outputName = `MoxcelAI_${file.name}`;

      if (disposition) {
        const match = disposition.match(
          /filename\*?=(?:UTF-8''|")?([^";\n]*)/i
        );

        if (match?.[1]) {
          try {
            outputName = decodeURIComponent(
              match[1].replace(/"/g, "").trim()
            );
          } catch {
            outputName = match[1].replace(/"/g, "").trim();
          }
        }
      }

      if (!outputName.toLowerCase().endsWith(".xlsx")) {
        outputName += ".xlsx";
      }

      setDownloadName(outputName);

      // Read the list of changes reported by the backend.
      const changesHeader = response.headers.get("X-Moxcel-Changes");

      if (changesHeader) {
        try {
          const decoded = atob(changesHeader);
          const bytes = Uint8Array.from(
            decoded,
            (character) => character.charCodeAt(0)
          );
          const parsed = JSON.parse(
            new TextDecoder().decode(bytes)
          );

          setChanges(Array.isArray(parsed) ? parsed : []);
        } catch {
          setChanges([]);
        }
      }

      setSuccess(true);
    } catch (err) {
      setError(
        err.message ||
          "Something went wrong. Please check your backend server."
      );
    } finally {
      setLoading(false);
    }
  }

  function downloadExcel() {
    if (!downloadUrl) return;

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = downloadName || "MoxcelAI_edited.xlsx";

    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  const examples = [
    "Make the header dark green with white bold text.",
    "Remove duplicate rows from the spreadsheet.",
    "Sort all rows by the Salary column in descending order.",
    "Add a Total column that calculates the sum of Price and Tax.",
    "Convert all names in the Name column to uppercase.",
    "Highlight values greater than 5000.",
  ];

  return (
    <main className="min-h-screen bg-[#111312] px-4 py-8 text-[#F5F3ED] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-5xl">
        {/* Page heading */}
        <div className="mb-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#2F6B4F]/50 bg-[#2F6B4F]/15 px-4 py-2 text-sm text-[#A9D4B8]">
            <Sparkles size={16} />
            <span>AI-powered spreadsheet editing</span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
            Excel{" "}
            <span className="text-[#F2A07B]">Manipulation</span>
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#929A94] sm:text-base">
            Upload your Excel workbook, describe what you want in
            plain English, and let MoxcelAI transform your spreadsheet.
            Review the result and download it when you are ready.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Upload section */}
          <section className="rounded-2xl border border-white/[0.08] bg-[#191C1A] p-5 sm:p-7">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2F6B4F]/20 text-[#8BC7A1]">
                <FileSpreadsheet size={21} />
              </div>

              <div>
                <h2 className="font-semibold">Upload your workbook</h2>
                <p className="mt-1 text-sm text-[#929A94]">
                  Excel .xlsx files · Maximum 10 MB
                </p>
              </div>
            </div>

            {!file ? (
              <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`rounded-xl border-2 border-dashed p-8 text-center transition sm:p-12 ${
                  dragging
                    ? "border-[#F2A07B] bg-[#F2A07B]/10"
                    : "border-white/15 hover:border-[#2F6B4F] hover:bg-white/[0.02]"
                }`}
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2F6B4F]/20 text-[#8BC7A1]">
                  <Upload size={27} />
                </div>

                <h3 className="font-medium">
                  Drop your Excel file here
                </h3>

                <p className="mt-2 text-sm text-[#929A94]">
                  or browse files from your computer
                </p>

                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="mt-5 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-medium transition hover:bg-white/[0.08]"
                >
                  Choose Excel file
                </button>

                <input
                  ref={inputRef}
                  type="file"
                  accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  className="hidden"
                  onChange={(event) =>
                    handleFile(event.target.files?.[0])
                  }
                />
              </div>
            ) : (
              <div className="flex items-center gap-4 rounded-xl border border-[#2F6B4F]/40 bg-[#2F6B4F]/10 p-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#2F6B4F]/25 text-[#A9D4B8]">
                  <FileSpreadsheet size={24} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{file.name}</p>
                  <p className="mt-1 text-xs text-[#929A94]">
                    {(file.size / 1024).toFixed(1)} KB · Ready to process
                  </p>
                </div>

                <button
                  type="button"
                  onClick={removeFile}
                  aria-label="Remove uploaded file"
                  className="rounded-lg p-2 text-[#929A94] transition hover:bg-white/10 hover:text-white"
                >
                  <X size={19} />
                </button>
              </div>
            )}
          </section>

          {/* Prompt section */}
          <section className="rounded-2xl border border-white/[0.08] bg-[#191C1A] p-5 sm:p-7">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F2A07B]/10 text-[#F2A07B]">
                <Sparkles size={21} />
              </div>

              <div>
                <h2 className="font-semibold">Describe your changes</h2>
                <p className="mt-1 text-sm text-[#929A94]">
                  Tell the AI what to do using ordinary English.
                </p>
              </div>
            </div>

            <textarea
              value={prompt}
              onChange={(event) => {
                setPrompt(event.target.value);
                setError("");
              }}
              placeholder="Example: Remove duplicate rows, sort by Total Sales from highest to lowest, and format the header with a dark green background..."
              rows={5}
              className="w-full resize-y rounded-xl border border-white/10 bg-[#111312] p-4 text-sm leading-7 text-[#F5F3ED] outline-none transition placeholder:text-[#626A64] focus:border-[#2F6B4F] focus:ring-2 focus:ring-[#2F6B4F]/20"
            />

            <div className="mt-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#929A94]">
                Try an example
              </p>

              <div className="flex flex-wrap gap-2">
                {examples.map((example) => (
                  <button
                    key={example}
                    type="button"
                    onClick={() => {
                      setPrompt(example);
                      setError("");
                    }}
                    className="rounded-lg border border-white/[0.08] bg-white/[0.025] px-3 py-2 text-left text-xs leading-5 text-[#C4CAC5] transition hover:border-[#2F6B4F]/70 hover:bg-[#2F6B4F]/10 hover:text-white"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Error message */}
          {error && (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-xl border border-red-500/25 bg-red-500/[0.08] p-4 text-sm text-red-300"
            >
              <AlertCircle size={19} className="mt-0.5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading || !file || !prompt.trim()}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#2F6B4F] px-6 py-4 font-semibold text-white transition hover:bg-[#3A815D] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <LoaderCircle size={20} className="animate-spin" />
                Processing your workbook...
              </>
            ) : (
              <>
                <Sparkles size={20} />
                Manipulate Excel with AI
                <ArrowRight size={19} />
              </>
            )}
          </button>
        </form>

        {/* Success result */}
        {success && (
          <section className="mt-8 rounded-2xl border border-[#2F6B4F]/40 bg-[#191C1A] p-5 sm:p-7">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#2F6B4F]/20 text-[#8BC7A1]">
                <CheckCircle2 size={24} />
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-semibold">
                  Your spreadsheet is ready!
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#929A94]">
                  MoxcelAI has finished processing your workbook.
                  Your original file has not been downloaded or
                  overwritten. Click the button below when you want
                  to save the modified Excel file.
                </p>

                {changes.length > 0 && (
                  <div className="mt-5">
                    <p className="mb-3 text-sm font-semibold text-[#F5F3ED]">
                      Changes reported
                    </p>

                    <ul className="space-y-2">
                      {changes.map((change, index) => (
                        <li
                          key={`${index}-${String(change)}`}
                          className="flex items-start gap-2 text-sm text-[#C4CAC5]"
                        >
                          <CheckCircle2
                            size={16}
                            className="mt-0.5 shrink-0 text-[#8BC7A1]"
                          />
                          <span>
                            {typeof change === "string"
                              ? change
                              : change.description ||
                                change.message ||
                                JSON.stringify(change)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Manual download: only downloads after user clicks */}
                {downloadUrl && (
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={downloadExcel}
                      className="flex items-center justify-center gap-2 rounded-xl bg-[#2F6B4F] px-6 py-3.5 font-semibold text-white transition hover:bg-[#3A815D]"
                    >
                      <Download size={19} />
                      Download Excel
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        clearResult();
                      }}
                      className="flex items-center justify-center gap-2 rounded-xl border border-white/10 px-5 py-3.5 text-sm font-medium text-[#C4CAC5] transition hover:bg-white/[0.05]"
                    >
                      <RotateCcw size={17} />
                      Start again
                    </button>
                  </div>
                )}

                {downloadName && (
                  <p className="mt-3 break-all text-xs text-[#929A94]">
                    File: {downloadName}
                  </p>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Footer */}
        <div className="mt-10 border-t border-white/[0.07] pt-5 text-center">
          <p className="text-xs text-[#626A64]">
            Powered by MoxcelAI · Your spreadsheet, your instructions
          </p>
        </div>
      </div>
    </main>
  );
}
