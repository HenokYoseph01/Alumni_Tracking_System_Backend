//require express
const express = require('express');

//Router
const router = express.Router();

//Protect
const protect = require('../protect')

//Controllers
const headController = require('./controller');

//Authorization
const authorize = require('../authorization');

//File uploader
const upload = require('../../utils/cloudinaryUpload')

//Routers


router.route('/')
.get(protect,authorize('Head'),headController.getHeadProfile)
.patch(protect,authorize('Head'),headController.updateHead)

router.route('/event')
.get(headController.getAllEvent)
.post(protect,authorize('Head'),headController.createEvent)
.delete(protect,authorize('Head'),headController.deleteAllEvent)

router.route('/event/:eventId')
.get(protect,authorize('Head'),headController.getSingleEvent)
.patch(protect,authorize('Head'),headController.updateEvent)
.delete(protect,authorize('Head'),headController.deleteSingleEvent)

router.get('/alumni',protect,authorize('Head'),headController.getAlumnus)
router.post('/generatereport',upload.single('report'),headController.generateReport,headController.download)

router.get('/specific',protect,authorize('Head'),headController.findSpecficItem)
router.patch('/changePassword',protect,headController.changeHeadPassword)

//Export router
module.exports = router