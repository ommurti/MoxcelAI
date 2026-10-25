
const express = require("express");
const multer = require("multer");
const ExcelJS = require("exceljs");
const { GoogleGenAI } = require("@google/genai");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const MODEL = [
  "gemini-3.8-flash",
  "gemini-3.7-flash",
  "gemini-3.6-flash",
  "gemini-3.5-flash",

];

const ALLOWED_ACTIONS = [
  "format_workbook",
  "rename_column",
  "add_formula_column",
  "sort_rows",
  "remove_duplicates",
  "trim_text",
  "uppercase_text",
  "lowercase_text",
  "add_total_row",
  "highlight_greater_than",
];

function columnLetter(number) {
  let result = "";

  while (number > 0) {
    const remainder = (number - 1) % 26;
    result = String.fromCharCode(65 + remainder) + result;
    number = Math.floor((number - 1) / 26);
  }

  return result;
}

function normalizeHeader(value) {
  return String(value ?? "").trim().toLowerCase();
}

function findColumn(sheet, name) {
  const wanted = normalizeHeader(name);
  const headers = sheet.getRow(1).values;

  for (let i = 1; i < headers.length; i++) {
    if (normalizeHeader(headers[i]) === wanted) {
      return i;
    }
  }

  throw new Error(`Column "${name}" was not found.`);
}

function getHeaderMap(sheet) {
  const map = {};
  const headers = sheet.getRow(1).values;

  for (let i = 1; i < headers.length; i++) {
    if (headers[i] != null && headers[i] !== "") {
      map[String(headers[i])] = columnLetter(i);
    }
  }

  return map;
}

function applyProfessionalFormatting(sheet) {
  const lastRow = sheet.rowCount;
  const lastCol = sheet.columnCount;

  if (lastRow < 1 || lastCol < 1) return;

  // Attractive dark-green header
  const header = sheet.getRow(1);

  header.height = 30;

  header.eachCell({ includeEmpty: true }, (cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF2F6B4F" },
    };

    cell.font = {
      bold: true,
      color: { argb: "FFFFFFFF" },
      size: 11,
    };

    cell.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };

    cell.border = {
      bottom: {
        style: "medium",
        color: { argb: "FFF2A07B" },
      },
    };
  });

  // Alternating rows, borders and readable alignment
  for (let r = 2; r <= lastRow; r++) {
    const row = sheet.getRow(r);

    row.eachCell({ includeEmpty: true }, (cell) => {
      if (r % 2 === 0) {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFF1F5F2" },
        };
      }

      cell.font = {
        name: "Aptos",
        size: 10,
        color: { argb: "FF202820" },
      };

      cell.alignment = {
        vertical: "middle",
        wrapText: true,
      };

      cell.border = {
        bottom: {
          style: "thin",
          color: { argb: "FFDCE4DE" },
        },
      };
    });

    row.height = 22;
  }

  // Auto-size columns without letting them become too wide
  for (let c = 1; c <= lastCol; c++) {
    const column = sheet.getColumn(c);
    let maxLength = 10;

    column.eachCell({ includeEmpty: true }, (cell) => {
      const value = cell.value;

      const text =
        value && typeof value === "object"
          ? String(value.result ?? value.text ?? "")
          : String(value ?? "");

      maxLength = Math.max(maxLength, text.length);
    });

    column.width = Math.min(maxLength + 3, 35);
  }

  sheet.views = [
    {
      state: "frozen",
      ySplit: 1,
      showGridLines: false,
    },
  ];

  sheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: lastRow, column: lastCol },
  };
}

