const express = require("express");
const multer = require("multer");
const XLSX = require("xlsx");
const { GoogleGenAI } = require("@google/genai");
const {
  isCloudinaryConfigured,
  uploadBufferToCloudinary,
} = require("../config/cloudinary");

const router = express.Router();

/* =========================================================
   GEMINI
========================================================= */

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

/*
  Primary model first, then fallbacks.

  These are current Gemini Flash model IDs.
*/
const GEMINI_MODELS = [
  "gemini-3.8-flash",
  "gemini-3.7-flash",
  "gemini-3.6-flash",
  "gemini-3.5-flash",
];

/* =========================================================
   FILE UPLOAD
========================================================= */

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

/* =========================================================
   BASIC HELPERS
========================================================= */

function isExcelFile(file) {
  if (!file) return false;

  const fileName = file.originalname?.toLowerCase() || "";

  return (
    fileName.endsWith(".xlsx") ||
    fileName.endsWith(".xls")
  );
}

function isValidCell(cell) {
  if (!cell || typeof cell !== "string") {
    return false;
  }

  return /^[A-Z]{1,3}[1-9][0-9]*$/i.test(
    cell.trim()
  );
}

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

function normalizeHeader(value) {
  return normalizeText(value)
    .replace(/[^a-z0-9]/g, "");
}

/* =========================================================
   FORMULA SAFETY
========================================================= */

function isSafeFormula(formula) {
  if (!formula || typeof formula !== "string") {
    return false;
  }

  const cleanFormula = formula.trim();

  if (!cleanFormula.startsWith("=")) {
    return false;
  }

  const upperFormula = cleanFormula.toUpperCase();

  const blockedFunctions = [
    "WEBSERVICE",
    "FILTERXML",
    "HYPERLINK",
    "RTD",
    "CALL",
    "EXEC",
    "SHELL",
  ];

  for (const functionName of blockedFunctions) {
    if (upperFormula.includes(functionName)) {
      return false;
    }
  }

  /*
    Prevent external workbook references.
  */
  if (
    cleanFormula.includes("[") ||
    cleanFormula.includes("]")
  ) {
    return false;
  }

  return true;
}

/* =========================================================
   WORKBOOK INFORMATION
========================================================= */

function getWorksheetRows(worksheet) {
  return XLSX.utils.sheet_to_json(worksheet, {
    header: 1,
    defval: "",
    raw: false,
  });
}

function getWorkbookInfo(workbook) {
  const sheets = [];

  for (const sheetName of workbook.SheetNames) {
    const worksheet = workbook.Sheets[sheetName];

    if (!worksheet) continue;

    const rows = getWorksheetRows(worksheet);

    const range =
      worksheet["!ref"] || "A1:A1";

    const preview = rows
      .slice(0, 15)
      .map((row) => row.slice(0, 20));

    sheets.push({
      sheetName,
      range,
      preview,
    });
  }

  return sheets;
}

/* =========================================================
   HEADER / COLUMN DETECTION
========================================================= */

function getColumns(worksheet) {
  const rows = getWorksheetRows(worksheet);

  if (!rows.length) {
    return [];
  }

  const headerRow = rows[0] || [];

  const columns = [];

  for (let i = 0; i < headerRow.length; i++) {
    const header = String(headerRow[i] || "").trim();

    if (!header) continue;

    const columnLetter =
      XLSX.utils.encode_col(i);

    columns.push({
      index: i,
      letter: columnLetter,
      header,
      normalized: normalizeHeader(header),
    });
  }

  return columns;
}

function findColumn(worksheet, keywords) {
  const columns = getColumns(worksheet);

  const normalizedKeywords = keywords.map(
    normalizeHeader
  );

  /*
    First try exact/contains matching.
  */
  for (const keyword of normalizedKeywords) {
    const found = columns.find((column) => {
      return (
        column.normalized === keyword ||
        column.normalized.includes(keyword) ||
        keyword.includes(column.normalized)
      );
    });

    if (found) {
      return found;
    }
  }

  return null;
}

