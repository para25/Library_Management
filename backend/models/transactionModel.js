//models/transactionModel.js

const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    member: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member',
        required: true
    },
    issueDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    returnDate: {
        type: Date,
        default: null
    },
    rentFee: {
        type: Number,
        default: 0,
        min: 0
    },
    status: {
        type: String,
        enum: ['issued', 'returned'],
        default: 'issued'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Transaction', transactionSchema);