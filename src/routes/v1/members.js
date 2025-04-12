const express = require('express');
const router = express.Router();
const memberController = require('../../controllers/member');
const isAuth = require('../../middlewares/isAuth');

router.get('/profile', isAuth, memberController.getMemberProfile);

module.exports = router;