/* =========================================================
   DATA RANGE
========================================================= */

function getColumnDataRange(
  worksheet,
  columnLetter
) {
  const range = worksheet["!ref"];

  if (!range) {
    return null;
  }

  const decoded =
    XLSX.utils.decode_range(range);

  const startRow = decoded.s.r + 2;
  const endRow = decoded.e.r + 1;

  if (endRow < startRow) {
    return null;
  }

  return `${columnLetter}${startRow}:${columnLetter}${endRow}`;
}

/* =========================================================
   TARGET CELL
========================================================= */

function getDefaultTargetCell(worksheet) {
  const range = worksheet["!ref"];

  if (!range) {
    return "A1";
  }

  const decodedRange =
    XLSX.utils.decode_range(range);

  /*
    Put the result one row below the existing data,
    in the first used column.
  */
  const targetRow =
    decodedRange.e.r + 1;

  const targetColumn =
    decodedRange.s.c;

  return XLSX.utils.encode_cell({
    r: targetRow,
    c: targetColumn,
  });
}

function getColumnTargetCell(
  worksheet,
  columnIndex
) {
  const range = worksheet["!ref"];

  if (!range) {
    return XLSX.utils.encode_cell({
      r: 0,
      c: columnIndex,
    });
  }

  const decodedRange =
    XLSX.utils.decode_range(range);

  const targetRow =
    decodedRange.e.r + 1;

  return XLSX.utils.encode_cell({
    r: targetRow,
    c: columnIndex,
  });
}

/* =========================================================
   EXPLICIT CELL DETECTION
========================================================= */

function extractExplicitCell(instruction) {
  if (!instruction) {
    return null;
  }

  const match = instruction.match(
    /\b([A-Z]{1,3}[1-9][0-9]*)\b/i
  );

  if (!match) {
    return null;
  }

  return match[1].toUpperCase();
}

/* =========================================================
   LOCAL FORMULA ENGINE
=========================================================

   This is the most important part.

   Common requests are processed WITHOUT Gemini.

   Therefore a temporary Gemini 503 does not affect:
   - Total
   - Average
   - Highest
   - Lowest
   - Count
   - Profit
========================================================= */

