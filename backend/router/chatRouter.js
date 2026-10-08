const express = require("express");
const multer = require("multer");
const XLSX = require("xlsx");
const { GoogleGenAI } = require("@google/genai");
const {
  isCloudinaryConfigured,
  uploadBufferToCloudinary,
} = require("../config/cloudinary");

const router = express.Router();

// --------------------------------------------------
// FILE UPLOAD
// --------------------------------------------------

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
});

// --------------------------------------------------
// GEMINI
// --------------------------------------------------

if (!process.env.GEMINI_API_KEY) {
  console.warn("WARNING: GEMINI_API_KEY is not set in .env");
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const GEMINI_MODEL = "gemini-3.8-flash";

// --------------------------------------------------
// TEMPORARY WORKBOOK STORAGE
// --------------------------------------------------

const workbooks = new Map();

// --------------------------------------------------
// HELPER FUNCTIONS
// --------------------------------------------------

function getColumnStats(rows, columnName) {
  const values = rows
    .map((row) => row[columnName])
    .filter(
      (value) =>
        value !== "" &&
        value !== null &&
        value !== undefined
    );

  const numericValues = values
    .map((value) => Number(value))
    .filter((value) => !Number.isNaN(value));

  const stats = {
    column: columnName,
    totalValues: values.length,
    emptyValues: rows.length - values.length,
  };

  if (numericValues.length > 0) {
    const sum = numericValues.reduce((a, b) => a + b, 0);

    stats.numeric = true;
    stats.sum = sum;
    stats.average = sum / numericValues.length;
    stats.minimum = Math.min(...numericValues);
    stats.maximum = Math.max(...numericValues);
  } else {
    stats.numeric = false;

    const uniqueValues = [...new Set(values.map(String))];

    stats.uniqueValues = uniqueValues.length;
    stats.sampleValues = uniqueValues.slice(0, 10);
  }

  return stats;
}

// --------------------------------------------------
// GET WORKBOOK SUMMARY
// --------------------------------------------------

function getWorkbookSummary(workbook) {
  const sheets = {};

  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];

    const rows = XLSX.utils.sheet_to_json(sheet, {
      defval: "",
    });

    const columns =
      rows.length > 0 ? Object.keys(rows[0]) : [];

    sheets[sheetName] = {
      sheetName,
      rowCount: rows.length,
      columnCount: columns.length,
      columns,
    };
  }

  return sheets;
}

// --------------------------------------------------
// UPLOAD EXCEL
// --------------------------------------------------

router.post(
  "/upload",
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please upload an Excel file.",
        });
      }

      // Upload file to Cloudinary if configured
      let cloudinaryResult = null;
      if (isCloudinaryConfigured()) {
        try {
          cloudinaryResult = await uploadBufferToCloudinary(req.file.buffer, {
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            folder: "moxcel/chat_uploads",
          });
          console.log("[Cloudinary] Uploaded chat file:", cloudinaryResult.secure_url);
        } catch (cloudErr) {
          console.warn("[Cloudinary] Upload failed, proceeding with local parsing:", cloudErr.message);
        }
      }

      const workbook = XLSX.read(req.file.buffer, {
        type: "buffer",
        cellDates: true,
      });

      const workbookId =
        Date.now().toString() +
        "-" +
        Math.random().toString(36).substring(2, 9);

      const sheets = {};

      for (const sheetName of workbook.SheetNames) {
        const worksheet = workbook.Sheets[sheetName];

        const rows = XLSX.utils.sheet_to_json(worksheet, {
          defval: "",
        });

        sheets[sheetName] = {
          rows,
          columns:
            rows.length > 0
              ? Object.keys(rows[0])
              : [],
        };
      }

      const workbookData = {
        id: workbookId,
        fileName: req.file.originalname,
        fileUrl: cloudinaryResult?.secure_url || null,
        cloudinaryPublicId: cloudinaryResult?.public_id || null,
        sheets,
        createdAt: new Date(),
      };

      workbooks.set(workbookId, workbookData);

      const summary = getWorkbookSummary(workbook);

      return res.json({
        success: true,
        workbookId,
        fileName: req.file.originalname,
        fileUrl: cloudinaryResult?.secure_url || null,
        cloudinaryPublicId: cloudinaryResult?.public_id || null,
        sheets: summary,
      });
    } catch (error) {
      console.error("Excel upload error:", error);

      return res.status(500).json({
        success: false,
        message:
          error.message || "Could not read the Excel file.",
      });
    }
  }
);

// --------------------------------------------------
// GET WORKBOOK INFORMATION
// --------------------------------------------------

