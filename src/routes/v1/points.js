const express = require('express');
const router = express.Router();
const pointsController = require('../../controllers/points');
// const { authenticateJWT } = require('../../middlewares/auth');

// router.post('/purchase', authenticateJWT, pointsController.purchasePoints);
router.get('/', pointsController.getPoints);

module.exports = router;