function applyAction(sheet, action) {
  const { type } = action;

  if (!ALLOWED_ACTIONS.includes(type)) {
    throw new Error(`Unsupported action: ${type}`);
  }

  if (type === "format_workbook") {
    applyProfessionalFormatting(sheet);
    return `Formatted "${sheet.name}"`;
  }

  if (type === "rename_column") {
    const index = findColumn(sheet, action.from);
    sheet.getRow(1).getCell(index).value = action.to;
    return `Renamed "${action.from}" to "${action.to}"`;
  }

  if (type === "add_formula_column") {
    if (!action.name || !action.formula) {
      throw new Error("A column name and formula are required.");
    }

    const headers = sheet.getRow(1).values;
    const newColumn = sheet.columnCount + 1;

    sheet.getRow(1).getCell(newColumn).value = action.name;

    // Only allow formulas that reference existing columns
    // and the current row. Never execute AI-generated code.
    const formula = String(action.formula);

    if (
      !/^[A-Z]+\d+\s*([+\-*/])\s*[A-Z]+\d+$/.test(formula) &&
      !/^SUM\([A-Z]+:\s*[A-Z]+\)$/.test(formula)
    ) {
      throw new Error(
        `Unsupported formula "${formula}". Use a simple cell calculation such as D2*E2.`
      );
    }

    for (let r = 2; r <= sheet.rowCount; r++) {
      const rowFormula = formula.replace(
        /\d+/g,
        (number) => {
          // Replace row numbers in cell references with current row.
          return String(r);
        }
      );

      sheet.getRow(r).getCell(newColumn).value = {
        formula: rowFormula,
      };
    }

    return `Added formula column "${action.name}"`;
  }

  if (type === "sort_rows") {
    const index = findColumn(sheet, action.column);
    const direction = action.order === "desc" ? -1 : 1;

    const rows = [];

    for (let r = 2; r <= sheet.rowCount; r++) {
      rows.push(sheet.getRow(r).values.slice(1));
    }

    rows.sort((a, b) => {
      const x = a[index - 1];
      const y = b[index - 1];

      const nx = Number(x);
      const ny = Number(y);

      let comparison;

      if (x !== "" && y !== "" &&
          !Number.isNaN(nx) && !Number.isNaN(ny)) {
        comparison = nx - ny;
      } else {
        comparison = String(x ?? "").localeCompare(
          String(y ?? ""),
          undefined,
          { numeric: true, sensitivity: "base" }
        );
      }

      return comparison * direction;
    });

    rows.forEach((values, i) => {
      sheet.spliceRows(i + 2, 1, values);
    });

    return `Sorted by "${action.column}"`;
  }

  if (type === "remove_duplicates") {
    const seen = new Set();

    for (let r = sheet.rowCount; r >= 2; r--) {
      const values = sheet.getRow(r).values.slice(1);
      const key = JSON.stringify(values);

      if (seen.has(key)) {
        sheet.spliceRows(r, 1);
      } else {
        seen.add(key);
      }
    }

    return "Removed duplicate rows";
  }

  if (type === "trim_text" ||
      type === "uppercase_text" ||
      type === "lowercase_text") {
    const index = action.column
      ? findColumn(sheet, action.column)
      : null;

    for (let r = 2; r <= sheet.rowCount; r++) {
      const row = sheet.getRow(r);
      const start = index || 1;
      const end = index || sheet.columnCount;

      for (let c = start; c <= end; c++) {
        const cell = row.getCell(c);

        if (typeof cell.value !== "string") continue;

        if (type === "trim_text") {
          cell.value = cell.value.trim();
        } else if (type === "uppercase_text") {
          cell.value = cell.value.toUpperCase();
        } else {
          cell.value = cell.value.toLowerCase();
        }
      }
    }

    return `${type.replaceAll("_", " ")} completed`;
  }

  if (type === "add_total_row") {
    const rowNumber = sheet.rowCount + 1;
    const row = sheet.getRow(rowNumber);

    row.getCell(1).value = action.label || "Total";

    const columns = action.columns || [];

    for (const name of columns) {
      const index = findColumn(sheet, name);
      const letter = columnLetter(index);

      row.getCell(index).value = {
        formula: `SUM(${letter}2:${letter}${rowNumber - 1})`,
      };
    }

    row.eachCell({ includeEmpty: true }, (cell) => {
      cell.font = { bold: true, color: { argb: "FF2F6B4F" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFFD0B5" },
      };
    });

    return "Added a total row";
  }

  if (type === "highlight_greater_than") {
    const index = findColumn(sheet, action.column);
    const threshold = Number(action.value);

    if (!Number.isFinite(threshold)) {
      throw new Error("Highlight threshold must be a number.");
    }

    for (let r = 2; r <= sheet.rowCount; r++) {
      const cell = sheet.getRow(r).getCell(index);

      if (Number(cell.value) > threshold) {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFFFD0B5" },
        };

        cell.font = {
          bold: true,
          color: { argb: "FF75412B" },
        };
      }
    }

    return `Highlighted "${action.column}" values above ${threshold}`;
  }
}

