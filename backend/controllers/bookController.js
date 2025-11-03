// backend/controllers/bookController.js

const { get } = require('mongoose');
const Book = require('../models/bookModel');

const createBook = async(req, res) => {
    try {
        const { bookID, title, authors, isbn, isbn13, publisher, numPages, stock, rentPerDay, averageRating, languageCode, publicationDate, ratingsCount } = req.body;

        if (!title || !authors) {
            return res.status(400).json({ message: 'Title and Authors are required.' });
        }
        const bookData = {
            title: title.trim(),
            authors: typeof authors === 'string' ? authors.trim() : Array.isArray(authors) ? authors.join('/') : String(authors),
            isbn: isbn ? String(isbn).trim() : '',
            isbn13: isbn13 ? String(isbn13).trim() : '',
            publisher: publisher ? String(publisher).trim() : '',
            numPages: numPages ? Number(numPages) : 0,
            stock: typeof stock !== 'undefined' ? Number(stock) : 1,
            rentPerDay: typeof rentPerDay !== 'undefined' ? Number(rentPerDay) : 10,
            averageRating: averageRating ? String(averageRating) : '0',
            languageCode: languageCode ? String(languageCode).trim() : 'eng',
            publicationDate: publicationDate ? String(publicationDate).trim() : '',
            ratingsCount: ratingsCount ? String(ratingsCount) : '0'
        };

        // Only add bookID if it's provided
        if (bookID) {
            bookData.bookID = bookID.trim();
        }

        const book = new Book(bookData);
        const saved = await book.save();

        return res.status(201).json({ message: 'Book created', book: saved })
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: "Duplicate key error", error: err.keyValue })
        }
        console.error('createbook error', err)
        return res.status(500).json({ message: 'Server error', error: err.message })
    }
}

/**
 * Update an existing book
 * PUT /api/books/:id
 */


const updateBook = async(req, res) => {
    try {
        const { id } = req.params;
        const update = {...req.body };

        if (update.authors && Array.isArray(update.authors)) {
            update.authors = update.authors.join('/');
        } else if (update.authors && typeof update.authors === 'string') {
            update.authors = update.authors.trim();
        }

        delete update._id;

        const updated = await Book.findByIdAndUpdate(id, update, { new: true, runValidators: true });
        if (!updated) return res.status(404).json({ message: 'Book not found.' })
        return res.status(200).json({ message: 'Book updated', book: updated });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ message: "Duplicate key error", error: err.keyValue })
        }
        console.error('updateBook error', err)
        return res.status(500).json({ message: 'Server error', error: err.message })
    }
}



const getBookById = async(req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findById(id);
        if (!book) return res.status(404).json({ message: 'Book not found' });
        return res.json({ book });
    } catch (err) {
        console.error('getBookById error:', err);
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
};




const listBooks = async(req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page || '1'));
        const limit = Math.max(1, parseInt(req.query.limit || '20'));
        const skip = (page - 1) * limit;

        const [books, total] = await Promise.all([
            Book.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
            Book.countDocuments()
        ]);

        return res.json({
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
            books
        });
    } catch (err) {
        console.error('listBooks error:', err);
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
};


const searchBooks = async(req, res) => {
    try {
        const q = (req.query.q || '').trim();
        if (!q) {
            return res.status(400).json({ message: 'Query parameter q is required' });
        }

        // Use text search (relies on your text index)
        const page = Math.max(1, parseInt(req.query.page || '1'));
        const limit = Math.max(1, parseInt(req.query.limit || '20'));
        const skip = (page - 1) * limit;

        const results = await Book.find({ $text: { $search: q } }, { score: { $meta: 'textScore' } })
            .sort({ score: { $meta: 'textScore' } })
            .skip(skip)
            .limit(limit);

        const total = await Book.countDocuments({ $text: { $search: q } });

        return res.json({
            q,
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
            results
        });
    } catch (err) {
        console.error('searchBooks error:', err);
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
};




module.exports = {
    createBook,
    updateBook,
    getBookById,
    listBooks,
    searchBooks
};