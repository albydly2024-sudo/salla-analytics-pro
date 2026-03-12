const express = require('express');
const router = express.Router();
const customersController = require('../controllers/customers');

router.get('/', customersController.getCustomers);

module.exports = router;