function generateLocalFormula(
  workbook,
  instruction
) {
  const text = normalizeText(instruction);

  /*
    ---------------------------------------------------------
    TOTAL
    ---------------------------------------------------------
  */

  if (
    text.includes("total") ||
    text.includes("sum")
  ) {
    let column = null;

    if (
      text.includes("sales") ||
      text.includes("revenue")
    ) {
      column = findColumn(
        workbook.Sheets[workbook.SheetNames[0]],
        ["sales", "revenue"]
      );
    }

    /*
      Try generic keyword extraction from workbook.
    */
    if (!column) {
      const firstSheet =
        workbook.Sheets[
          workbook.SheetNames[0]
        ];

      const columns = getColumns(firstSheet);

      column =
        columns.find((col) =>
          text.includes(col.normalized)
        ) || null;
    }

    if (column) {
      const sheet =
        workbook.Sheets[
          workbook.SheetNames[0]
        ];

      const dataRange =
        getColumnDataRange(
          sheet,
          column.letter
        );

      if (dataRange) {
        const targetCell =
          extractExplicitCell(instruction) ||
          getColumnTargetCell(
            sheet,
            column.index
          );

        return {
          sheet: workbook.SheetNames[0],
          targetCell,
          formula: `=SUM(${dataRange})`,
          explanation: `This formula calculates the total of the ${column.header} column.`,
          source: "local",
        };
      }
    }
  }

  /*
    ---------------------------------------------------------
    AVERAGE
    ---------------------------------------------------------
  */

  if (
    text.includes("average") ||
    text.includes("mean")
  ) {
    const sheet =
      workbook.Sheets[
        workbook.SheetNames[0]
      ];

    let column = null;

    if (
      text.includes("sales") ||
      text.includes("revenue")
    ) {
      column = findColumn(
        sheet,
        ["sales", "revenue"]
      );
    }

    if (!column) {
      const columns = getColumns(sheet);

      column =
        columns.find((col) =>
          text.includes(col.normalized)
        ) || null;
    }

    if (column) {
      const dataRange =
        getColumnDataRange(
          sheet,
          column.letter
        );

      if (dataRange) {
        const targetCell =
          extractExplicitCell(instruction) ||
          getColumnTargetCell(
            sheet,
            column.index
          );

        return {
          sheet: workbook.SheetNames[0],
          targetCell,
          formula: `=AVERAGE(${dataRange})`,
          explanation: `This formula calculates the average of the ${column.header} column.`,
          source: "local",
        };
      }
    }
  }

  /*
    ---------------------------------------------------------
    HIGHEST / MAX
    ---------------------------------------------------------
  */

  if (
    text.includes("highest") ||
    text.includes("maximum") ||
    text.includes("max value") ||
    text.includes("largest")
  ) {
    const sheet =
      workbook.Sheets[
        workbook.SheetNames[0]
      ];

    let column = null;

    if (
      text.includes("sales") ||
      text.includes("revenue")
    ) {
      column = findColumn(
        sheet,
        ["sales", "revenue"]
      );
    }

    if (!column) {
      const columns = getColumns(sheet);

      column =
        columns.find((col) =>
          text.includes(col.normalized)
        ) || null;
    }

    if (column) {
      const dataRange =
        getColumnDataRange(
          sheet,
          column.letter
        );

      if (dataRange) {
        const targetCell =
          extractExplicitCell(instruction) ||
          getColumnTargetCell(
            sheet,
            column.index
          );

        return {
          sheet: workbook.SheetNames[0],
          targetCell,
          formula: `=MAX(${dataRange})`,
          explanation: `This formula finds the highest value in the ${column.header} column.`,
          source: "local",
        };
      }
    }
  }

  /*
    ---------------------------------------------------------
    LOWEST / MIN
    ---------------------------------------------------------
  */

  if (
    text.includes("lowest") ||
    text.includes("minimum") ||
    text.includes("min value") ||
    text.includes("smallest")
  ) {
    const sheet =
      workbook.Sheets[
        workbook.SheetNames[0]
      ];

    let column = null;

    if (
      text.includes("sales") ||
      text.includes("revenue")
    ) {
      column = findColumn(
        sheet,
        ["sales", "revenue"]
      );
    }

    if (!column) {
      const columns = getColumns(sheet);

      column =
        columns.find((col) =>
          text.includes(col.normalized)
        ) || null;
    }

    if (column) {
      const dataRange =
        getColumnDataRange(
          sheet,
          column.letter
        );

      if (dataRange) {
        const targetCell =
          extractExplicitCell(instruction) ||
          getColumnTargetCell(
            sheet,
            column.index
          );

        return {
          sheet: workbook.SheetNames[0],
          targetCell,
          formula: `=MIN(${dataRange})`,
          explanation: `This formula finds the lowest value in the ${column.header} column.`,
          source: "local",
        };
      }
    }
  }

  /*
    ---------------------------------------------------------
    COUNT PRODUCTS / NON-EMPTY VALUES
    ---------------------------------------------------------
  */

  if (
    text.includes("count") ||
    text.includes("number of")
  ) {
    const sheet =
      workbook.Sheets[
        workbook.SheetNames[0]
      ];

    let column = null;

    if (text.includes("product")) {
      column = findColumn(
        sheet,
        ["product", "products", "productname"]
      );
    }

    if (!column) {
      const columns = getColumns(sheet);

      column =
        columns.find((col) =>
          text.includes(col.normalized)
        ) || null;
    }

    if (column) {
      const dataRange =
        getColumnDataRange(
          sheet,
          column.letter
        );

      if (dataRange) {
        const targetCell =
          extractExplicitCell(instruction) ||
          getColumnTargetCell(
            sheet,
            column.index
          );

        return {
          sheet: workbook.SheetNames[0],
          targetCell,
          formula: `=COUNTA(${dataRange})`,
          explanation: `This formula counts the non-empty values in the ${column.header} column.`,
          source: "local",
        };
      }
    }
  }

  /*
    ---------------------------------------------------------
    PROFIT
    ---------------------------------------------------------
  */

  if (
    text.includes("profit")
  ) {
    const sheet =
      workbook.Sheets[
        workbook.SheetNames[0]
      ];

    const salesColumn =
      findColumn(
        sheet,
        ["sales", "revenue"]
      );

    const costColumn =
      findColumn(
        sheet,
        ["cost", "expense", "expenses"]
      );

    if (salesColumn && costColumn) {
      const salesRange =
        getColumnDataRange(
          sheet,
          salesColumn.letter
        );

      const costRange =
        getColumnDataRange(
          sheet,
          costColumn.letter
        );

      if (salesRange && costRange) {
        const targetCell =
          extractExplicitCell(instruction) ||
          getColumnTargetCell(
            sheet,
            salesColumn.index
          );

        return {
          sheet: workbook.SheetNames[0],
          targetCell,
          formula: `=SUM(${salesRange})-SUM(${costRange})`,
          explanation:
            `This formula calculates total profit by subtracting total ${costColumn.header} from total ${salesColumn.header}.`,
          source: "local",
        };
      }
    }
  }

  /*
    Nothing understood locally.
    Gemini will handle it.
  */

  return null;
}

