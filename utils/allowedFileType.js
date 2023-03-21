/**
 * this file add all alowed types of image uploaded
 
 */

// AppError
const AppError = require('./appError');

module.exports = (...fileTypes) => {
  return (req, res, next) => {
    if (fileTypes.length === 0) {
      return  next(new AppError("Please add allowed file types",400));
    }
    // Add allowed file types to the req object
    req.fileTypes = fileTypes;
    next();
  };
};

