/**
 * This code for checking file type
 * @param {*} file
 * @param {*} callBack
 * @returns
 */
 
 // Path
 const path = require("path");
// AppError 
 const AppError = require('./appError');

 function checkFileType(req, file, callBack) {
   // Allowed file types
   const allowedFileTypes = req.fileTypes;
 
   // File Extension
   const fileExtension = path.extname(file.originalname).split(".")[1];
 
  //  // File mime type
  //  const fileMimeType = file.mimetype.split("/")[1];

 
   // Check both extension and mime type
   if (
     !allowedFileTypes.includes(fileExtension)
   ) {
     return callBack( 
      new AppError("invalid file type",400)
      );
   }
   callBack(null, true);
 }
 
 module.exports = checkFileType;