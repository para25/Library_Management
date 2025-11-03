const express = require('express');
const router = express.Router();
const { issueBook, returnBook, getAllTransactions, getTransactionsByMember } = require('../controllers/transactionController');

// Get all transactions
router.get('/', getAllTransactions);

// Get transactions by member ID
router.get('/member/:memberId', getTransactionsByMember);

// Issue book to member
router.post('/issue', issueBook);

// Return book (requires transaction ID in URL)
router.put('/return/:id', returnBook);

module.exports = router;