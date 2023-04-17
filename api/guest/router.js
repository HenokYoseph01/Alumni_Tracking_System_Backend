//require express
const express = require('express');

//Router
const router = express.Router();

//Guest Controller
const guestController = require('./controller')


router.get('/event',guestController.getAllEvents)
router.get('/event/:eventId',guestController.getSingleEvent)
router.get('/alumni/:alumniId',guestController.getMinimumAlumniInfo)

module.exports = router;