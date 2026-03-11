const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/orders');

router.get('/', ordersController.getOrders);

module.exports = router;
