const express = require('express');
const memberRouter = require('./members');
// const orderRouter = require('./orders');

const router = express.Router();

router.use('/members', memberRouter);
// router.use('/orders', orderRouter);

module.exports = router;
