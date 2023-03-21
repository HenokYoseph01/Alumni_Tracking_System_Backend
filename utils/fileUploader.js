/**
 * this file use multer to get the file sent from user and set in req.file or req.files
 */

// Multer
const multer = require("multer");

// File Checker
const checkFileType = require("./checkFileType");

//Require path
const path = require('path')

// Upload
const upload = multer({
  storage: multer.diskStorage({
    destination: (req,file,cb) =>{
      cb(null,'files')
    },
    filename: (req,file,cb)=>{
      cb(null,'List_'+Date.now()+ path.extname(file.originalname));
    }
  }),
  limits: { fileSize: 1024 * 1024 }, // File size limit: 5MB
  fileFilter: function (req, file, callBack) {
    checkFileType(req, file, callBack);
  },
});

// Export
module.exports = upload;