const express = require('express');
const { initializeDatabase, getTransactions, getStatistics } = require('../controllers/productController');

const router = express.Router();

router.get('/init', initializeDatabase);
router.get('/transactions', getTransactions);
router.get('/statistics', getStatistics);

module.exports = router;
