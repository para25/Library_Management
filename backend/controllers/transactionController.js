const Transaction = require('../models/transactionModel');
const Member = require('../models/memberModel');
const Book = require('../models/bookModel');


const issueBook = async(req, res) => {
    try {
        const { bookId, memberId } = req.body;

        if (!bookId || !memberId) {
            return res.status(400).json({ message: 'Book ID and Member ID are required.' });
        }

        // Check if book exists
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Book not found.' });
        }

        // Check stock availability
        if (book.stock <= 0) {
            return res.status(400).json({ message: 'Book not available in stock.' });
        }

        // Check if member exists
        const member = await Member.findById(memberId);
        if (!member) {
            return res.status(404).json({ message: 'Member not found.' });
        }

        // Check if member debt exceeds ₹500
        if (member.outstandingDebt >= 500) {
            return res.status(400).json({ message: 'Member outstanding debt exceeds ₹500. Cannot issue new books.' });
        }

        // Check if member already has this book issued
        const memberHasBook = await Transaction.findOne({
            book: bookId,
            member: memberId,
            status: 'issued',
        });

        if (memberHasBook) {
            return res.status(400).json({ message: 'Member has already issued this book.' });
        }

        // Decrease stock by 1
        book.stock -= 1;
        await book.save();

        // Create new transaction
        const transaction = new Transaction({
            book: bookId,
            member: memberId,
            issueDate: new Date(),
            status: 'issued',
        });

        const savedTransaction = await transaction.save();

        res.status(201).json({
            message: 'Book issued successfully.',
            transaction: savedTransaction,
        });
    } catch (error) {
        console.error('Error issuing book:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const returnBook = async(req, res) => {
    try {
        const { id } = req.params; // transaction ID
        const { returnDate } = req.body;

        const transaction = await Transaction.findById(id).populate('book member');

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found.' });
        }

        if (transaction.status === 'returned') {
            return res.status(400).json({ message: 'This book has already been returned.' });
        }

        // Calculate rent
        const issuedDate = new Date(transaction.issueDate);
        const returnedDate = returnDate ? new Date(returnDate) : new Date();
        const daysBorrowed = Math.ceil((returnedDate - issuedDate) / (1000 * 60 * 60 * 24));

        const rentFee = daysBorrowed * transaction.book.rentPerDay;

        // Get member and check if debt would exceed ₹500 BEFORE making changes
        const member = await Member.findById(transaction.member._id);
        const newDebt = member.outstandingDebt + rentFee;

        if (newDebt > 500) {
            return res.status(400).json({
                message: `Cannot return book. Total debt would be ₹${newDebt}, exceeding the ₹500 limit.`,
                currentDebt: member.outstandingDebt,
                rentFee: rentFee,
                totalDebt: newDebt
            });
        }

        // All checks passed - now update everything

        // Update transaction
        transaction.returnDate = returnedDate;
        transaction.rentFee = rentFee;
        transaction.status = 'returned';
        await transaction.save();

        // Update member's debt
        member.outstandingDebt = newDebt;
        await member.save();

        // Increase stock by 1
        const book = await Book.findById(transaction.book._id);
        book.stock += 1;
        await book.save();

        res.json({
            message: `Book returned successfully. Rent Fee: ₹${rentFee}`,
            transaction,
            memberDebt: member.outstandingDebt
        });
    } catch (error) {
        console.error('Error returning book:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Get all transactions
const getAllTransactions = async(req, res) => {
    try {
        const transactions = await Transaction.find()
            .populate('book', 'title authors')
            .populate('member', 'name email')
            .sort({ createdAt: -1 });

        res.json({
            total: transactions.length,
            transactions
        });
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Get transactions by member ID
const getTransactionsByMember = async(req, res) => {
    try {
        const { memberId } = req.params;

        const transactions = await Transaction.find({ member: memberId })
            .populate('book', 'title authors rentPerDay')
            .sort({ createdAt: -1 });

        res.json({
            total: transactions.length,
            transactions
        });
    } catch (error) {
        console.error('Error fetching member transactions:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    issueBook,
    returnBook,
    getAllTransactions,
    getTransactionsByMember
};