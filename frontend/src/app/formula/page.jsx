"use client";

import { useState, useRef } from "react";
import {
  ArrowLeft,
  Upload,
  FileSpreadsheet,
  Sparkles,
  WandSparkles,
  Download,
  Copy,
  Check,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  FileUp,
  Calculator,
} from "lucide-react";


// =====================================================
// BACKEND URL
// =====================================================

const API_URL = "http://localhost:5000";


// =====================================================
// EXAMPLE PROMPTS
// These are only instructions.
// They are NOT fake spreadsheet data.
// =====================================================

const examplePrompts = [
  "Calculate the total sales.",
  "Calculate the average of the sales column.",
  "Find the highest sales value.",
  "Find the lowest sales value.",
  "Count the number of products.",
  "Calculate the total profit.",
];


// =====================================================
// COMPONENT
// =====================================================

export default function FormulaPage() {

  // ===================================================
  // STATES
  // ===================================================

  const [file, setFile] =
    useState(null);

  const [instruction, setInstruction] =
    useState("");

  const [isProcessing, setIsProcessing] =
    useState(false);

  const [result, setResult] =
    useState(null);

  const [error, setError] =
    useState("");

  const [copied, setCopied] =
    useState(false);

  const fileInputRef =
    useRef(null);


  // ===================================================
  // FILE SELECT
  // ===================================================

  const handleFileChange = (event) => {

    const selectedFile =
      event.target.files?.[0];

    if (!selectedFile) {
      return;
    }


    // Clear previous result/error
    setResult(null);
    setError("");


    // Check extension

    const fileName =
      selectedFile.name.toLowerCase();

    const validFile =
      fileName.endsWith(".xlsx") ||
      fileName.endsWith(".xls");


    if (!validFile) {

      setError(
        "Please select an Excel file (.xlsx or .xls)."
      );

      event.target.value = "";

      return;
    }


    // Check size
    // 10 MB maximum

    const maxSize =
      10 * 1024 * 1024;


    if (
      selectedFile.size >
      maxSize
    ) {

      setError(
        "File size must be less than 10 MB."
      );

      event.target.value = "";

      return;
    }


    setFile(
      selectedFile
    );
  };


  // ===================================================
  // REMOVE FILE
  // ===================================================

  const removeFile = () => {

    setFile(null);
    setResult(null);
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };


  // ===================================================
  // OPEN FILE PICKER
  // ===================================================

  const openFilePicker = () => {

    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };


  // ===================================================
  // SELECT EXAMPLE
  // ===================================================

  const selectExample = (text) => {

    setInstruction(text);

    setError("");
  };


  // ===================================================
  // COPY FORMULA
  // ===================================================

  const copyFormula = async () => {

    if (!result?.formula) {
      return;
    }


    try {

      await navigator.clipboard.writeText(
        result.formula
      );

      setCopied(true);


      setTimeout(() => {
        setCopied(false);
      }, 2000);

    } catch (error) {

      console.error(
        "Copy failed:",
        error
      );
    }
  };


  // ===================================================
  // DOWNLOAD MODIFIED EXCEL
  // ===================================================

  const downloadFile = () => {

    if (
      !result?.fileBase64
    ) {
      return;
    }


    try {

      // Convert Base64 → binary

      const binaryString =
        window.atob(
          result.fileBase64
        );


      const length =
        binaryString.length;


      const bytes =
        new Uint8Array(
          length
        );


      for (
        let i = 0;
        i < length;
        i++
      ) {

        bytes[i] =
          binaryString.charCodeAt(i);

      }


      // Create Excel Blob

      const blob =
        new Blob(
          [bytes],
          {
            type:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          }
        );


      // Create temporary URL

      const url =
        window.URL.createObjectURL(
          blob
        );


      // Create download link

      const link =
        document.createElement("a");

      link.href = url;

      link.download =
        result.fileName ||
        "MoxelAI_Updated.xlsx";


      document.body.appendChild(
        link
      );


      link.click();


      // Cleanup

      document.body.removeChild(
        link
      );

      window.URL.revokeObjectURL(
        url
      );

    } catch (error) {

      console.error(
        "Download failed:",
        error
      );

      setError(
        "Unable to download the modified Excel file."
      );
    }
  };


  // ===================================================
  // GENERATE FORMULA + MODIFY EXCEL
  // ===================================================

  const generateFormula =
    async () => {

      // -----------------------------------------------
      // CLEAR OLD DATA
      // -----------------------------------------------

      setError("");
      setResult(null);


      // -----------------------------------------------
      // VALIDATE FILE
      // -----------------------------------------------

      if (!file) {

        setError(
          "Please upload an Excel file first."
        );

        return;
      }


      // -----------------------------------------------
      // VALIDATE INSTRUCTION
      // -----------------------------------------------

      if (
        !instruction.trim()
      ) {

        setError(
          "Please describe what you want MoxelAI to do."
        );

        return;
      }


      // -----------------------------------------------
      // START LOADING
      // -----------------------------------------------

      setIsProcessing(true);


      try {

        // ---------------------------------------------
        // CREATE FORM DATA
        // ---------------------------------------------

        const formData =
          new FormData();


        formData.append(
          "file",
          file
        );


        formData.append(
          "instruction",
          instruction.trim()
        );


        console.log(
          "Sending spreadsheet to MoxelAI..."
        );


        // ---------------------------------------------
        // CALL EXPRESS BACKEND
        // ---------------------------------------------

        const response =
          await fetch(
            `${API_URL}/api/formula`,
            {
              method: "POST",
              body: formData,
            }
          );


        // ---------------------------------------------
        // READ RESPONSE
        // ---------------------------------------------

        const responseText =
          await response.text();


        console.log(
          "Backend response:",
          responseText
        );


        let data;


        try {

          data =
            JSON.parse(
              responseText
            );

        } catch (parseError) {

          console.error(
            "JSON parsing failed:",
            parseError
          );


          throw new Error(
            "The backend returned an invalid response. Check your backend terminal."
          );
        }


        // ---------------------------------------------
        // CHECK HTTP STATUS
        // ---------------------------------------------

        if (!response.ok) {

          throw new Error(
            data?.error ||
            `Server error: ${response.status}`
          );
        }


        // ---------------------------------------------
        // CHECK SUCCESS
        // ---------------------------------------------

        if (
          !data.success
        ) {

          throw new Error(
            data?.error ||
            "MoxelAI could not process the spreadsheet."
          );
        }


        // ---------------------------------------------
        // SAVE RESULT
        // ---------------------------------------------

        setResult(data);


        console.log(
          "MoxelAI completed successfully."
        );


      } catch (error) {

        console.error(
          "Formula generation error:",
          error
        );


        setError(
          error?.message ||
          "Something went wrong while processing your Excel file."
        );

      } finally {

        setIsProcessing(
          false
        );

      }
    };


  // ===================================================
  // RENDER
  // ===================================================

  return (

    <main
      className="
        min-h-screen
        bg-[#111312]
        text-[#F5F3ED]
      "
    >

      {/* =================================================
          HEADER
      ================================================= */}

      <header
        className="
          sticky
          top-0
          z-50
          border-b
          border-[#303733]
          bg-[#111312]/95
          backdrop-blur-xl
        "
      >

        <div
          className="
            mx-auto
            flex
            h-16
            max-w-7xl
            items-center
            justify-between
            px-6
          "
        >

          {/* Logo */}

          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                bg-[#2F6B4F]
              "
            >

              <FileSpreadsheet
                size={20}
                strokeWidth={1.8}
              />

            </div>


            <div>

              <div
                className="
                  text-lg
                  font-semibold
                  tracking-tight
                "
              >

                Moxel
                <span
                  className="
                    text-[#F2A07B]
                  "
                >
                  AI
                </span>

              </div>


              <div
                className="
                  text-[10px]
                  uppercase
                  tracking-[0.18em]
                  text-[#929A94]
                "
              >
                Intelligent spreadsheets
              </div>

            </div>

          </div>


          {/* Back button */}

          <button
            onClick={() => {
              window.location.href = "/";
            }}
            className="
              flex
              items-center
              gap-2
              rounded-lg
              border
              border-[#303733]
              px-4
              py-2
              text-sm
              text-[#929A94]
              transition
              hover:border-[#3A815D]
              hover:text-[#F5F3ED]
            "
          >

            <ArrowLeft
              size={16}
            />

            Back to home

          </button>

        </div>

      </header>


      {/* =================================================
          PAGE CONTENT
      ================================================= */}

      <section
        className="
          mx-auto
          max-w-7xl
          px-6
          py-12
        "
      >

        {/* =================================================
            PAGE TITLE
        ================================================= */}

        <div
          className="
            mx-auto
            max-w-3xl
            text-center
          "
        >

          <div
            className="
              mx-auto
              mb-5
              flex
              w-fit
              items-center
              gap-2
              rounded-full
              border
              border-[#303733]
              bg-[#191C1A]
              px-4
              py-2
              text-sm
              text-[#929A94]
            "
          >

            <Sparkles
              size={15}
              className="text-[#F2A07B]"
            />

            AI-powered spreadsheet automation

          </div>


          <h1
            className="
              text-4xl
              font-semibold
              tracking-tight
              md:text-5xl
            "
          >

            Make your spreadsheet
            <span
              className="
                block
                text-[#F2A07B]
              "
            >
              smarter with AI.
            </span>

          </h1>


          <p
            className="
              mx-auto
              mt-5
              max-w-2xl
              text-base
              leading-7
              text-[#929A94]
            "
          >

            Upload your real Excel spreadsheet,
            describe what you want to calculate,
            and MoxelAI will generate the formula
            and apply the change to your workbook.

          </p>

        </div>


        {/* =================================================
            MAIN GRID
        ================================================= */}

        <div
          className="
            mx-auto
            mt-12
            grid
            max-w-6xl
            gap-6
            lg:grid-cols-[1.05fr_0.95fr]
          "
        >


          {/* =================================================
              LEFT CARD
          ================================================= */}

          <div
            className="
              rounded-2xl
              border
              border-[#303733]
              bg-[#151816]
              p-6
              shadow-2xl
            "
          >

            {/* Card heading */}

            <div
              className="
                mb-6
                flex
                items-start
                justify-between
              "
            >

              <div>

                <div
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >

                  <WandSparkles
                    size={19}
                    className="text-[#F2A07B]"
                  />

                  <h2
                    className="
                      text-lg
                      font-semibold
                    "
                  >
                    Spreadsheet instruction
                  </h2>

                </div>


                <p
                  className="
                    mt-1
                    text-sm
                    text-[#929A94]
                  "
                >
                  Tell MoxelAI what you want to do.
                </p>

              </div>

            </div>


            {/* =================================================
                INSTRUCTION
            ================================================= */}

            <label
              className="
                mb-2
                block
                text-sm
                font-medium
                text-[#F5F3ED]
              "
            >
              What should MoxelAI do?
            </label>


            <textarea
              value={instruction}
              onChange={(event) =>
                setInstruction(
                  event.target.value
                )
              }
              placeholder="
Example: Calculate the total sales and put the result below the sales data.
              "
              rows={6}
              className="
                w-full
                resize-none
                rounded-xl
                border
                border-[#303733]
                bg-[#111312]
                px-4
                py-4
                text-sm
                leading-6
                text-[#F5F3ED]
                outline-none
                transition
                placeholder:text-[#5F6862]
                focus:border-[#3A815D]
                focus:ring-1
                focus:ring-[#3A815D]
              "
            />


            {/* =================================================
                EXAMPLES
            ================================================= */}

            <div className="mt-4">

              <div
                className="
                  mb-2
                  text-xs
                  font-medium
                  uppercase
                  tracking-wider
                  text-[#929A94]
                "
              >
                Try an instruction
              </div>


              <div
                className="
                  flex
                  flex-wrap
                  gap-2
                "
              >

                {examplePrompts.map(
                  (prompt) => (

                    <button
                      key={prompt}
                      onClick={() =>
                        selectExample(
                          prompt
                        )
                      }
                      className="
                        rounded-lg
                        border
                        border-[#303733]
                        bg-[#191C1A]
                        px-3
                        py-2
                        text-xs
                        text-[#929A94]
                        transition
                        hover:border-[#3A815D]
                        hover:text-[#F5F3ED]
                      "
                    >

                      {prompt}

                    </button>

                  )
                )}

              </div>

            </div>


            {/* =================================================
                FILE UPLOAD
            ================================================= */}

            <div
              className="
                mt-7
              "
            >

              <label
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                "
              >
                Excel spreadsheet
              </label>


              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={
                  handleFileChange
                }
                className="hidden"
              />


              {!file ? (

                <button
                  type="button"
                  onClick={
                    openFilePicker
                  }
                  className="
                    group
                    flex
                    w-full
                    cursor-pointer
                    flex-col
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-dashed
                    border-[#3B453F]
                    bg-[#111312]
                    px-6
                    py-9
                    text-center
                    transition
                    hover:border-[#3A815D]
                    hover:bg-[#191C1A]
                  "
                >

                  <div
                    className="
                      mb-3
                      flex
                      h-12
                      w-12
                      items-center
                      justify-center
                      rounded-xl
                      bg-[#2F6B4F]/20
                      text-[#3A815D]
                      transition
                      group-hover:bg-[#2F6B4F]/30
                    "
                  >

                    <Upload
                      size={22}
                    />

                  </div>


                  <div
                    className="
                      text-sm
                      font-medium
                    "
                  >
                    Click to upload Excel
                  </div>


                  <div
                    className="
                      mt-1
                      text-xs
                      text-[#929A94]
                    "
                  >
                    .xlsx or .xls · Maximum 10 MB
                  </div>

                </button>

              ) : (

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    rounded-xl
                    border
                    border-[#2F6B4F]
                    bg-[#2F6B4F]/10
                    p-4
                  "
                >

                  <div
                    className="
                      flex
                      min-w-0
                      items-center
                      gap-3
                    "
                  >

                    <div
                      className="
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        bg-[#2F6B4F]
                      "
                    >

                      <FileSpreadsheet
                        size={20}
                      />

                    </div>


                    <div
                      className="
                        min-w-0
                      "
                    >

                      <div
                        className="
                          truncate
                          text-sm
                          font-medium
                        "
                      >

                        {file.name}

                      </div>


                      <div
                        className="
                          mt-1
                          text-xs
                          text-[#929A94]
                        "
                      >

                        {(
                          file.size /
                          1024 /
                          1024
                        ).toFixed(2)}
                        {" "}
                        MB

                      </div>

                    </div>

                  </div>


                  <button
                    type="button"
                    onClick={
                      removeFile
                    }
                    className="
                      ml-3
                      rounded-lg
                      p-2
                      text-[#929A94]
                      transition
                      hover:bg-[#303733]
                      hover:text-[#F5F3ED]
                    "
                    title="Remove file"
                  >

                    <X
                      size={18}
                    />

                  </button>

                </div>

              )}

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

              <div
                className="
                  mt-5
                  flex
                  items-start
                  gap-3
                  rounded-xl
                  border
                  border-red-900/60
                  bg-red-950/20
                  p-4
                "
              >

                <AlertCircle
                  size={19}
                  className="
                    mt-0.5
                    shrink-0
                    text-red-400
                  "
                />


                <div
                  className="
                    text-sm
                    leading-6
                    text-red-300
                  "
                >

                  {error}

                </div>

              </div>

            )}


            {/* =================================================
                ACTION BUTTON
            ================================================= */}

            <button
              type="button"
              onClick={
                generateFormula
              }
              disabled={
                isProcessing
              }
              className="
                mt-6
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[#2F6B4F]
                px-5
                py-3.5
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-[#3A815D]
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >

              {isProcessing ? (

                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />

                  MoxelAI is analyzing
                  your spreadsheet...

                </>

              ) : (

                <>
                  <Sparkles
                    size={18}
                  />

                  Generate Formula & Update Excel

                </>

              )}

            </button>


            <div
              className="
                mt-3
                text-center
                text-xs
                text-[#68716B]
              "
            >

              Your spreadsheet is processed by
              the MoxelAI backend.

            </div>

          </div>


          {/* =================================================
              RIGHT CARD
          ================================================= */}

          <div
            className="
              rounded-2xl
              border
              border-[#303733]
              bg-[#151816]
              p-6
            "
          >

            <div
              className="
                flex
                items-center
                gap-2
              "
            >

              <Calculator
                size={19}
                className="text-[#F2A07B]"
              />

              <h2
                className="
                  text-lg
                  font-semibold
                "
              >
                MoxelAI result
              </h2>

            </div>


            <p
              className="
                mt-1
                text-sm
                text-[#929A94]
              "
            >
              Your formula and spreadsheet changes
              will appear here.
            </p>


            {/* =================================================
                EMPTY RESULT
            ================================================= */}

            {!result && !isProcessing && (

              <div
                className="
                  mt-8
                  flex
                  min-h-[380px]
                  flex-col
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-dashed
                  border-[#303733]
                  bg-[#111312]
                  px-6
                  text-center
                "
              >

                <div
                  className="
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-2xl
                    bg-[#191C1A]
                    text-[#929A94]
                  "
                >

                  <WandSparkles
                    size={25}
                  />

                </div>


                <h3
                  className="
                    mt-4
                    text-sm
                    font-medium
                  "
                >
                  Nothing generated yet
                </h3>


                <p
                  className="
                    mt-2
                    max-w-sm
                    text-xs
                    leading-5
                    text-[#68716B]
                  "
                >

                  Upload your Excel file,
                  describe the operation,
                  and MoxelAI will generate
                  and apply the formula.

                </p>

              </div>

            )}


            {/* =================================================
                LOADING
            ================================================= */}

            {isProcessing && (

              <div
                className="
                  mt-8
                  flex
                  min-h-[380px]
                  flex-col
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-[#303733]
                  bg-[#111312]
                "
              >

                <Loader2
                  size={35}
                  className="
                    animate-spin
                    text-[#3A815D]
                  "
                />


                <h3
                  className="
                    mt-5
                    text-sm
                    font-medium
                  "
                >
                  Analyzing your workbook
                </h3>


                <p
                  className="
                    mt-2
                    text-xs
                    text-[#68716B]
                  "
                >
                  Gemini is understanding your request...
                </p>

              </div>

            )}


            {/* =================================================
                RESULT
            ================================================= */}

            {result && !isProcessing && (

              <div
                className="
                  mt-7
                  space-y-4
                "
              >

                {/* Success */}

                <div
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    border
                    border-[#2F6B4F]
                    bg-[#2F6B4F]/10
                    p-4
                  "
                >

                  <CheckCircle2
                    size={20}
                    className="text-[#5EA67B]"
                  />


                  <div>

                    <div
                      className="
                        text-sm
                        font-medium
                      "
                    >
                      Spreadsheet updated
                    </div>


                    <div
                      className="
                        mt-1
                        text-xs
                        text-[#929A94]
                      "
                    >
                      MoxelAI successfully applied
                      the requested formula.
                    </div>

                  </div>

                </div>


                {/* Formula */}

                <div>

                  <div
                    className="
                      mb-2
                      flex
                      items-center
                      justify-between
                    "
                  >

                    <span
                      className="
                        text-xs
                        font-medium
                        uppercase
                        tracking-wider
                        text-[#929A94]
                      "
                    >
                      Generated formula
                    </span>


                    <button
                      type="button"
                      onClick={
                        copyFormula
                      }
                      className="
                        flex
                        items-center
                        gap-1.5
                        rounded-lg
                        px-2.5
                        py-1.5
                        text-xs
                        text-[#929A94]
                        transition
                        hover:bg-[#303733]
                        hover:text-[#F5F3ED]
                      "
                    >

                      {copied ? (

                        <>
                          <Check
                            size={14}
                          />

                          Copied

                        </>

                      ) : (

                        <>
                          <Copy
                            size={14}
                          />

                          Copy

                        </>

                      )}

                    </button>

                  </div>


                  <div
                    className="
                      overflow-x-auto
                      rounded-xl
                      border
                      border-[#303733]
                      bg-[#0D0F0E]
                      p-4
                    "
                  >

                    <code
                      className="
                        text-base
                        font-medium
                        text-[#F2A07B]
                      "
                    >

                      {result.formula}

                    </code>

                  </div>

                </div>


                {/* Sheet + Cell */}

                <div
                  className="
                    grid
                    grid-cols-2
                    gap-3
                  "
                >

                  <div
                    className="
                      rounded-xl
                      border
                      border-[#303733]
                      bg-[#111312]
                      p-4
                    "
                  >

                    <div
                      className="
                        text-[11px]
                        uppercase
                        tracking-wider
                        text-[#68716B]
                      "
                    >
                      Sheet
                    </div>


                    <div
                      className="
                        mt-2
                        truncate
                        text-sm
                        font-medium
                      "
                    >
                      {result.sheet}
                    </div>

                  </div>


                  <div
                    className="
                      rounded-xl
                      border
                      border-[#303733]
                      bg-[#111312]
                      p-4
                    "
                  >

                    <div
                      className="
                        text-[11px]
                        uppercase
                        tracking-wider
                        text-[#68716B]
                      "
                    >
                      Updated cell
                    </div>


                    <div
                      className="
                        mt-2
                        text-sm
                        font-medium
                        text-[#F2A07B]
                      "
                    >
                      {result.targetCell}
                    </div>

                  </div>

                </div>


                {/* Explanation */}

                <div
                  className="
                    rounded-xl
                    border
                    border-[#303733]
                    bg-[#111312]
                    p-4
                  "
                >

                  <div
                    className="
                      text-[11px]
                      uppercase
                      tracking-wider
                      text-[#68716B]
                    "
                  >
                    What MoxelAI did
                  </div>


                  <p
                    className="
                      mt-2
                      text-sm
                      leading-6
                      text-[#929A94]
                    "
                  >

                    {result.explanation}

                  </p>

                </div>


                {/* Download */}

                <button
                  type="button"
                  onClick={
                    downloadFile
                  }
                  className="
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-[#F2A07B]
                    px-5
                    py-3.5
                    text-sm
                    font-semibold
                    text-[#111312]
                    transition
                    hover:bg-[#F5B08F]
                  "
                >

                  <Download
                    size={18}
                  />

                  Download Updated Excel

                </button>

              </div>

            )}

          </div>

        </div>


        {/* =================================================
            HOW IT WORKS
        ================================================= */}

        <div
          className="
            mx-auto
            mt-12
            max-w-6xl
          "
        >

          <div
            className="
              mb-5
              text-center
            "
          >

            <h2
              className="
                text-xl
                font-semibold
              "
            >
              How MoxelAI works
            </h2>

            <p
              className="
                mt-2
                text-sm
                text-[#929A94]
              "
            >
              From your instruction to an updated workbook.
            </p>

          </div>


          <div
            className="
              grid
              gap-4
              md:grid-cols-3
            "
          >

            {/* Step 1 */}

            <div
              className="
                rounded-xl
                border
                border-[#303733]
                bg-[#151816]
                p-5
              "
            >

              <div
                className="
                  mb-4
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-lg
                  bg-[#2F6B4F]
                  text-sm
                  font-semibold
                "
              >
                1
              </div>


              <h3
                className="
                  text-sm
                  font-semibold
                "
              >
                Upload
              </h3>


              <p
                className="
                  mt-2
                  text-xs
                  leading-5
                  text-[#929A94]
                "
              >
                Upload your actual Excel workbook.
                MoxelAI reads its sheets and data structure.
              </p>

            </div>


            {/* Step 2 */}

            <div
              className="
                rounded-xl
                border
                border-[#303733]
                bg-[#151816]
                p-5
              "
            >

              <div
                className="
                  mb-4
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-lg
                  bg-[#2F6B4F]
                  text-sm
                  font-semibold
                "
              >
                2
              </div>


              <h3
                className="
                  text-sm
                  font-semibold
                "
              >
                Describe
              </h3>


              <p
                className="
                  mt-2
                  text-xs
                  leading-5
                  text-[#929A94]
                "
              >
                Tell MoxelAI what you want,
                using normal human language.
              </p>

            </div>


            {/* Step 3 */}

            <div
              className="
                rounded-xl
                border
                border-[#303733]
                bg-[#151816]
                p-5
              "
            >

              <div
                className="
                  mb-4
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-lg
                  bg-[#2F6B4F]
                  text-sm
                  font-semibold
                "
              >
                3
              </div>


              <h3
                className="
                  text-sm
                  font-semibold
                "
              >
                Update
              </h3>


              <p
                className="
                  mt-2
                  text-xs
                  leading-5
                  text-[#929A94]
                "
              >
                Gemini generates the formula,
                MoxelAI applies it, and you download
                the updated workbook.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =================================================
          FOOTER
      ================================================= */}

      <footer
        className="
          border-t
          border-[#303733]
          px-6
          py-7
        "
      >

        <div
          className="
            mx-auto
            flex
            max-w-7xl
            items-center
            justify-between
            text-xs
            text-[#68716B]
          "
        >

          <span>
            © {new Date().getFullYear()} MoxelAI
          </span>


          <span>
            Intelligent spreadsheets
          </span>

        </div>

      </footer>

    </main>
  );
}