/* =========================================================
   GEMINI RETRY DETECTION
========================================================= */

function isRetryableGeminiError(error) {
  const message =
    error?.message || "";

  const code = String(
    error?.status ||
    error?.code ||
    ""
  );

  return (
    code.includes("429") ||
    code.includes("408") ||
    code.includes("500") ||
    code.includes("503") ||
    code.includes("504") ||
    code.includes("RESOURCE_EXHAUSTED") ||
    code.includes("UNAVAILABLE") ||
    message.includes("429") ||
    message.includes("503") ||
    message.includes("504") ||
    message.includes("RESOURCE_EXHAUSTED") ||
    message.includes("UNAVAILABLE") ||
    message.toLowerCase().includes("high demand") ||
    message.toLowerCase().includes("overloaded") ||
    message.toLowerCase().includes("temporarily")
  );
}

/* =========================================================
   SLEEP
========================================================= */

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/* =========================================================
   GEMINI CALL WITH RETRIES + FALLBACK MODELS
========================================================= */

async function generateWithGemini(prompt) {
  let lastError = null;

  /*
    Two attempts per model.

    4 models x 2 attempts = maximum 8 calls.

    Backoff:
    2 sec
    4 sec
    8 sec
    ...
  */

  for (
    let modelIndex = 0;
    modelIndex < GEMINI_MODELS.length;
    modelIndex++
  ) {
    const model =
      GEMINI_MODELS[modelIndex];

    for (
      let attempt = 1;
      attempt <= 2;
      attempt++
    ) {
      try {
        console.log("");
        console.log(
          "===================================="
        );
        console.log(
          `Gemini model: ${model}`
        );
        console.log(
          `Attempt: ${attempt}/2`
        );
        console.log(
          "===================================="
        );

        const response =
          await ai.models.generateContent({
            model,
            contents: prompt,

            config: {
              responseMimeType:
                "application/json",

              /*
                Formula generation does not need
                expensive reasoning.
              */
              temperature: 0.1,

              maxOutputTokens: 500,
            },
          });

        console.log(
          `Gemini SUCCESS: ${model}`
        );

        return response;
      } catch (error) {
        lastError = error;

        console.error(
          `Gemini failed: ${model}`
        );

        console.error(
          error?.message || error
        );

        /*
          Non-temporary errors should not be
          endlessly retried.
        */
        if (!isRetryableGeminiError(error)) {
          throw error;
        }

        /*
          If this was the second attempt,
          immediately move to next model.
        */
        if (attempt === 2) {
          console.log(
            `Moving to fallback model...`
          );

          break;
        }

        /*
          Exponential backoff with small jitter.
        */
        const baseDelay =
          2000 * Math.pow(2, attempt - 1);

        const jitter =
          Math.floor(
            Math.random() * 1000
          );

        const delay =
          baseDelay + jitter;

        console.log(
          `Temporary Gemini error. Retrying in ${
            delay / 1000
          } seconds...`
        );

        await sleep(delay);
      }
    }
  }

  throw lastError;
}

