const express = require('express');
const router = express.Router();
const userController = require('../../controllers/user');
const { authenticateJWT } = require('../../middlewares/auth');

router.get('/profile', authenticateJWT, userController.getMemberProfile);
router.put('/profile', authenticateJWT, userController.updateMemberProfile);

module.exports = router;
