//require express
const express = require('express');

//Router
const router = express.Router();

//Protect
const protect = require('../protect')

//Admin Controllers
const adminController = require('./controller');

//File Uploader
const fileUploader = require('../../utils/fileUploader')
const allowedFileType = require('../../utils/allowedFileType')

router.route('/alumniaccount').post(allowedFileType('xlsx','xls','xml'),fileUploader.single('list'),adminController.createAlumniAccount);
router.route('/alumniaccountmanual').post(adminController.createAlumniAccountManually)
router.route('/headaccount').post(adminController.createHeadAccount)
router.route('/adminaccount').post(adminController.createAdminAccount)
router.route('/')
.get(protect,adminController.getAdmin)
.patch(protect,adminController.updateAdmin)
router.route('/alumni/:alumniId').get(adminController.getAlumniInfo)

router.get('/moderation',protect,adminController.getModerationList)
router.get('/moderation/:forumId',protect,adminController.getPost)
router.get('/moderation/warning/:alumniId',protect,adminController.giveWarning)
router.get('/moderation/ban/:alumniId',protect,adminController.banAlumni)
router.delete('/moderation/delete/:forumId',protect,adminController.deletePost)
router.delete('/moderation/skip/:reportId',protect,adminController.skipReport)
router.patch('/changePassword',protect,adminController.changeAdminPassword)


//Export the router
module.exports = router;