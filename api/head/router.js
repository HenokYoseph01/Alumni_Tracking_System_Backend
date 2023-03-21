//require express
const express = require('express');

//Router
const router = express.Router();

//Protect
const protect = require('../protect')

//Controllers
const headController = require('./controller');

//Routers
router.post('/login',headController.login)

router.route('/')
.get(protect,headController.getHeadProfile)
.patch(protect,headController.updateHead)

router.route('/event')
.get(headController.getAllEvent)
.post(protect,headController.createEvent)
.delete(protect,headController.deleteAllEvent)

router.route('/event/:eventId')
.get(headController.getSingleEvent)
.patch(protect,headController.updateEvent)
.delete(protect,headController.deleteSingleEvent)

router.get('/alumni',headController.getAlumnus)
router.post('/generatereport',protect,headController.generateReport)

router.get('/specific',protect,headController.findSpecficItem)

//Export router
module.exports = router