// --------------------------------------------------
// MANIPULATE WORKBOOK
// --------------------------------------------------

router.post(
  "/manipulate",
  upload.single("file"),
  async (req, res) => {
    try {
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({
          success: false,
          message: "GEMINI_API_KEY is missing from backend/.env",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please upload an Excel .xlsx file.",
        });
      }

      if (!req.file.originalname.toLowerCase().endsWith(".xlsx")) {
        return res.status(400).json({
          success: false,
          message:
            "Please save your file as .xlsx before uploading it.",
        });
      }

      const prompt = String(req.body.prompt || "").trim();

      if (!prompt) {
        return res.status(400).json({
          success: false,
          message: "Please describe the changes you want.",
        });
      }

      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(req.file.buffer);

      const sheetDescriptions = workbook.worksheets.map((sheet) => {
        const headers = sheet.getRow(1).values
          .slice(1)
          .map((value) => String(value ?? ""));

        const sampleRows = [];

        for (let r = 2; r <= Math.min(sheet.rowCount, 6); r++) {
          sampleRows.push(sheet.getRow(r).values.slice(1));
        }

        return {
          sheet: sheet.name,
          headers,
          sampleRows,
          rowCount: sheet.rowCount,
        };
      });

      const aiPrompt = `
You are MoxcelAI, an Excel editing planner.

User request:
${prompt}

Workbook structure:
${JSON.stringify(sheetDescriptions, null, 2)}

Return ONLY valid JSON in this exact shape:
{
  "actions": [
    {
      "sheet": "Sheet1",
      "type": "format_workbook"
    }
  ]
}

Allowed action types:
- format_workbook
- rename_column: { "from": "Old Name", "to": "New Name" }
- add_formula_column: { "name": "Profit", "formula": "D2-E2" }
- sort_rows: { "column": "Sales", "order": "asc" or "desc" }
- remove_duplicates
- trim_text: optional "column"
- uppercase_text: optional "column"
- lowercase_text: optional "column"
- add_total_row: { "label": "Total", "columns": ["Sales", "Profit"] }
- highlight_greater_than: { "column": "Sales", "value": 50000 }

Rules:
1. Do not return JavaScript, code, macros, or arbitrary formulas.
2. Use only the allowed action types.
3. Use exact sheet and column names from the workbook.
4. Do not invent column names.
5. If the user asks for professional formatting, include format_workbook.
6. If a requested change cannot be represented by an allowed action, do not invent a new action.
7. Return actions in the order they should be applied.
8. Prefer a format_workbook action at the end to style the final result.
9. Return JSON only.
`;

      const result = await ai.models.generateContent({
        model: MODEL,
        contents: aiPrompt,
      });

      const raw = result.text || "";
      const jsonText = raw
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```$/, "")
        .trim();

      const plan = JSON.parse(jsonText);

      if (!Array.isArray(plan.actions) || plan.actions.length === 0) {
        throw new Error("The AI did not generate any valid editing actions.");
      }

      const changes = [];

      for (const action of plan.actions) {
        if (!ALLOWED_ACTIONS.includes(action.type)) {
          throw new Error(`Unsupported action: ${action.type}`);
        }

        const sheet = workbook.getWorksheet(action.sheet);

        if (!sheet) {
          throw new Error(`Sheet "${action.sheet}" was not found.`);
        }

        changes.push(applyAction(sheet, action));
      }

      // Ensure every sheet gets consistent, professional formatting.
      for (const sheet of workbook.worksheets) {
        applyProfessionalFormatting(sheet);
      }

      const output = await workbook.xlsx.writeBuffer();

      const baseName = req.file.originalname
        .replace(/\.xlsx$/i, "")
        .replace(/[^a-zA-Z0-9_-]/g, "_");

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );

      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${baseName}_MoxcelAI.xlsx"`
      );

      res.setHeader("Access-Control-Expose-Headers", "X-Moxcel-Changes");
      res.setHeader(
        "X-Moxcel-Changes",
        encodeURIComponent(JSON.stringify(changes))
      );

      return res.send(Buffer.from(output));
    } catch (error) {
      console.error("MANIPULATION ERROR:", error);

      return res.status(500).json({
        success: false,
        message:
          error.message || "Could not manipulate the Excel file.",
      });
    }
  }
);

module.exports = router;
