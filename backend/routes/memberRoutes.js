const express = require('express');
const router = express.Router();
const {
    addMember,
    deleteMember,
    getAllMembers,
    getMemberById,
    searchMembers
} = require('../controllers/memberController');

// Search route MUST come before /:id route
router.get('/search', searchMembers);

// CRUD routes
router.post('/', addMember);
router.get('/', getAllMembers);
router.get('/:id', getMemberById);
router.delete('/:id', deleteMember);

module.exports = router;