/* =========================================================
   GEMINI RESPONSE PARSER
========================================================= */

function parseGeminiJSON(responseText) {
  if (!responseText) {
    throw new Error(
      "Gemini returned an empty response."
    );
  }

  let cleanText =
    responseText.trim();

  /*
    Remove accidental markdown fences.
  */
  if (cleanText.startsWith("```")) {
    cleanText =
      cleanText
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();
  }

  try {
    return JSON.parse(cleanText);
  } catch (error) {
    console.error(
      "Invalid Gemini JSON:"
    );

    console.error(cleanText);

    throw new Error(
      "Gemini returned invalid JSON."
    );
  }
}

/* =========================================================
   APPLY FORMULA
========================================================= */

function applyFormula(
  worksheet,
  targetCell,
  formula
) {
  const existingCell =
    worksheet[targetCell];

  /*
    Never overwrite existing data.
  */
  if (
    existingCell &&
    (
      existingCell.v !== undefined ||
      existingCell.f !== undefined
    )
  ) {
    throw new Error(
      `Cell ${targetCell} already contains data. MoxelAI did not overwrite it.`
    );
  }

  worksheet[targetCell] = {
    t: "n",
    f: formula.substring(1),
  };

  /*
    Expand worksheet range.
  */
  const existingRange =
    worksheet["!ref"];

  if (existingRange) {
    const range =
      XLSX.utils.decode_range(
        existingRange
      );

    const target =
      XLSX.utils.decode_cell(
        targetCell
      );

    range.s.r = Math.min(
      range.s.r,
      target.r
    );

    range.s.c = Math.min(
      range.s.c,
      target.c
    );

    range.e.r = Math.max(
      range.e.r,
      target.r
    );

    range.e.c = Math.max(
      range.e.c,
      target.c
    );

    worksheet["!ref"] =
      XLSX.utils.encode_range(
        range
      );
  } else {
    worksheet["!ref"] =
      `${targetCell}:${targetCell}`;
  }
}

/* =========================================================
   MAIN ROUTE
========================================================= */

