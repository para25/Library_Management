// controllers/importController.js

const axios = require('axios');
const Book = require('../models/bookModel');

// Import books from Frappe API
exports.importBooks = async(req, res) => {
    try {
        const { title, authors, isbn, publisher, pages = 20 } = req.body;

        // Calculate how many pages of API data we need to fetch
        const booksToFetch = Number(pages);
        const limitPerCall = 20;
        const totalPages = Math.ceil(booksToFetch / limitPerCall);

        let importedBooks = [];

        // Loop through pages and fetch data
        for (let i = 1; i <= totalPages; i++) {
            const response = await axios.get('https://frappe.io/api/method/frappe-library', {
                params: {
                    page: i,
                    title,
                    authors,
                    isbn,
                    publisher
                }
            });

            const apiBooks = response.data.message || [];

            // Map and insert books into MongoDB
            for (const book of apiBooks) {
                const exists = await Book.findOne({ bookID: book.bookID });

                if (!exists) {
                    const newBook = new Book({
                        bookID: book.bookID,
                        title: book.title,
                        authors: book.authors,
                        isbn: book.isbn,
                        isbn13: book.isbn13,
                        publisher: book.publisher,
                        numPages: Number(book.num_pages) || 0,
                        averageRating: book.average_rating,
                        languageCode: book.language_code,
                        publicationDate: book.publication_date,
                        ratingsCount: book.ratings_count,
                        stock: 1 // default 1 copy
                    });

                    await newBook.save();
                    importedBooks.push(newBook);
                }
            }
        }

        res.status(200).json({
            message: `Successfully imported ${importedBooks.length} new books.`,
            books: importedBooks
        });

    } catch (error) {
        console.error('Error importing books:', error.message);
        res.status(500).json({ message: 'Failed to import books', error: error.message });
    }
};