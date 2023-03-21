const cloudinary = require("cloudinary").v2;
const config = require('../config')

cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.cl_apiKey,
  api_secret: config.cloudinary.cl_apiSecret,
});


// exposrt cloudinary
module.exports = cloudinary;