router.get("/workbook/:workbookId", (req, res) => {
  try {
    const workbook = workbooks.get(
      req.params.workbookId
    );

    if (!workbook) {
      return res.status(404).json({
        success: false,
        message: "Workbook not found.",
      });
    }

    const sheets = {};

    Object.entries(workbook.sheets).forEach(
      ([sheetName, sheetData]) => {
        sheets[sheetName] = {
          columns: sheetData.columns,
          rowCount: sheetData.rows.length,
          columnCount: sheetData.columns.length,
        };
      }
    );

    return res.json({
      success: true,
      fileName: workbook.fileName,
      fileUrl: workbook.fileUrl || null,
      cloudinaryPublicId: workbook.cloudinaryPublicId || null,
      sheets,
    });
  } catch (error) {
    console.error("Workbook information error:", error);

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Could not get workbook information.",
    });
  }
});

// --------------------------------------------------
// ASK QUESTION
// --------------------------------------------------

router.post("/ask", async (req, res) => {
  try {
    const {
      workbookId,
      question,
      sheetName,
    } = req.body;

    // ----------------------------------------------
    // VALIDATION
    // ----------------------------------------------

    if (!workbookId) {
      return res.status(400).json({
        success: false,
        message: "Workbook ID is required.",
      });
    }

    if (!question || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please enter a question.",
      });
    }

    // ----------------------------------------------
    // GET WORKBOOK
    // ----------------------------------------------

    const workbook = workbooks.get(workbookId);

    if (!workbook) {
      return res.status(404).json({
        success: false,
        message:
          "Workbook not found. Please upload it again.",
      });
    }

    // ----------------------------------------------
    // SELECT SHEET
    // ----------------------------------------------

    let selectedSheetName = sheetName;

    if (!selectedSheetName) {
      selectedSheetName =
        Object.keys(workbook.sheets)[0];
    }

    if (!workbook.sheets[selectedSheetName]) {
      return res.status(404).json({
        success: false,
        message:
          `Sheet "${selectedSheetName}" was not found.`,
      });
    }

    const selectedSheet =
      workbook.sheets[selectedSheetName];

    const rows = selectedSheet.rows;
    const columns = selectedSheet.columns;

    const lowerQuestion =
      question.toLowerCase().trim();

    // ----------------------------------------------
    // BASIC QUESTIONS
    // These DO NOT need Gemini.
    // ----------------------------------------------

    // ROW COUNT
    if (
      lowerQuestion.includes("how many rows") ||
      lowerQuestion.includes("number of rows") ||
      lowerQuestion.includes("row count") ||
      lowerQuestion.includes("total rows")
    ) {
      return res.json({
        success: true,
        answer:
          `The "${selectedSheetName}" sheet contains ${rows.length} rows.`,
        source: {
          file: workbook.fileName,
          sheet: selectedSheetName,
          rows: rows.length,
          columns: columns.length,
        },
      });
    }

    // COLUMN COUNT
    if (
      lowerQuestion.includes("how many columns") ||
      lowerQuestion.includes("number of columns") ||
      lowerQuestion.includes("column count") ||
      lowerQuestion.includes("total columns")
    ) {
      return res.json({
        success: true,
        answer:
          `The "${selectedSheetName}" sheet contains ${columns.length} columns.`,
        source: {
          file: workbook.fileName,
          sheet: selectedSheetName,
          rows: rows.length,
          columns: columns.length,
        },
      });
    }

    // COLUMN NAMES
    if (
      lowerQuestion.includes("column names") ||
      lowerQuestion.includes("names of columns") ||
      lowerQuestion.includes("what are the columns")
    ) {
      const answer = columns
        .map(
          (column, index) =>
            `${index + 1}. ${column}`
        )
        .join("\n");

      return res.json({
        success: true,
        answer: `The columns are:\n\n${answer}`,
        source: {
          file: workbook.fileName,
          sheet: selectedSheetName,
          rows: rows.length,
          columns: columns.length,
        },
      });
    }

    // SHEET COUNT
    if (
      lowerQuestion.includes("how many sheets") ||
      lowerQuestion.includes("number of sheets")
    ) {
      const sheetNames =
        Object.keys(workbook.sheets);

      return res.json({
        success: true,
        answer:
          `The workbook contains ${sheetNames.length} sheet(s):\n\n` +
          sheetNames
            .map(
              (sheet, index) =>
                `${index + 1}. ${sheet}`
            )
            .join("\n"),
        source: {
          file: workbook.fileName,
          sheet: selectedSheetName,
          rows: rows.length,
          columns: columns.length,
        },
      });
    }

    // ----------------------------------------------
    // COLUMN NUMBER QUESTION
    // Example:
    // "give me details of column 5"
    // ----------------------------------------------

    const columnNumberMatch =
      lowerQuestion.match(/column\s*(\d+)/);

    if (columnNumberMatch) {
      const columnNumber = parseInt(
        columnNumberMatch[1],
        10
      );

      if (
        columnNumber < 1 ||
        columnNumber > columns.length
      ) {
        return res.json({
          success: true,
          answer:
            `Column ${columnNumber} does not exist. ` +
            `This sheet has ${columns.length} columns.`,
          source: {
            file: workbook.fileName,
            sheet: selectedSheetName,
            rows: rows.length,
            columns: columns.length,
          },
        });
      }

      const columnName =
        columns[columnNumber - 1];

      const stats = getColumnStats(
        rows,
        columnName
      );

      return res.json({
        success: true,
        answer:
          `Column ${columnNumber} is "${columnName}".\n\n` +
          `Total values: ${stats.totalValues}\n` +
          `Empty values: ${stats.emptyValues}\n` +
          (stats.numeric
            ? `Sum: ${stats.sum}\nAverage: ${stats.average.toFixed(
                2
              )}\nMinimum: ${stats.minimum}\nMaximum: ${stats.maximum}`
            : `Unique values: ${stats.uniqueValues}\nSample values: ${stats.sampleValues.join(
                ", "
              )}`),
        source: {
          file: workbook.fileName,
          sheet: selectedSheetName,
          rows: rows.length,
          columns: columns.length,
        },
      });
    }

    // ----------------------------------------------
    // FIND COLUMN BY NAME
    // ----------------------------------------------

    let matchedColumn = null;

    for (const column of columns) {
      if (
        lowerQuestion.includes(
          column.toLowerCase()
        )
      ) {
        matchedColumn = column;
        break;
      }
    }

    let calculatedInformation = "";

    if (matchedColumn) {
      const stats = getColumnStats(
        rows,
        matchedColumn
      );

      calculatedInformation = `
COLUMN: ${matchedColumn}

Total values: ${stats.totalValues}
Empty values: ${stats.emptyValues}
Numeric: ${stats.numeric}
${stats.numeric
  ? `
Sum: ${stats.sum}
Average: ${stats.average}
Minimum: ${stats.minimum}
Maximum: ${stats.maximum}
`
  : `
Unique values: ${stats.uniqueValues}
Sample values: ${stats.sampleValues.join(", ")}
`}
`;
    }

    // ----------------------------------------------
    // SEND DATA TO GEMINI
    // ----------------------------------------------

    const sampleRows = rows.slice(0, 200);

    const prompt = `
You are MoxcelAI, an AI spreadsheet analysis assistant.

IMPORTANT RULES:

1. You are READ-ONLY.
2. Never modify the spreadsheet.
3. Never invent numerical results.
4. Use calculated information from the backend whenever provided.
5. Only answer using the spreadsheet data supplied below.
6. If the data is insufficient, say that clearly.
7. Do not pretend that you performed an operation that you did not perform.
8. Answer clearly and concisely.
9. Use bullet points or tables when useful.
10. The user wants analysis and insights, NOT spreadsheet manipulation.

FILE:
${workbook.fileName}

CURRENT SHEET:
${selectedSheetName}

COLUMNS:
${columns.join(", ")}

ROW COUNT:
${rows.length}

COLUMN COUNT:
${columns.length}

CALCULATED INFORMATION:
${
  calculatedInformation ||
  "No special calculation was performed."
}

SAMPLE DATA:
${JSON.stringify(sampleRows, null, 2)}

USER QUESTION:
${question}

Give the best possible answer based ONLY on the spreadsheet information above.
`;

    // ----------------------------------------------
    // GEMINI REQUEST
    // ----------------------------------------------

    const result =
      await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
      });

    const answer =
      result.text ||
      "I could not generate an answer.";

    // ----------------------------------------------
    // RESPONSE
    // ----------------------------------------------

    return res.json({
      success: true,
      answer,
      source: {
        file: workbook.fileName,
        sheet: selectedSheetName,
        rows: rows.length,
        columns: columns.length,
      },
    });
  } catch (error) {
    console.error(
      "CHAT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Something went wrong while analyzing the spreadsheet.",
    });
  }
});

// --------------------------------------------------
// EXPORT ROUTER
// --------------------------------------------------

module.exports = router;