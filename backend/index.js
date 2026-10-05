const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// =====================================================
// LOAD ENVIRONMENT VARIABLES
// =====================================================

dotenv.config();


// =====================================================
// CREATE EXPRESS APP
// =====================================================

const app = express();


// =====================================================
// MIDDLEWARE
// =====================================================

// Allow requests from your Next.js frontend
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "OPTIONS",
    ],
    credentials: true,
  })
);


// Parse JSON requests
app.use(
  express.json({
    limit: "10mb",
  })
);


// Parse URL encoded data
app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);


// =====================================================
// IMPORT ROUTERS
// =====================================================

const chatRouter =
  require("./router/chatRouter");

const formulaRouter =
  require("./router/formulaRouter");


// =====================================================
// API ROUTES
// =====================================================

// Chat
app.use(
  "/api/chat",
  chatRouter
);


// Formula Generator + Excel Processing
app.use(
  "/api/formula",
  formulaRouter
);


// =====================================================
// HOME / HEALTH CHECK
// =====================================================

app.get(
  "/",
  (req, res) => {

    res.status(200).json({
      success: true,
      message:
        "MoxelAI Backend is running",
      port: 5000,
    });

  }
);


// =====================================================
// API HEALTH CHECK
// =====================================================

app.get(
  "/api/health",
  (req, res) => {

    res.status(200).json({
      success: true,
      message:
        "MoxelAI API is healthy",
    });

  }
);


// =====================================================
// 404 HANDLER
// =====================================================

app.use(
  (req, res) => {

    res.status(404).json({
      success: false,
      error:
        `Route not found: ${req.method} ${req.originalUrl}`,
    });

  }
);


// =====================================================
// GLOBAL ERROR HANDLER
// =====================================================

app.use(
  (error, req, res, next) => {

    console.error(
      "===================================="
    );

    console.error(
      "MoxelAI Backend Error"
    );

    console.error(
      error
    );

    console.error(
      "===================================="
    );


    res.status(
      error.status || 500
    ).json({

      success: false,

      error:
        error.message ||
        "Internal server error.",

    });

  }
);


// =====================================================
// START SERVER
// =====================================================

const PORT =
  process.env.PORT || 5000;


app.listen(
  PORT,
  () => {

    console.log(
      "===================================="
    );

    console.log(
      "        MoxelAI BACKEND"
    );

    console.log(
      "===================================="
    );

    console.log(
      `Server running on port ${PORT}`
    );

    console.log(
      `http://localhost:${PORT}`
    );

    console.log(
      "------------------------------------"
    );

    console.log(
      "Available routes:"
    );

    console.log(
      `GET  http://localhost:${PORT}/`
    );

    console.log(
      `GET  http://localhost:${PORT}/api/health`
    );

    console.log(
      `POST http://localhost:${PORT}/api/chat`
    );

    console.log(
      `POST http://localhost:${PORT}/api/formula`
    );

    console.log(
      "===================================="
    );

  }
);