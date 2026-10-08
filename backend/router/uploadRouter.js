const express = require("express");
const multer = require("multer");
const {
  isCloudinaryConfigured,
  getCloudinaryStatus,
  uploadBufferToCloudinary,
  deleteFromCloudinary,
} = require("../config/cloudinary");

const router = express.Router();

// Multer memory storage (keeps file in memory buffer for Cloudinary streaming)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024, // 25 MB limit
  },
});

// =====================================================
// GET /api/upload/status - Check Cloudinary configuration
// =====================================================
router.get("/status", (req, res) => {
  const status = getCloudinaryStatus();
  return res.json({
    success: true,
    ...status,
    message: status.configured
      ? "Cloudinary is properly configured and active."
      : "Cloudinary is not yet configured. Please add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in backend/.env",
  });
});

// =====================================================
// POST /api/upload - Upload single or multiple files
// =====================================================
router.post(
  "/",
  upload.fields([
    { name: "file", maxCount: 1 },
    { name: "files", maxCount: 10 },
  ]),
  async (req, res) => {
    try {
      if (!isCloudinaryConfigured()) {
        return res.status(503).json({
          success: false,
          error:
            "Cloudinary credentials are not configured in backend/.env. Please configure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.",
        });
      }

      const singleFile = req.files?.file?.[0] || req.file;
      const multipleFiles = req.files?.files || [];
      const filesToUpload = singleFile
        ? [singleFile]
        : multipleFiles.length > 0
        ? multipleFiles
        : [];

      if (filesToUpload.length === 0) {
        return res.status(400).json({
          success: false,
          error: "No file was uploaded. Send a file with key 'file' or 'files'.",
        });
      }

      const targetFolder = req.body.folder || "moxcel_uploads";

      const uploadPromises = filesToUpload.map(async (file) => {
        const result = await uploadBufferToCloudinary(file.buffer, {
          originalname: file.originalname,
          mimetype: file.mimetype,
          folder: targetFolder,
        });

        return {
          originalName: file.originalname,
          size: file.size,
          mimetype: file.mimetype,
          public_id: result.public_id,
          url: result.secure_url || result.url,
          secure_url: result.secure_url,
          format: result.format,
          resource_type: result.resource_type,
          bytes: result.bytes,
          created_at: result.created_at,
        };
      });

      const results = await Promise.all(uploadPromises);

      if (singleFile && !multipleFiles.length) {
        return res.status(200).json({
          success: true,
          message: "File uploaded successfully to Cloudinary.",
          file: results[0],
        });
      }

      return res.status(200).json({
        success: true,
        message: `${results.length} file(s) uploaded successfully to Cloudinary.`,
        files: results,
      });
    } catch (error) {
      console.error("[UploadRouter Error]:", error);
      return res.status(500).json({
        success: false,
        error: error.message || "Failed to upload file to Cloudinary.",
      });
    }
  }
);

// =====================================================
// DELETE /api/upload - Delete file from Cloudinary
// =====================================================
router.delete("/", async (req, res) => {
  try {
    const { public_id, resource_type } = req.body;

    if (!public_id) {
      return res.status(400).json({
        success: false,
        error: "Missing required parameter: 'public_id'.",
      });
    }

    if (!isCloudinaryConfigured()) {
      return res.status(503).json({
        success: false,
        error: "Cloudinary is not configured.",
      });
    }

    const result = await deleteFromCloudinary(
      public_id,
      resource_type || "raw"
    );

    return res.json({
      success: true,
      message: "File deleted successfully from Cloudinary.",
      result,
    });
  } catch (error) {
    console.error("[UploadRouter Delete Error]:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to delete file from Cloudinary.",
    });
  }
});

module.exports = router;
