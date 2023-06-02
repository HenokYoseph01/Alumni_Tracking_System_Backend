// Path
const path = require("path");
// Multer
const multer = require("multer");
// File Checker
const checkFileType = require("./checkFileType");

// Upload
const upload = multer({
  storage: multer.diskStorage({}),
  limits: { fileSize: 5 * 1024 * 1024 }, // File size limit: 5MB
  fileFilter: function (req, file, callBack) {
    checkFileType(req, file, callBack);
  },
});
// Export
module.exports = upload;