// Configs
const config = require("../../config");

// Send Development error
const sendDevError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    errorStack: err.stack,
  });
};

// Global error handler
const geh = (err, req, res, next) => {
  // Get the status and status code
  err.status = err.status || "ERROR";
  err.statusCode = err.statusCode || 500;

  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  

  // Handle error for development environment
  if (config.env === "development") {
    sendDevError(err, res);
  }
};

// Export global error handler
module.exports = geh;