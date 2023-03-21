//require express
const express = require('express');

//Router
const router = express.Router();

//Login Controllers
const loginController = require('./controller');

router.post('/',loginController.login)

module.exports = router;