//models/bookModel.js

const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({

    bookID: {
        type: String,
        unique: true,
        sparse: true, // Allows null for manually added books
        default: undefined // Instead of null
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    authors: {
        type: String,
        required: true,
        trim: true
    },
    isbn: {
        type: String,
        default: '',
        trim: true
    },
    isbn13: {
        type: String,
        default: '',
        trim: true
    },
    publisher: {
        type: String,
        default: '',
        trim: true
    },
    numPages: {
        type: Number,
        default: 0
    },

    // Library management fields
    stock: {
        type: Number,
        required: true,
        default: 1,
        min: 0
    },
    rentPerDay: {
        type: Number,
        required: true,
        default: 10, // ₹10 per day
        min: 0
    },

    // Additional info from Frappe API
    averageRating: {
        type: String,
        default: '0'
    },
    languageCode: {
        type: String,
        default: 'eng'
    },
    publicationDate: {
        type: String, // Store as string since API gives "5/10/2006"
        default: ''
    },
    ratingsCount: {
        type: String,
        default: '0'
    }
}, {
    timestamps: true
});

// Index for search
bookSchema.index({ title: 'text', authors: 'text' });

module.exports = mongoose.model('Book', bookSchema);