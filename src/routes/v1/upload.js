const express = require('express');
const router = express.Router();
const upload = require('../../middlewares/upload');
const uploadErrorHandler = require('../../middlewares/uploadErrorHandler');
const { authenticateJWT } = require('../../middlewares/auth');
const uploadController = require('../../controllers/upload');

router.post('/', authenticateJWT, upload.any(), uploadErrorHandler, uploadController.uploadImage);

module.exports = router;
