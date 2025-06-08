const express = require('express');
const router = express.Router();
const toolsController = require('../../controllers/tools');

router.post('/addUserPoints', toolsController.addUserPoints);
router.post('/addPointsPlan', toolsController.addPointsPlan);
router.delete('/deletePointsPlan/:id', toolsController.deletePointsPlan);
module.exports = router;
