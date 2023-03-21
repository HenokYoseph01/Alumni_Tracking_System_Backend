//require express
const express = require('express');

//Router
const router = express.Router();

//Protect
const protect = require('../protect')

//File uploader
const fileUploader = require('../../utils/fileUploader')

//Allowed File type
const allowedFileType = require('../../utils/allowedFileType')

//Controllers
const alumniController = require('./controller');

// Alumni routes
router.post("/register",protect,allowedFileType('png','jpeg','jpg')
            ,fileUploader.single('avatar'),alumniController.register,alumniController.uploadPhoto);
router.post("/login",alumniController.login);

router.route('/')
.get(protect,alumniController.getAlumniProfile)
.patch(protect,alumniController.updateProfle)

router.patch('/changepassword',protect,alumniController.changePassword)


router.route('/forum')
.post(protect,alumniController.createForum)
.get(protect,alumniController.getAllForum)

router.get('/forum/me',protect,alumniController.getAuthorForum);

router.route('/forum/:forumId')
.get(protect,alumniController.getSingleForum)
.patch(protect,alumniController.updateForum)
.delete(protect,alumniController.deleteForum)

router.route('/forum/reply/:forumId')
.get(protect,alumniController.getReplyToForum)
.post(protect,alumniController.replyForum)

router.route('/forum/reply/:forumId/:replyId')
.patch(protect,alumniController.updateRepliesToForum)
.delete(protect,alumniController.deleteRepliesToForum)

router.get('/forum/alumni/:forumId',protect,alumniController.getMinimumAlumniInfo)

router.post('/forum/report/:forumId',protect,alumniController.reportForum);

router.get('/event',protect,alumniController.getAllEvents)
router.get('/event/:eventId',protect,alumniController.getSingleEvent)

//Export router
module.exports = router