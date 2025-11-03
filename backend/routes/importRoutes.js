const express = require('express');
const router = express.Router();
const { importBooks } = require('../controllers/importController');

// Import books from Frappe API
router.post('/', importBooks);

module.exports = router;
