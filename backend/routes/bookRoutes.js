const express = require('express');
const router = express.Router();
const bookCtrl = require('../controllers/bookController');


router.get('/search', bookCtrl.searchBooks);

router.post('/', bookCtrl.createBook);
router.get('/', bookCtrl.listBooks);
router.get('/:id', bookCtrl.getBookById);
router.put('/:id', bookCtrl.updateBook);

module.exports = router;