router.post(
  "/",
  upload.single("file"),
  async (req, res) => {
    try {
      console.log("");
      console.log(
        "===================================="
      );
      console.log(
        "       MOXELAI FORMULA API"
      );
      console.log(
        "===================================="
      );

      /* ---------------------------------------------------
         API KEY
      --------------------------------------------------- */

      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({
          success: false,
          error:
            "GEMINI_API_KEY is missing from backend/.env",
        });
      }

      /* ---------------------------------------------------
         FILE
      --------------------------------------------------- */

      const file = req.file;

      if (!file) {
        return res.status(400).json({
          success: false,
          error:
            "No Excel file was uploaded.",
        });
      }

      console.log(
        "Uploaded:",
        file.originalname
      );

      if (!isExcelFile(file)) {
        return res.status(400).json({
          success: false,
          error:
            "Please upload an Excel file (.xlsx or .xls).",
        });
      }

      /* ---------------------------------------------------
         UPLOAD INPUT FILE TO CLOUDINARY
      --------------------------------------------------- */

      let inputCloudinary = null;
      if (isCloudinaryConfigured()) {
        try {
          inputCloudinary = await uploadBufferToCloudinary(file.buffer, {
            originalname: file.originalname,
            mimetype: file.mimetype,
            folder: "moxcel/formula_inputs",
          });
          console.log(
            "[Cloudinary] Uploaded input file:",
            inputCloudinary.secure_url
          );
        } catch (cloudErr) {
          console.warn(
            "[Cloudinary] Input upload error (continuing with local processing):",
            cloudErr.message
          );
        }
      }

      /* ---------------------------------------------------
         INSTRUCTION
      --------------------------------------------------- */

      const instruction =
        req.body.instruction;

      if (
        !instruction ||
        typeof instruction !== "string" ||
        !instruction.trim()
      ) {
        return res.status(400).json({
          success: false,
          error:
            "Please enter a spreadsheet instruction.",
        });
      }

      console.log(
        "Instruction:",
        instruction
      );

      /* ---------------------------------------------------
         READ WORKBOOK
      --------------------------------------------------- */

      console.log(
        "Reading Excel workbook..."
      );

      const workbook =
        XLSX.read(file.buffer, {
          type: "buffer",
          cellFormula: true,
        });

      if (
        !workbook.SheetNames ||
        workbook.SheetNames.length === 0
      ) {
        return res.status(400).json({
          success: false,
          error:
            "The Excel file does not contain any sheets.",
        });
      }

      console.log(
        "Sheets:",
        workbook.SheetNames
      );

      /* ===================================================
         STEP 1
         TRY LOCAL FORMULA ENGINE FIRST
      =================================================== */

      console.log(
        "Trying local formula engine..."
      );

      let result =
        generateLocalFormula(
          workbook,
          instruction
        );

      /* ===================================================
         STEP 2
         IF LOCAL ENGINE CANNOT UNDERSTAND,
         USE GEMINI
      =================================================== */

      if (!result) {
        console.log(
          "Local engine could not understand request."
        );

        console.log(
          "Using Gemini AI..."
        );

        const workbookInfo =
          getWorkbookInfo(
            workbook
          );

        const prompt = `
You are MoxelAI, an intelligent Excel spreadsheet assistant.

The user uploaded a REAL Excel workbook.

USER REQUEST:
${instruction.trim()}

REAL WORKBOOK INFORMATION:
${JSON.stringify(
  workbookInfo,
  null,
  2
)}

Generate ONE valid Excel formula that performs the user's requested operation.

Return ONLY valid JSON.

Use exactly:

{
  "sheet": "exact sheet name",
  "targetCell": "B12",
  "formula": "=SUM(B2:B11)",
  "explanation": "Short explanation."
}

RULES:

1. Use ONLY existing sheet names.
2. Use ONLY existing columns.
3. Never invent a sheet.
4. Never invent a column.
5. Formula MUST start with "=".
6. Do not overwrite existing cells.
7. If target cell is not specified, choose an empty cell below or beside the relevant data.
8. Use SUM for totals.
9. Use AVERAGE for averages.
10. Use MAX for highest values.
11. Use MIN for lowest values.
12. Use COUNT for numeric counts.
13. Use COUNTA for non-empty values.
14. If calculating profit and Sales and Cost columns exist, calculate Sales minus Cost.
15. Do not use external workbook references.
16. Do not use WEBSERVICE.
17. Do not use FILTERXML.
18. Do not use HYPERLINK.
19. Do not use RTD.
20. Do not use CALL.
21. Return ONLY JSON.
22. Do not use markdown.
`;

        const geminiResponse =
          await generateWithGemini(
            prompt
          );

        result =
          parseGeminiJSON(
            geminiResponse.text
          );

        result.source =
          "gemini";
      }

      /* ===================================================
         VALIDATE RESULT
      =================================================== */

      const sheet =
        result.sheet;

      let targetCell =
        result.targetCell;

      const formula =
        result.formula;

      const explanation =
        result.explanation;

      /* ---------------------------------------------------
         SHEET VALIDATION
      --------------------------------------------------- */

      if (
        !sheet ||
        !workbook.SheetNames.includes(
          sheet
        )
      ) {
        return res.status(500).json({
          success: false,
          error:
            `MoxelAI selected an invalid sheet: ${sheet}`,
        });
      }

      /* ---------------------------------------------------
         FORMULA VALIDATION
      --------------------------------------------------- */

      if (
        !isSafeFormula(formula)
      ) {
        return res.status(400).json({
          success: false,
          error:
            "MoxelAI generated an invalid or unsafe Excel formula.",
        });
      }

      /* ---------------------------------------------------
         TARGET CELL
      --------------------------------------------------- */

      const worksheet =
        workbook.Sheets[sheet];

      if (
        !targetCell ||
        !isValidCell(targetCell)
      ) {
        targetCell =
          getDefaultTargetCell(
            worksheet
          );
      }

      targetCell =
        targetCell
          .trim()
          .toUpperCase();

      /* ---------------------------------------------------
         APPLY
      --------------------------------------------------- */

      console.log("");
      console.log(
        "===================================="
      );
      console.log(
        "FORMULA RESULT"
      );
      console.log(
        "===================================="
      );

      console.log(
        "Source:",
        result.source
      );

      console.log(
        "Sheet:",
        sheet
      );

      console.log(
        "Target:",
        targetCell
      );

      console.log(
        "Formula:",
        formula
      );

      applyFormula(
        worksheet,
        targetCell,
        formula
      );

      /* ===================================================
         CREATE OUTPUT EXCEL
      =================================================== */

      console.log(
        "Creating updated Excel..."
      );

      const outputBuffer =
        XLSX.write(workbook, {
          type: "buffer",
          bookType: "xlsx",
          compression: true,
        });

      const fileBase64 =
        outputBuffer.toString(
          "base64"
        );

      const originalName =
        file.originalname ||
        "spreadsheet.xlsx";

      const baseName =
        originalName.replace(
          /\.(xlsx|xls)$/i,
          ""
        );

      const outputFileName =
        `${baseName}_MoxelAI.xlsx`;

      /* ---------------------------------------------------
         UPLOAD OUTPUT FILE TO CLOUDINARY
      --------------------------------------------------- */

      let outputCloudinary = null;
      if (isCloudinaryConfigured()) {
        try {
          outputCloudinary = await uploadBufferToCloudinary(outputBuffer, {
            originalname: outputFileName,
            mimetype:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            folder: "moxcel/formula_outputs",
          });
          console.log(
            "[Cloudinary] Uploaded generated file:",
            outputCloudinary.secure_url
          );
        } catch (cloudErr) {
          console.warn(
            "[Cloudinary] Output upload error:",
            cloudErr.message
          );
        }
      }

      /* ===================================================
         SUCCESS
      =================================================== */

      console.log("");
      console.log(
        "===================================="
      );
      console.log(
        "MOXELAI SUCCESS"
      );
      console.log(
        "===================================="
      );

      return res.json({
        success: true,

        formula,

        explanation:
          explanation ||
          "MoxelAI successfully applied the requested formula.",

        sheet,

        targetCell,

        source:
          result.source,

        fileName:
          outputFileName,

        fileBase64,

        fileUrl:
          outputCloudinary?.secure_url || null,

        originalFileUrl:
          inputCloudinary?.secure_url || null,

        cloudinaryPublicId:
          outputCloudinary?.public_id || null,
      });
    } catch (error) {
      console.error("");
      console.error(
        "===================================="
      );
      console.error(
        "MOXELAI FORMULA ERROR"
      );
      console.error(
        "===================================="
      );

      console.error(
        error?.message || error
      );

      /* ---------------------------------------------------
         FRIENDLY 503 RESPONSE
      --------------------------------------------------- */

      if (
        isRetryableGeminiError(
          error
        )
      ) {
        return res.status(503).json({
          success: false,
          error:
            "MoxelAI could not reach the AI service after automatic retries and fallback models. Please try again shortly.",
        });
      }

      return res.status(500).json({
        success: false,
        error:
          error?.message ||
          "An unexpected server error occurred.",
      });
    }
  }
);

module.exports = router;