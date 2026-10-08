const { v2: cloudinary } = require("cloudinary");
const { Readable } = require("stream");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

// =====================================================
// CLOUDINARY CONFIGURATION
// =====================================================

if (process.env.CLOUDINARY_URL) {
  cloudinary.config();
} else {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

/**
 * Check whether Cloudinary has valid credentials configured.
 * @returns {boolean}
 */
function isCloudinaryConfigured() {
  if (process.env.CLOUDINARY_URL) {
    return true;
  }
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  return Boolean(
    cloudName &&
    apiKey &&
    apiSecret &&
    cloudName !== "your_cloud_name" &&
    apiKey !== "your_api_key" &&
    apiSecret !== "your_api_secret"
  );
}

/**
 * Get sanitized Cloudinary configuration status (without exposing secrets).
 * @returns {object}
 */
function getCloudinaryStatus() {
  const configured = isCloudinaryConfigured();
  return {
    configured,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || (process.env.CLOUDINARY_URL ? "configured_via_url" : null),
    hasApiKey: Boolean(process.env.CLOUDINARY_API_KEY || process.env.CLOUDINARY_URL),
    hasApiSecret: Boolean(process.env.CLOUDINARY_API_SECRET || process.env.CLOUDINARY_URL),
  };
}

/**
 * Determine the Cloudinary resource_type for a file.
 * @param {string} [mimetype]
 * @param {string} [filename]
 * @returns {"image" | "video" | "raw"}
 */
function determineResourceType(mimetype = "", filename = "") {
  const ext = path.extname(filename || "").toLowerCase();
  const imageExts = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".bmp", ".ico"];
  const videoExts = [".mp4", ".mov", ".avi", ".webm", ".mkv", ".mp3", ".wav"];

  if (imageExts.includes(ext) || mimetype.startsWith("image/")) {
    return "image";
  }
  if (videoExts.includes(ext) || mimetype.startsWith("video/") || mimetype.startsWith("audio/")) {
    return "video";
  }
  // Spreadsheets (.xlsx, .xls, .csv), PDF, documents, zips are handled as "raw"
  return "raw";
}

/**
 * Upload a Buffer to Cloudinary via stream.
 *
 * @param {Buffer} buffer - File buffer from multer memoryStorage
 * @param {object} options
 * @param {string} [options.originalname] - Original file name
 * @param {string} [options.mimetype] - File MIME type
 * @param {string} [options.folder] - Target Cloudinary folder (default: 'moxcel_uploads')
 * @param {string} [options.resource_type] - 'image' | 'video' | 'raw' | 'auto'
 * @param {string} [options.public_id] - Optional custom public ID
 * @returns {Promise<object>} Cloudinary upload result
 */
function uploadBufferToCloudinary(buffer, options = {}) {
  return new Promise((resolve, reject) => {
    if (!isCloudinaryConfigured()) {
      return reject(
        new Error(
          "Cloudinary credentials are not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in backend/.env"
        )
      );
    }

    if (!buffer || !Buffer.isBuffer(buffer)) {
      return reject(new Error("Invalid buffer provided for Cloudinary upload."));
    }

    const originalName = options.originalname || options.fileName || "file";
    const ext = path.extname(originalName);
    const baseName = path
      .basename(originalName, ext)
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .substring(0, 50) || "file";

    const resourceType =
      options.resource_type ||
      determineResourceType(options.mimetype, originalName);

    const folder = options.folder || "moxcel_uploads";
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);

    // For "raw" files (like .xlsx, .xls, .csv), Cloudinary serves the file with proper extension
    // only if the public_id includes the extension.
    let publicId = options.public_id;
    if (!publicId) {
      if (resourceType === "raw" && ext) {
        publicId = `${baseName}_${timestamp}_${randomSuffix}${ext}`;
      } else {
        publicId = `${baseName}_${timestamp}_${randomSuffix}`;
      }
    }

    const uploadOptions = {
      folder,
      resource_type: resourceType,
      public_id: publicId,
      use_filename: false,
      unique_filename: false,
      overwrite: true,
      ...options.cloudinaryOptions,
    };

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          console.error("[Cloudinary] Upload error:", error);
          return reject(error);
        }
        resolve(result);
      }
    );

    Readable.from(buffer).pipe(uploadStream);
  });
}

/**
 * Delete a file from Cloudinary by public ID.
 *
 * @param {string} publicId - Cloudinary public ID
 * @param {"image" | "video" | "raw"} [resourceType="raw"]
 * @returns {Promise<object>}
 */
function deleteFromCloudinary(publicId, resourceType = "raw") {
  return new Promise((resolve, reject) => {
    if (!isCloudinaryConfigured()) {
      return reject(new Error("Cloudinary credentials not configured."));
    }

    cloudinary.uploader.destroy(
      publicId,
      { resource_type: resourceType },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
  });
}

module.exports = {
  cloudinary,
  isCloudinaryConfigured,
  getCloudinaryStatus,
  determineResourceType,
  uploadBufferToCloudinary,
  deleteFromCloudinary,
};
